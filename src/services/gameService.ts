import {
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    onSnapshot,
    type Unsubscribe,
    deleteDoc,
    getDocs,
} from 'firebase/firestore';
import { db, COLLECTIONS, auth } from '../config/firebase';
import type { GameSession, Participant } from '../types';
import { generateGameId, sanitizeInput } from '../utils/helpers';
import { getAvatarColor } from '../types';
import { RATE_LIMITS } from '../config/rateLimits';

/**
 * Create a new game session
 */
export const createGameSession = async (
    hostName: string,
    isSpectator: boolean = false
): Promise<{ gameId: string; participantId: string }> => {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('Not authenticated');

    const gameId = generateGameId();
    const now = Date.now();
    const sanitizedName = sanitizeInput(hostName, 50);

    // Create game session
    const gameSession: GameSession = {
        id: gameId,
        name: `${sanitizedName}'s Planning Poker`,
        createdAt: now,
        createdBy: uid,
        currentIssue: null,
        votesRevealed: false,
        hostId: uid,
    };

    // Create host participant
    const host: Participant = {
        id: uid,
        name: sanitizedName,
        avatar: sanitizedName.charAt(0).toUpperCase(),
        color: getAvatarColor(0),
        joinedAt: now,
        isHost: true,
        isSpectator,
    };

    // Save to Firestore
    await setDoc(doc(db, COLLECTIONS.GAME_SESSIONS, gameId), gameSession);
    await setDoc(
        doc(db, COLLECTIONS.GAME_SESSIONS, gameId, COLLECTIONS.PARTICIPANTS, uid),
        host
    );

    return { gameId, participantId: uid };
};

/**
 * Join an existing game session
 */
export const joinGameSession = async (
    gameId: string,
    participantName: string,
    isSpectator: boolean = false
): Promise<{ participantId: string; success: boolean; error?: string }> => {
    try {
        const uid = auth.currentUser?.uid;
        if (!uid) return { participantId: '', success: false, error: 'Not authenticated' };

        // Check if game exists
        const gameDoc = await getDoc(doc(db, COLLECTIONS.GAME_SESSIONS, gameId));
        if (!gameDoc.exists()) {
            return { participantId: '', success: false, error: 'Game not found' };
        }

        // Get existing participants to determine color
        const participantsRef = collection(
            db,
            COLLECTIONS.GAME_SESSIONS,
            gameId,
            COLLECTIONS.PARTICIPANTS
        );
        const participantsSnap = await getDocs(participantsRef);
        const participantCount = participantsSnap.size;

        if (participantCount >= RATE_LIMITS.MAX_PARTICIPANTS) {
            return { participantId: '', success: false, error: `Game is full (max ${RATE_LIMITS.MAX_PARTICIPANTS} participants)` };
        }
        const sanitizedName = sanitizeInput(participantName, 50);

        const participant: Participant = {
            id: uid,
            name: sanitizedName,
            avatar: sanitizedName.charAt(0).toUpperCase(),
            color: getAvatarColor(participantCount),
            joinedAt: Date.now(),
            isHost: false,
            isSpectator,
        };

        await setDoc(
            doc(db, COLLECTIONS.GAME_SESSIONS, gameId, COLLECTIONS.PARTICIPANTS, uid),
            participant
        );

        return { participantId: uid, success: true };
    } catch (error) {
        console.error('Error joining game:', error);
        return { participantId: '', success: false, error: 'Failed to join game' };
    }
};

/**
 * Get game session data
 */
export const getGameSession = async (gameId: string): Promise<GameSession | null> => {
    try {
        const gameDoc = await getDoc(doc(db, COLLECTIONS.GAME_SESSIONS, gameId));
        if (!gameDoc.exists()) return null;
        return gameDoc.data() as GameSession;
    } catch (error) {
        console.error('Error getting game session:', error);
        return null;
    }
};

/**
 * Listen to game session updates
 */
export const listenToGameSession = (
    gameId: string,
    callback: (session: GameSession | null) => void
): Unsubscribe => {
    return onSnapshot(
        doc(db, COLLECTIONS.GAME_SESSIONS, gameId),
        (snapshot) => {
            if (snapshot.exists()) {
                callback(snapshot.data() as GameSession);
            } else {
                callback(null);
            }
        },
        (error) => {
            console.error('Error listening to game session:', error);
            callback(null);
        }
    );
};

/**
 * Listen to participants in game session
 */
export const listenToParticipants = (
    gameId: string,
    callback: (participants: Participant[]) => void
): Unsubscribe => {
    const participantsRef = collection(
        db,
        COLLECTIONS.GAME_SESSIONS,
        gameId,
        COLLECTIONS.PARTICIPANTS
    );

    return onSnapshot(
        participantsRef,
        (snapshot) => {
            const participants = snapshot.docs.map(doc => doc.data() as Participant);
            callback(participants);
        },
        (error) => {
            console.error('Error listening to participants:', error);
            callback([]);
        }
    );
};

/**
 * Update game session
 */
export const updateGameSession = async (
    gameId: string,
    updates: Partial<GameSession>
): Promise<void> => {
    try {
        await updateDoc(doc(db, COLLECTIONS.GAME_SESSIONS, gameId), updates);
    } catch (error) {
        console.error('Error updating game session:', error);
        throw error;
    }
};

/**
 * Leave game session (remove participant)
 */
export const leaveGameSession = async (
    gameId: string,
    participantId: string
): Promise<void> => {
    try {
        await deleteDoc(
            doc(db, COLLECTIONS.GAME_SESSIONS, gameId, COLLECTIONS.PARTICIPANTS, participantId)
        );
    } catch (error) {
        console.error('Error leaving game:', error);
        throw error;
    }
};

/**
 * Remove a participant from the game (can be called by any player)
 * Also removes their votes
 */
export const removeParticipant = async (
    gameId: string,
    participantId: string
): Promise<void> => {
    try {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error('Not authenticated');

        // Verify caller is the host
        const session = await getGameSession(gameId);
        if (!session) throw new Error('Game not found');
        if (session.hostId !== uid) throw new Error('Only the host can remove participants');

        // Remove participant
        await deleteDoc(
            doc(db, COLLECTIONS.GAME_SESSIONS, gameId, COLLECTIONS.PARTICIPANTS, participantId)
        );

        // Remove their votes
        const votesRef = collection(db, COLLECTIONS.GAME_SESSIONS, gameId, COLLECTIONS.VOTES);
        const votesSnap = await getDocs(votesRef);

        const deletePromises = votesSnap.docs
            .filter(voteDoc => voteDoc.data().participantId === participantId)
            .map(voteDoc => deleteDoc(voteDoc.ref));

        await Promise.all(deletePromises);
    } catch (error) {
        console.error('Error removing participant:', error);
        throw error;
    }
};

/**
 * Set current issue being voted on
 */
export const setCurrentIssue = async (
    gameId: string,
    issueId: string | null
): Promise<void> => {
    await updateGameSession(gameId, { currentIssue: issueId });
};

/**
 * Reveal votes
 */
export const revealVotes = async (gameId: string): Promise<void> => {
    await updateGameSession(gameId, { votesRevealed: true });
};

/**
 * Reset votes for new round
 */
export const resetVotingRound = async (gameId: string): Promise<void> => {
    // Reset revealed state
    await updateGameSession(gameId, { votesRevealed: false });

    // Delete all votes
    const votesRef = collection(db, COLLECTIONS.GAME_SESSIONS, gameId, COLLECTIONS.VOTES);
    const votesSnap = await getDocs(votesRef);
    const deletePromises = votesSnap.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
};

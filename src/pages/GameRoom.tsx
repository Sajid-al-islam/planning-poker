import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Copy, Eye, RotateCcw, LogOut, Check } from 'lucide-react';
import { Button } from '../components/common/Button';
import { VotingCards } from '../components/game/VotingCards';
import { ParticipantCard } from '../components/game/ParticipantCard';
import { ResultsChart } from '../components/game/ResultsChart';
import { IssueSidebar } from '../components/game/IssueSidebar';
import { EmojiOverlay, EmojiContainer } from '../components/game/EmojiOverlay';
import type { GameSession, Participant, Vote, Issue, EmojiThrow, VoteValue } from '../types';
import {
    listenToGameSession,
    listenToParticipants,
    leaveGameSession,
    revealVotes,
    resetVotingRound,
    setCurrentIssue,
    removeParticipant,
} from '../services/gameService';
import { submitVote, listenToVotes, hasVoted, getParticipantVote } from '../services/voteService';
import { throwEmoji, listenToEmojis } from '../services/emojiService';
import { updateRecentEmojis } from '../components/game/QuickEmojiBar';
import {
    addIssue,
    listenToIssues,
    deleteIssue,
    markIssueEstimated,
    importIssuesFromCSV,
    exportIssuesToCSV,
} from '../services/issueService';
import { copyToClipboard, getGameUrl, calculateVoteStats } from '../utils/helpers';

export const GameRoom: React.FC = () => {
    const { gameId } = useParams<{ gameId: string }>();
    const navigate = useNavigate();

    // State
    const [gameSession, setGameSession] = useState<GameSession | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [votes, setVotes] = useState<Vote[]>([]);
    const [issues, setIssues] = useState<Issue[]>([]);
    const [emojis, setEmojis] = useState<EmojiThrow[]>([]);
    const [currentParticipantId, setCurrentParticipantId] = useState<string | null>(null);
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
    const [copied, setCopied] = useState(false);
    const [hoveredParticipantId, setHoveredParticipantId] = useState<string | null>(null);
    const [participantToRemove, setParticipantToRemove] = useState<Participant | null>(null);

    const currentParticipant = participants.find((p) => p.id === currentParticipantId);
    const isHost = currentParticipant?.isHost || false;

    // Initialize
    useEffect(() => {
        if (!gameId) return;

        // Get participant ID from localStorage
        const storedParticipantId = localStorage.getItem('currentParticipantId');
        if (!storedParticipantId) {
            // Redirect to create/join page with gameId as query param
            navigate(`/create?gameId=${gameId}`);
            return;
        }
        setCurrentParticipantId(storedParticipantId);

        // Setup listeners
        const unsubGame = listenToGameSession(gameId, setGameSession);
        const unsubParticipants = listenToParticipants(gameId, setParticipants);
        const unsubVotes = listenToVotes(gameId, setVotes);
        const unsubIssues = listenToIssues(gameId, setIssues);
        const unsubEmojis = listenToEmojis(gameId, setEmojis);

        return () => {
            unsubGame();
            unsubParticipants();
            unsubVotes();
            unsubIssues();
            unsubEmojis();
        };
    }, [gameId, navigate]);

    // Strict participant validation
    useEffect(() => {
        // Only run validation if we have participants loaded and a currentParticipantId
        if (participants.length > 0 && currentParticipantId) {
            const participantExists = participants.some(p => p.id === currentParticipantId);

            if (!participantExists) {
                console.warn('Participant not found in session, redirecting to join');
                localStorage.removeItem('currentParticipantId');
                // Keep gameId in localStorage so join page knows which game
                localStorage.setItem('currentGameId', gameId || '');
                navigate(`/create?gameId=${gameId}`);
            }
        }
    }, [participants, currentParticipantId, gameId, navigate]);

    // Auto-select issue logic
    useEffect(() => {
        if (!gameId || !gameSession || !isHost) return;

        const unestimatedIssues = issues.filter(issue => !issue.isEstimated);

        // If there's exactly one unestimated issue and no current issue selected, auto-select it
        if (unestimatedIssues.length === 1 && !gameSession.currentIssue) {
            setCurrentIssue(gameId, unestimatedIssues[0].id);
        }
        // If a new issue was just added (length increased), auto-select the newest one
        else if (unestimatedIssues.length > 0 && !gameSession.currentIssue) {
            // Get the most recently added issue (last in array)
            const newestIssue = unestimatedIssues[unestimatedIssues.length - 1];
            setCurrentIssue(gameId, newestIssue.id);
        }
    }, [gameId, gameSession, issues, isHost]);

    // Clear selected value when votes are reset (Fix for reset bug)
    useEffect(() => {
        if (!gameSession?.votesRevealed && votes.length === 0) {
            setSelectedValue(null);
        }
    }, [gameSession?.votesRevealed, votes.length]);

    // Handle vote selection
    const handleVoteSelect = (value: VoteValue) => {
        if (!gameId || !currentParticipantId) return;
        setSelectedValue(value);
        submitVote(gameId, currentParticipantId, value);
    };

    // Handle reveal votes
    const handleRevealVotes = async () => {
        if (!gameId) return;
        await revealVotes(gameId);
    };

    // Handle reset votes
    const handleResetVotes = async () => {
        if (!gameId) return;
        await resetVotingRound(gameId);
        setSelectedValue(null);
    };

    // Handle finalize estimate
    const handleFinalizeEstimate = async () => {
        if (!gameId || !gameSession?.currentIssue) return;

        const stats = calculateVoteStats(votes);
        if (!stats) return;

        // Use consensus or median as estimate
        const estimate = stats.consensus
            ? stats.mode[0]
            : stats.median.toString();

        await markIssueEstimated(gameId, gameSession.currentIssue, estimate);
        await setCurrentIssue(gameId, null);
        await resetVotingRound(gameId);
        setSelectedValue(null);
    };

    // Handle emoji throw (from full picker)
    const handleEmojiThrow = async (emoji: string) => {
        if (!gameId || !currentParticipantId || !selectedParticipant) return;

        const result = await throwEmoji(gameId, currentParticipantId, selectedParticipant.id, emoji);

        if (!result.success) {
            console.log(result);
            console.warn('Failed to throw emoji:', result.error);
            // Silently fail - rate limiting is normal behavior
        } else {
            // console.log('Emoji thrown successfully:', emoji);
            // Update recent emojis
            updateRecentEmojis(emoji);
        }
    };

    // Handle quick emoji click (from hover bar)
    const handleQuickEmojiClick = (participantId: string) => (emoji: string) => {
        if (!gameId || !currentParticipantId) return;

        throwEmoji(gameId, currentParticipantId, participantId, emoji).then(result => {
            if (result.success) {
                // Update recent emojis
                updateRecentEmojis(emoji);
            } else {
                console.warn('Rate limited:', result.error);
            }
        });
    };

    // Handle show full picker (from "+" button)
    const handleShowFullPicker = (participant: Participant) => () => {
        setSelectedParticipant(participant);
    };

    // Handle copy game link
    const handleCopyLink = async () => {
        if (!gameId) return;
        const success = await copyToClipboard(getGameUrl(gameId));
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Handle leave game
    const handleLeaveGame = async () => {
        if (!gameId || !currentParticipantId) return;
        await leaveGameSession(gameId, currentParticipantId);
        localStorage.removeItem('currentGameId');
        localStorage.removeItem('currentParticipantId');
        navigate('/');
    };

    // Handle remove participant
    const handleRemoveParticipant = (participant: Participant) => {
        setParticipantToRemove(participant);
    };

    // Confirm remove participant
    const confirmRemoveParticipant = async () => {
        if (!gameId || !participantToRemove) return;

        try {
            await removeParticipant(gameId, participantToRemove.id);
            setParticipantToRemove(null);
        } catch (error) {
            console.error('Failed to remove participant:', error);
        }
    };

    const cancelRemoveParticipant = () => {
        setParticipantToRemove(null);
    };

    if (!gameSession || !currentParticipantId) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner w-12 h-12"></div>
            </div>
        );
    }

    const currentIssue = issues.find((i) => i.id === gameSession.currentIssue);
    const userHasVoted = hasVoted(votes, currentParticipantId);
    const activeParticipants = participants.filter(p => !p.isSpectator);

    return (
        <div className="min-h-screen bg-[var(--landing-canvas)] pb-24 text-[var(--landing-ink)]">
            {/* Header */}
            <div className="border-b border-[var(--landing-hairline)] bg-[rgba(1,1,2,0.88)] backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:flex-row sm:items-center sm:justify-between md:px-6">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="rounded-full border border-[var(--landing-hairline)] bg-[var(--landing-surface-1)] px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[var(--landing-ink-tertiary)]">
                                Game Room
                            </span>
                            {gameSession.votesRevealed && (
                                <span className="rounded-full border border-[var(--landing-primary)] bg-[rgba(94,106,210,0.1)] px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[var(--landing-primary-hover)]">
                                    Results Revealed
                                </span>
                            )}
                        </div>
                        <h1 className="mt-4 truncate font-display text-[2rem] font-semibold tracking-[-0.05em] text-[var(--landing-ink)] md:text-[2.6rem]">
                            {gameSession.name}
                        </h1>
                        <p className="mt-1 text-sm text-[var(--landing-ink-subtle)]">Game ID: {gameId}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Button variant="ghost" size="sm" onClick={handleCopyLink} className="!border !border-[var(--landing-hairline)] !bg-[var(--landing-surface-1)] !text-[var(--landing-ink)] hover:!bg-[var(--landing-surface-2)]">
                            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                            {copied ? 'Copied!' : 'Copy Link'}
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleLeaveGame} className="!border-[var(--landing-primary)] !text-[var(--landing-primary-hover)] hover:!bg-[rgba(94,106,210,0.08)] hover:!text-white">
                            <LogOut className="w-4 h-4 mr-2" />
                            Leave
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 pt-8 md:px-6">
                {/* Current Issue */}
                {currentIssue && (
                    <div className="landing-room-panel mb-8 animate-slide-down p-6 md:p-8">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div>
                                <p className="landing-caption">Current Issue</p>
                                <h2 className="mt-3 font-display text-[2rem] font-semibold tracking-[-0.04em] text-[var(--landing-ink)]">
                                    {currentIssue.title}
                                </h2>
                            </div>
                            <div className="rounded-full border border-[var(--landing-hairline)] bg-[var(--landing-surface-2)] px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[var(--landing-primary-hover)]">
                                Active Round
                            </div>
                        </div>
                        {currentIssue.description && (
                            <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[var(--landing-ink-subtle)]">{currentIssue.description}</p>
                        )}
                    </div>
                )}

                {/* Participants Grid */}
                <div className="mb-10">
                    <div className="mb-5 flex flex-col items-center gap-2 text-center">
                        <p className="landing-caption">Room Presence</p>
                        <h3 className="font-display text-[2rem] font-semibold tracking-[-0.04em] text-[var(--landing-ink)]">
                            Participants ({participants.length})
                        </h3>
                    </div>
                    <div className="flex flex-wrap justify-center gap-5">
                        {participants.map((participant) => (
                            <div key={participant.id} id={`participant-${participant.id}`}>
                                <ParticipantCard
                                    participant={participant}
                                    hasVoted={hasVoted(votes, participant.id)}
                                    voteValue={getParticipantVote(votes, participant.id)}
                                    votesRevealed={gameSession.votesRevealed}
                                    onClick={() =>
                                        participant.id !== currentParticipantId && setSelectedParticipant(participant)
                                    }
                                    onEmojiClick={participant.id !== currentParticipantId ? handleQuickEmojiClick(participant.id) : undefined}
                                    onShowFullPicker={participant.id !== currentParticipantId ? handleShowFullPicker(participant) : undefined}
                                    showQuickBar={hoveredParticipantId === participant.id}
                                    onMouseEnter={() => participant.id !== currentParticipantId && setHoveredParticipantId(participant.id)}
                                    onMouseLeave={() => setHoveredParticipantId(null)}
                                    onRemove={() => handleRemoveParticipant(participant)}
                                    isCurrentUser={participant.id === currentParticipantId}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Voting Cards */}
                {currentIssue && !gameSession.votesRevealed && !currentParticipant?.isSpectator && (
                    <div className="landing-room-panel mb-10 p-6 md:p-8">
                        <VotingCards
                            selectedValue={selectedValue}
                            onSelectValue={handleVoteSelect}
                            disabled={userHasVoted}
                        />
                    </div>
                )}

                {/* Host Controls */}
                {isHost && currentIssue && (
                    <div className="mb-10 flex justify-center gap-4">
                        {!gameSession.votesRevealed ? (
                            <Button
                                onClick={handleRevealVotes}
                                disabled={votes.length === 0}
                                size="lg"
                                className="!bg-[var(--landing-primary)] hover:!bg-[var(--landing-primary-hover)]"
                            >
                                <Eye className="w-5 h-5 mr-2" />
                                Reveal Votes ({votes.length}/{activeParticipants.length})
                            </Button>
                        ) : (
                            <>
                                <Button onClick={handleResetVotes} variant="outline" size="lg" className="!border-[var(--landing-hairline-strong)] !text-[var(--landing-ink-muted)] hover:!bg-[var(--landing-surface-2)] hover:!text-white">
                                    <RotateCcw className="w-5 h-5 mr-2" />
                                    Reset Votes
                                </Button>
                                <Button onClick={handleFinalizeEstimate} size="lg" className="!bg-[var(--landing-primary)] hover:!bg-[var(--landing-primary-hover)]">
                                    <Check className="w-5 h-5 mr-2" />
                                    Finalize Estimate
                                </Button>
                            </>
                        )}
                    </div>
                )}

                {/* Results */}
                {gameSession.votesRevealed && votes.length > 0 && (
                    <div className="mb-8">
                        <ResultsChart
                            votes={votes.filter(v => {
                                const p = participants.find(p => p.id === v.participantId);
                                return p && !p.isSpectator;
                            })}
                        />
                    </div>
                )}
            </div>

            {/* Issue Sidebar */}
            <IssueSidebar
                issues={issues}
                currentIssueId={gameSession.currentIssue}
                onAddIssue={(title, description) => gameId && addIssue(gameId, title, description)}
                onSelectIssue={(issueId) => gameId && setCurrentIssue(gameId, issueId)}
                onMarkEstimated={(issueId, estimate) =>
                    gameId && markIssueEstimated(gameId, issueId, estimate)
                }
                onDeleteIssue={(issueId) => gameId && deleteIssue(gameId, issueId)}
                onImportCSV={(csvText) => gameId && importIssuesFromCSV(gameId, csvText)}
                onExportCSV={() => {
                    const csv = exportIssuesToCSV(issues);
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `planning-poker-issues-${gameId}.csv`;
                    a.click();
                }}
                isHost={isHost}
            />

            {/* Emoji Overlay */}
            <EmojiOverlay
                selectedParticipant={selectedParticipant}
                onClose={() => setSelectedParticipant(null)}
                onEmojiSelect={handleEmojiThrow}
                currentParticipantId={currentParticipantId}
            />

            {/* Emoji Container */}
            <EmojiContainer emojis={emojis} participants={participants} />

            {/* Remove Participant Confirmation Modal */}
            {participantToRemove && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={cancelRemoveParticipant}>
                    <div className="landing-room-panel max-w-md w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-4 text-white">Remove Participant?</h3>
                        <p className="text-[var(--landing-ink-muted)] mb-6">
                            Are you sure you want to remove <span className="font-semibold text-white">{participantToRemove.name}</span> from the game?
                            They will be redirected to the home page.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button variant="ghost" onClick={cancelRemoveParticipant} className="!border !border-[var(--landing-hairline)] !bg-[var(--landing-surface-1)]">
                                Cancel
                            </Button>
                            <Button variant="outline" onClick={confirmRemoveParticipant} className="!bg-red-500 hover:!bg-red-600 !border-red-500 !text-white">
                                Remove
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

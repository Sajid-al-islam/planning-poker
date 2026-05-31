import {
    collection,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    type Unsubscribe,
    query,
    orderBy,
    getDocs,
} from 'firebase/firestore';
import { db, COLLECTIONS } from '../config/firebase';
import type { Issue } from '../types';
import { generateId, sanitizeInput } from '../utils/helpers';
import { RATE_LIMITS } from '../config/rateLimits';

/**
 * Add a new issue to the game
 */
export const addIssue = async (
    gameId: string,
    title: string,
    description?: string,
    taskLink?: string
): Promise<string> => {
    try {
        const issueId = generateId();
        const sanitizedTitle = sanitizeInput(title, 200);
        const sanitizedDescription = description ? sanitizeInput(description, 2000) : undefined;
        const sanitizedTaskLink = taskLink ? sanitizeInput(taskLink, 500) : undefined;

        if (!sanitizedTitle) {
            throw new Error('Issue title cannot be empty');
        }

        // Get current issue count for ordering
        const issuesRef = collection(db, COLLECTIONS.GAME_SESSIONS, gameId, COLLECTIONS.ISSUES);
        const issuesSnap = await getDocs(issuesRef);
        const order = issuesSnap.size;

        if (order >= RATE_LIMITS.MAX_ISSUES) {
            throw new Error(`Maximum ${RATE_LIMITS.MAX_ISSUES} issues allowed per game`);
        }

        const issue = {
            id: issueId,
            title: sanitizedTitle,
            ...(sanitizedDescription && { description: sanitizedDescription }),
            ...(sanitizedTaskLink && { taskLink: sanitizedTaskLink }),
            createdAt: Date.now(),
            isEstimated: false,
            order,
        };

        await setDoc(
            doc(db, COLLECTIONS.GAME_SESSIONS, gameId, COLLECTIONS.ISSUES, issueId),
            issue
        );

        return issueId;
    } catch (error) {
        console.error('Error adding issue:', error);
        throw error;
    }
};

/**
 * Update an issue
 */
export const updateIssue = async (
    gameId: string,
    issueId: string,
    updates: Partial<Issue>
): Promise<void> => {
    try {
        await updateDoc(
            doc(db, COLLECTIONS.GAME_SESSIONS, gameId, COLLECTIONS.ISSUES, issueId),
            updates
        );
    } catch (error) {
        console.error('Error updating issue:', error);
        throw error;
    }
};

/**
 * Mark issue as estimated
 */
export const markIssueEstimated = async (
    gameId: string,
    issueId: string,
    estimate: string
): Promise<void> => {
    await updateIssue(gameId, issueId, {
        estimate,
        isEstimated: true,
    });
};

/**
 * Delete an issue
 */
export const deleteIssue = async (gameId: string, issueId: string): Promise<void> => {
    try {
        await deleteDoc(
            doc(db, COLLECTIONS.GAME_SESSIONS, gameId, COLLECTIONS.ISSUES, issueId)
        );
    } catch (error) {
        console.error('Error deleting issue:', error);
        throw error;
    }
};

/**
 * Get all issues for a game
 */
export const getIssues = async (gameId: string): Promise<Issue[]> => {
    try {
        const issuesRef = collection(db, COLLECTIONS.GAME_SESSIONS, gameId, COLLECTIONS.ISSUES);
        const issuesQuery = query(issuesRef, orderBy('order'));
        const issuesSnap = await getDocs(issuesQuery);
        return issuesSnap.docs.map(doc => doc.data() as Issue);
    } catch (error) {
        console.error('Error getting issues:', error);
        return [];
    }
};

/**
 * Listen to issues in real-time
 */
export const listenToIssues = (
    gameId: string,
    callback: (issues: Issue[]) => void
): Unsubscribe => {
    const issuesRef = collection(db, COLLECTIONS.GAME_SESSIONS, gameId, COLLECTIONS.ISSUES);
    const issuesQuery = query(issuesRef, orderBy('order'));

    return onSnapshot(
        issuesQuery,
        (snapshot) => {
            const issues = snapshot.docs.map(doc => doc.data() as Issue);
            callback(issues);
        },
        (error) => {
            console.error('Error listening to issues:', error);
            callback([]);
        }
    );
};

/**
 * Import issues from CSV text
 */
export const importIssuesFromCSV = async (
    gameId: string,
    csvText: string
): Promise<number> => {
    try {
        const lines = csvText.split('\n').filter(line => line.trim());
        let importedCount = 0;

        for (const line of lines) {
            const parts = line.split(',').map(s => s.trim());
            const title = parts[0];
            const description = parts[1];
            const taskLink = parts[2];
            if (title) {
                if (importedCount >= 50) break;
                await addIssue(gameId, title, description, taskLink);
                importedCount++;
            }
        }

        return importedCount;
    } catch (error) {
        console.error('Error importing issues:', error);
        throw error;
    }
};

/**
 * Export issues to CSV format
 */
const escapeCSV = (value: string): string => {
    // Prevent CSV formula injection by prefixing with single quote
    const sanitized = /^[=+\-@]/.test(value) ? `'${value}` : value;
    // Escape quotes
    return sanitized.replace(/"/g, '""');
};

export const exportIssuesToCSV = (issues: Issue[]): string => {
    const header = 'Title,Description,TaskLink,Estimate\n';
    const rows = issues.map(issue =>
        `"${escapeCSV(issue.title)}","${escapeCSV(issue.description || '')}","${escapeCSV(issue.taskLink || '')}","${escapeCSV(issue.estimate || '')}"`
    ).join('\n');
    return header + rows;
};

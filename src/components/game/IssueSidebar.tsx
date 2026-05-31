import React, { useState, useRef } from 'react';
import { Plus, Check, ChevronRight, ChevronLeft, Trash2, Download, Upload, Link, ExternalLink } from 'lucide-react';
import { type Issue } from '../../types';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface IssueSidebarProps {
    issues: Issue[];
    currentIssueId: string | null;
    onAddIssue: (title: string, description?: string, taskLink?: string) => void;
    onSelectIssue: (issueId: string) => void;
    onMarkEstimated: (issueId: string, estimate: string) => void;
    onDeleteIssue: (issueId: string) => void;
    onImportCSV: (csvText: string) => void;
    onExportCSV: () => void;
    isHost: boolean;
    votingLocked: boolean;
    onToast?: (message: string, type: 'warning' | 'error' | 'success') => void;
}

export const IssueSidebar: React.FC<IssueSidebarProps> = ({
    issues,
    currentIssueId,
    onAddIssue,
    onSelectIssue,
    onDeleteIssue,
    onImportCSV,
    onExportCSV,
    isHost,
    votingLocked,
    onToast,
}) => {
    const [isOpen, setIsOpen] = useState(true);
    const [newIssueTitle, setNewIssueTitle] = useState('');
    const [newIssueDescription, setNewIssueDescription] = useState('');
    const [newIssueTaskLink, setNewIssueTaskLink] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [linkError, setLinkError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isValidUrl = (url: string): boolean => {
        try {
            const parsed = new URL(url);
            return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch {
            return false;
        }
    };

    const handleAddIssue = async () => {
        const trimmedLink = newIssueTaskLink.trim();
        if (trimmedLink && !isValidUrl(trimmedLink)) {
            setLinkError('Please enter a valid URL (https://...)');
            return;
        }
        setLinkError('');
        if (!newIssueTitle.trim()) return;

        try {
            await onAddIssue(newIssueTitle.trim(), newIssueDescription.trim() || undefined, trimmedLink || undefined);
            setNewIssueTitle('');
            setNewIssueDescription('');
            setNewIssueTaskLink('');
            setShowAddForm(false);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to add issue';
            onToast?.(msg, 'warning');
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const csvText = event.target?.result as string;
            if (csvText) {
                onImportCSV(csvText);
            }
        };
        reader.readAsText(file);
        // Reset so the same file can be re-imported
        e.target.value = '';
    };



    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed right-0 top-1/2 z-30 -translate-y-1/2 rounded-l-xl border border-r-0 border-[var(--landing-hairline)] bg-[var(--landing-surface-1)] px-2 py-4 text-[var(--landing-ink-muted)] hover:bg-[var(--landing-surface-2)] transition-all"
            >
                {isOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>

            {/* Sidebar */}
            <div
                className={`fixed right-0 top-0 z-20 h-full w-80 overflow-y-auto border-l border-[var(--landing-hairline)] bg-[rgba(1,1,2,0.95)] p-4 backdrop-blur-xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-[var(--landing-ink)]">Issues</h3>
                    <div className="flex gap-2">
                        {isHost && (
                            <>
                                <button
                                    onClick={handleImportClick}
                                    className="p-2 glass rounded-lg hover:bg-white/10"
                                    title="Import CSV"
                                >
                                    <Upload className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={onExportCSV}
                                    className="rounded-lg border border-[var(--landing-hairline)] bg-[var(--landing-surface-1)] p-2 hover:bg-[var(--landing-surface-2)]"
                                    title="Export CSV"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Add Issue Button */}
                {isHost && !showAddForm && (
                    <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        onClick={() => setShowAddForm(true)}
                        className="mb-4"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Issue
                    </Button>
                )}

                {/* Add Issue Form */}
                {showAddForm && (
                    <div className="landing-room-subpanel mb-4 space-y-3 p-4">
                        <Input
                            placeholder="Issue title"
                            value={newIssueTitle}
                            onChange={(e) => setNewIssueTitle(e.target.value)}
                            fullWidth
                        />
                        <textarea
                            placeholder="Description (optional)"
                            value={newIssueDescription}
                            onChange={(e) => setNewIssueDescription(e.target.value)}
                            className="input w-full min-h-[60px] resize-none"
                        />
                        <div className="relative">
                            <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--landing-ink-tertiary)] pointer-events-none" />
                            <input
                                placeholder="https:// (optional)"
                                value={newIssueTaskLink}
                                onChange={(e) => {
                                    setNewIssueTaskLink(e.target.value);
                                    if (linkError) setLinkError('');
                                }}
                                className={`input w-full pl-10 ${linkError ? 'border-red-500' : ''}`}
                            />
                            {linkError && (
                                <p className="text-xs text-red-400">{linkError}</p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" onClick={handleAddIssue} className="flex-1">
                                Add
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                    setShowAddForm(false);
                                    setNewIssueTitle('');
                                    setNewIssueDescription('');
                                    setNewIssueTaskLink('');
                                }}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {/* Issues List */}
                <div className="space-y-3">
                    {issues.length === 0 ? (
                        <p className="py-8 text-center text-[var(--landing-ink-tertiary)]">
                            No issues yet. {isHost && 'Add your first issue!'}
                        </p>
                    ) : (
                        issues.map((issue) => {
                            const canSelect = isHost && !votingLocked && !issue.isEstimated;
                            const isActive = currentIssueId === issue.id;
                            return (
                            <div
                                key={issue.id}
                                className={`landing-room-subpanel p-3 transition-all ${isActive ? 'border-[var(--landing-primary)] bg-[rgba(94,106,210,0.08)]' : ''
                                    } ${issue.isEstimated ? 'opacity-60' : ''} ${canSelect ? 'cursor-pointer hover:bg-[var(--landing-surface-2)]' : 'cursor-default'
                                    }`}
                                onClick={() => canSelect && onSelectIssue(issue.id)}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <h4 className="font-semibold text-white truncate flex items-center gap-2">
                                            {issue.title}
                                            {isActive && (
                                                <span className="shrink-0 rounded-full border border-[var(--landing-primary)] bg-[rgba(94,106,210,0.1)] px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-[var(--landing-primary-hover)]">
                                                    Voting
                                                </span>
                                            )}
                                        </h4>
                                        {issue.description && (
                                            <p className="line-clamp-2 text-sm text-[var(--landing-ink-subtle)]">
                                                {issue.description}
                                            </p>
                                        )}
                                        {issue.taskLink && (
                                            <a
                                                href={issue.taskLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="inline-flex items-center gap-1 text-xs text-[var(--landing-primary-hover)] hover:underline truncate max-w-full"
                                            >
                                                <ExternalLink className="w-3 h-3 shrink-0" />
                                                <span className="truncate">Link to issue</span>
                                            </a>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                        {issue.isEstimated && (
                                            <div className="flex items-center gap-1 text-green-400">
                                                <Check className="w-4 h-4" />
                                                <span className="text-sm font-bold">{issue.estimate}</span>
                                            </div>
                                        )}

                                        {isHost && !issue.isEstimated && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteIssue(issue.id);
                                                }}
                                                className="p-1 hover:bg-red-500/20 rounded transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-400" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            );
                        })
                    )}
                </div>

                {/* Hidden file input for CSV import */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {/* Legend */}
                <div className="mt-6 border-t border-[var(--landing-hairline)] pt-4 text-xs text-[var(--landing-ink-tertiary)]">
                    <p>Click an issue to start voting</p>
                    {isHost && <p className="mt-1">Import/Export via CSV for integration</p>}
                </div>
            </div>
        </>
    );
};

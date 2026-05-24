import React from 'react';
import { Check, Crown, Eye, X } from 'lucide-react';
import { type Participant } from '../../types';
import { getInitials } from '../../types';
import { QuickEmojiBar } from './QuickEmojiBar';

interface ParticipantCardProps {
    participant: Participant;
    hasVoted: boolean;
    voteValue: string | null;
    votesRevealed: boolean;
    onClick?: () => void;
    onEmojiClick?: (emoji: string) => void;
    onShowFullPicker?: () => void;
    showQuickBar?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onRemove?: () => void;
    isCurrentUser?: boolean;
}

export const ParticipantCard: React.FC<ParticipantCardProps> = ({
    participant,
    hasVoted,
    voteValue,
    votesRevealed,
    onClick,
    onEmojiClick,
    onShowFullPicker,
    showQuickBar = false,
    onMouseEnter,
    onMouseLeave,
    onRemove,
    isCurrentUser = false,
}) => {
    const handleQuickEmojiClick = (emoji: string) => {
        if (onEmojiClick) {
            onEmojiClick(emoji);
        }
    };

    const handleMoreClick = () => {
        if (onShowFullPicker) {
            onShowFullPicker();
        }
    };

    return (
        <div
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={`landing-participant-card group ${hasVoted ? 'voted' : ''} ${onClick ? 'cursor-pointer' : ''
                }`}
        >
            {/* Remove Button */}
            {onRemove && !isCurrentUser && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 shadow-lg opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                    title="Remove participant"
                >
                    <X className="w-3 h-3 text-white" />
                </button>
            )}

            {/* Quick Emoji Bar */}
            {showQuickBar && onEmojiClick && (
                <QuickEmojiBar
                    onEmojiClick={handleQuickEmojiClick}
                    onMoreClick={handleMoreClick}
                />
            )}

            {/* Avatar */}
            <div
                className="relative flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white shadow-lg"
                style={{ backgroundColor: participant.color }}
            >
                {getInitials(participant.name)}

                {/* Host crown */}
                {participant.isHost && (
                    <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 shadow-lg">
                        <Crown className="w-4 h-4 text-white" />
                    </div>
                )}

                {/* Voted check */}
                {hasVoted && !votesRevealed && (
                    <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 shadow-lg">
                        <Check className="w-3 h-3 text-white" />
                    </div>
                )}

                {/* Spectator badge */}
                {participant.isSpectator && (
                    <div className="absolute -bottom-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 shadow-lg" title="Spectator">
                        <Eye className="w-3 h-3 text-white" />
                    </div>
                )}
            </div>

            {/* Name */}
            <div className="text-center">
                <p className="max-w-[120px] truncate text-sm font-semibold text-white">
                    {participant.name}
                </p>
                {participant.isHost && (
                    <p className="text-xs uppercase tracking-[0.14em] text-yellow-400">Host</p>
                )}
            </div>

            {/* Vote value (revealed) */}
            {votesRevealed && voteValue && (
                <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/90 text-sm font-bold text-white shadow-lg animate-slide-down">
                    {voteValue}
                </div>
            )}

            {/* Voting status */}
            {!votesRevealed && (
                <div className="text-xs text-center">
                    {participant.isSpectator ? (
                        <span className="text-primary-400">Spectator</span>
                    ) : hasVoted ? (
                        <span className="text-green-400">✓ Voted</span>
                    ) : (
                        <span className="text-[var(--landing-ink-tertiary)]">Waiting...</span>
                    )}
                </div>
            )}
        </div>
    );
};

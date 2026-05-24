import React from 'react';
import { VOTE_VALUES, type VoteValue } from '../../types';

interface VotingCardsProps {
    selectedValue: string | null;
    onSelectValue: (value: VoteValue) => void;
    disabled: boolean;
}

export const VotingCards: React.FC<VotingCardsProps> = ({
    selectedValue,
    onSelectValue,
    disabled,
}) => {
    return (
        <div className="py-2">
            <div className="mb-6 text-center">
                <p className="landing-caption">Vote</p>
                <h3 className="mt-3 text-base font-semibold uppercase tracking-[0.26em] text-[var(--landing-ink-subtle)]">Select Your Estimate</h3>
            </div>
            <div className="mx-auto flex flex-wrap justify-center gap-3">
                {VOTE_VALUES.map((value) => (
                    <button
                        key={value}
                        onClick={() => !disabled && onSelectValue(value)}
                        disabled={disabled}
                        className={`voting-card ${selectedValue === value ? 'selected' : ''} ${disabled ? 'disabled' : ''
                            }`}
                    >
                        {value}
                    </button>
                ))}
            </div>
            {selectedValue && !disabled && (
                <p className="mt-5 text-center text-green-400 animate-fade-in">
                    ✓ You selected: <span className="font-bold text-2xl">{selectedValue}</span>
                </p>
            )}
        </div>
    );
};

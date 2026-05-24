import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Circle } from 'lucide-react';

export const Header: React.FC = () => {
    const navigate = useNavigate();

    return (
        <header className="fixed left-0 right-0 top-0 z-50 border-b border-[var(--landing-hairline)] bg-[rgba(1,1,2,0.9)] backdrop-blur-2xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
                <div
                    onClick={() => navigate('/')}
                    className="flex cursor-pointer items-center gap-3"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--landing-hairline)] bg-[var(--landing-surface-1)]">
                        <Circle className="h-4 w-4 fill-[var(--landing-primary)] text-[var(--landing-primary)]" />
                    </div>
                    <span className="font-display text-lg uppercase tracking-[0.22em] text-[var(--landing-ink)] md:text-xl">
                        Planning Poker
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => navigate('/create')}
                    className="landing-button landing-button-secondary !px-4 !py-3 !text-xs md:!text-sm"
                >
                    Start a session
                    <ArrowUpRight className="h-4 w-4" />
                </button>
            </div>
        </header>
    );
};

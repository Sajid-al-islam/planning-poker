import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const Header: React.FC = () => {
    const navigate = useNavigate();

    return (
        <header className="fixed left-0 right-0 top-0 z-50 border-b border-[var(--landing-hairline)] bg-[rgba(1,1,2,0.9)] backdrop-blur-2xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
                <div
                    onClick={() => navigate('/')}
                    className="flex cursor-pointer items-center gap-3"
                >
                    <img
                        src="/nobg.webp"
                        alt="Planning Poker"
                        className="h-8 md:h-9 w-auto"
                    />
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

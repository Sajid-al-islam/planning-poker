import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Circle } from 'lucide-react';

export const Hero: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="landing-shell px-4 pb-20 pt-24 md:px-6 md:pb-24 md:pt-32">
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-5xl text-center">
                    <div className="landing-eyebrow justify-center">
                        <Circle className="h-2.5 w-2.5 fill-current text-[var(--landing-primary)]" />
                        Scrum Poker for Agile Teams
                    </div>

                    <h1 className="mt-8 font-display text-[3.25rem] font-semibold leading-[0.94] tracking-[-0.07em] text-[var(--landing-ink)] md:text-[5.5rem] lg:text-[6.5rem]">
                        Planning Poker
                        <br />
                        Made Simple
                    </h1>

                    <p className="mx-auto mt-6 max-w-3xl text-[17px] leading-8 text-[var(--landing-ink-muted)] md:text-[20px]">
                        Easy-to-use and fun estimations for your development team.
                        Vote in real-time, visualize results instantly, and keep your team engaged.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => navigate('/create')}
                            className="landing-button landing-button-primary"
                        >
                            Start New Game
                            <ArrowUpRight className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const element = document.getElementById('features');
                                element?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="landing-button landing-button-secondary"
                        >
                            See Features
                        </button>
                    </div>
                </div>

                <div className="landing-hero-media-wrap mx-auto mt-16 max-w-7xl">
                    <div className="landing-hero-glow" />
                    <div className="landing-shot landing-hero-media p-3 md:p-4">
                        <div className="landing-shot-toolbar">
                            <div className="flex items-center gap-2">
                                <span className="landing-dot" />
                                <span className="landing-dot" />
                                <span className="landing-dot" />
                            </div>
                            <div className="landing-shot-url">planning-poker.app</div>
                        </div>

                        <div className="landing-image-placeholder mt-3">
                            <div className="landing-image-placeholder-copy">
                                Product screenshot goes here
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

import React from 'react';
import { Eye, MessageCircle, PlusCircle, Send, Vote } from 'lucide-react';

const steps = [
    {
        number: '1',
        title: 'Create Game',
        description: 'Start a new planning poker session with a unique game link',
        icon: PlusCircle,
    },
    {
        number: '2',
        title: 'Invite Team',
        description: 'Share the game link with your team members',
        icon: Send,
    },
    {
        number: '3',
        title: 'Vote',
        description: 'Each team member selects their estimate privately',
        icon: Vote,
    },
    {
        number: '4',
        title: 'Discuss',
        description: 'Talk through different perspectives and estimates',
        icon: MessageCircle,
    },
    {
        number: '5',
        title: 'Reveal & Finalize',
        description: 'Show all votes and agree on the final estimate',
        icon: Eye,
    },
];

export const HowItWorks: React.FC = () => {
    return (
        <section className="px-4 py-16 md:px-6 md:py-24">
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="font-display text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.05em] text-[var(--landing-ink)] md:text-[4rem]">
                        How It Works
                    </h2>
                    <p className="mt-5 text-[17px] leading-8 text-[var(--landing-ink-muted)]">
                        Get started with planning poker in 5 simple steps
                    </p>
                </div>

                <div className="landing-how-wrap mt-14">
                    <div className="landing-how-line" />
                    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-5">
                        {steps.map(({ number, title, description, icon: Icon }) => (
                            <article key={number} className="landing-how-card">
                                <div className="landing-how-number">{number}</div>
                                <div className="landing-how-icon">
                                    <Icon className="h-9 w-9 text-[var(--landing-ink)]" />
                                </div>
                                <h3 className="mt-8 text-[20px] font-semibold tracking-[-0.03em] text-[var(--landing-ink)]">
                                    {title}
                                </h3>
                                <p className="mt-4 text-[15px] leading-7 text-[var(--landing-ink-subtle)]">
                                    {description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

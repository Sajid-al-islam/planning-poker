import React from 'react';
import { BarChart3, FolderKanban, Smartphone, Sparkles, Users, Zap } from 'lucide-react';

const features = [
    {
        icon: Users,
        title: 'Vote and Estimate in Real-Time',
        description: 'Our crisp and clean interface enables outstanding team engagement for development project estimates.',
    },
    {
        icon: BarChart3,
        title: 'Visual Results at a Glance',
        description: 'Results are quick and super-easy to understand while providing in-depth and high-quality insights.',
    },
    {
        icon: FolderKanban,
        title: 'In-Game Issue Management',
        description: 'Streamline the issues your agile development team is working on with our sidebar manager.',
    },
    {
        icon: Zap,
        title: 'Integrations & CSV Import',
        description: 'Easily integrate with other tools using CSV files for seamless workflow.',
    },
    {
        icon: Sparkles,
        title: 'Interactive & Fun',
        description: 'Throw emojis to your teammates during estimation for enhanced team engagement.',
    },
    {
        icon: Smartphone,
        title: 'Works on All Devices',
        description: 'Vote on any issue, anytime, anywhere with our responsive web app.',
    },
];

export const Features: React.FC = () => {
    return (
        <section className="px-4 py-16 md:px-6 md:py-24">
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="font-display text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.05em] text-[var(--landing-ink)] md:text-[4rem]">
                        Everything You Need for
                        <span className="text-[var(--landing-primary)]"> Agile Estimation</span>
                    </h2>
                    <p className="mt-5 text-[17px] leading-8 text-[var(--landing-ink-muted)]">
                        A complete solution for Scrum teams to estimate work efficiently
                    </p>
                </div>

                <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {features.map(({ icon: Icon, title, description }) => (
                        <article key={title} className="landing-feature-card p-8">
                            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--landing-hairline-tertiary)] bg-[var(--landing-surface-4)]">
                                <Icon className="h-5 w-5 text-[var(--landing-primary)]" />
                            </div>
                            <h3 className="mt-8 text-[22px] font-medium tracking-[-0.03em] text-[var(--landing-ink)]">
                                {title}
                            </h3>
                            <p className="mt-4 text-[15px] leading-7 text-[var(--landing-ink-subtle)]">
                                {description}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

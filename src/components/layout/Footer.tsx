import React from 'react';
import { Github, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer className="border-t border-[var(--landing-hairline)] px-4 py-10 md:px-6 md:py-12">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <div className="max-w-xl">
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--landing-ink-tertiary)]">Planning Poker</p>
                    <p className="mt-3 text-sm leading-7 text-[var(--landing-ink-subtle)]">
                        Fast session setup, clean reveal flow, issue tracking, CSV export, and just enough personality for team estimation.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--landing-ink-subtle)]">
                    <a href="/privacy" className="transition-colors hover:text-[var(--landing-ink)]">
                        Privacy
                    </a>
                    <a href="/terms" className="transition-colors hover:text-[var(--landing-ink)]">
                        Terms
                    </a>
                    <a href="#features" className="transition-colors hover:text-[var(--landing-ink)]">
                        Features
                    </a>
                    <a href="#how-it-works" className="transition-colors hover:text-[var(--landing-ink)]">
                        Workflow
                    </a>
                    <div className="flex gap-3">
                        <a
                            href="https://github.com/sajid-al-islam"
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--landing-hairline)] bg-[var(--landing-surface-1)] transition-colors hover:bg-[var(--landing-surface-2)]"
                        >
                        <Github className="h-4 w-4" />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/muhammad-sajidul-islam"
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--landing-hairline)] bg-[var(--landing-surface-1)] transition-colors hover:bg-[var(--landing-surface-2)]"
                        >
                            <Linkedin className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

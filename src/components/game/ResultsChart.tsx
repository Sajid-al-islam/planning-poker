import React from 'react';
import { type Vote, VOTE_VALUES } from '../../types';
import { calculateVoteStats } from '../../utils/helpers';

interface ResultsChartProps {
    votes: Vote[];
}

export const ResultsChart: React.FC<ResultsChartProps> = ({ votes }) => {
    if (votes.length === 0) {
        return (
            <div className="landing-room-panel p-6 text-center">
                <p className="text-sm text-[var(--landing-ink-subtle)]">No votes to display</p>
            </div>
        );
    }

    const stats = calculateVoteStats(votes);
    if (!stats) return null;

    const voteDistribution = VOTE_VALUES
        .filter((value) => stats.distribution[value])
        .map((value) => ({
            value,
            count: stats.distribution[value],
        }));

    const maxCount = Math.max(1, ...voteDistribution.map((item) => item.count));
    const displayAverage = Number.isInteger(stats.average) ? stats.average : stats.average.toFixed(1);
    const displayMedian = Number.isInteger(stats.median) ? stats.median : stats.median.toFixed(1);
    const displayMode = stats.mode.length > 0 ? stats.mode.join(', ') : '—';

    return (
        <div className="landing-room-panel animate-slide-up overflow-hidden p-5 md:p-6">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="landing-caption">Voting Results</p>
                    <h3 className="mt-2 font-display text-[1.9rem] font-semibold tracking-[-0.04em] text-[var(--landing-ink)]">
                        Vote breakdown
                    </h3>
                </div>
                <div className="landing-status-pill border-[var(--landing-hairline-strong)] bg-[var(--landing-surface-2)] text-[var(--landing-ink-muted)]">
                    <span className={`h-2 w-2 rounded-full ${stats.consensus ? 'bg-emerald-400' : 'bg-[var(--landing-primary-hover)]'}`} />
                    {stats.consensus ? 'Consensus reached' : 'Results revealed'}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                <div className="landing-room-subpanel p-4 md:p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <p className="landing-caption">Vote Distribution</p>
                        <p className="text-sm text-[var(--landing-ink-subtle)]">
                            {votes.length} vote{votes.length === 1 ? '' : 's'}
                        </p>
                    </div>

                    <div className="flex min-h-[320px] items-end justify-center gap-4 overflow-x-auto px-1 pb-1">
                        {voteDistribution.map((item) => {
                            const fillRatio = item.count / maxCount;
                            const fillHeight = Math.max(20, Math.round(fillRatio * 170));

                            return (
                                <div key={item.value} className="flex min-w-[88px] flex-1 flex-col items-center gap-3">
                                    <div className="flex h-[220px] items-end justify-center">
                                        <div className="flex h-full w-[18px] items-end rounded-full bg-white/5">
                                            <div
                                                className="w-full rounded-full bg-[linear-gradient(180deg,var(--landing-primary-hover),var(--landing-primary))] shadow-[0_0_18px_rgba(94,106,210,0.18)]"
                                                style={{ height: `${fillHeight}px` }}
                                                aria-hidden="true"
                                            />
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <div className="mb-1 inline-flex min-w-[68px] items-center justify-center rounded-[16px] border-2 border-[var(--landing-primary-hover)] bg-[var(--landing-surface-1)] px-3 py-3 text-[1.8rem] font-semibold leading-none tracking-[-0.04em] text-[var(--landing-ink)]">
                                            {item.value}
                                        </div>
                                        <div className="text-sm text-[var(--landing-ink-subtle)]">
                                            {item.count} vote{item.count === 1 ? '' : 's'}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid gap-3">
                    <div className="landing-room-subpanel border-[rgba(130,143,255,0.45)] bg-[linear-gradient(180deg,rgba(15,18,26,0.96),rgba(10,11,14,0.98))] p-5 text-center">
                        <p className="landing-caption">Average</p>
                        <p className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-[var(--landing-primary-hover)]">
                            {displayAverage}
                        </p>
                    </div>
                    <div className="landing-room-subpanel p-4 text-center">
                        <p className="landing-caption">Median</p>
                        <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--landing-ink)]">{displayMedian}</p>
                    </div>
                    <div className="landing-room-subpanel p-4 text-center">
                        <p className="landing-caption">Mode</p>
                        <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--landing-ink)]">{displayMode}</p>
                    </div>
                    <div className="landing-room-subpanel p-4 text-center">
                        <p className="landing-caption">Consensus</p>
                        <p className={`mt-2 text-3xl font-semibold tracking-[-0.04em] ${stats.consensus ? 'text-emerald-400' : 'text-orange-400'}`}>
                            {stats.consensus ? 'Yes' : 'No'}
                        </p>
                    </div>
                </div>
            </div>

            {stats.consensus && (
                <div className="mt-4 rounded-[16px] border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-center text-sm font-medium text-emerald-300">
                    Consensus reached. All non-spectator votes match.
                </div>
            )}
        </div>
    );
};

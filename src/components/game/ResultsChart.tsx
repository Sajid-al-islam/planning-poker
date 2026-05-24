import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { type Vote } from '../../types';
import { calculateVoteStats } from '../../utils/helpers';

interface ResultsChartProps {
    votes: Vote[];
}

export const ResultsChart: React.FC<ResultsChartProps> = ({ votes }) => {
    if (votes.length === 0) {
        return (
            <div className="glass p-4 rounded-lg text-center">
                <p className="text-sm text-gray-400">No votes to display</p>
            </div>
        );
    }

    const stats = calculateVoteStats(votes);
    if (!stats) return null;

    // Prepare data for chart
    const chartData = Object.entries(stats.distribution).map(([value, count]) => ({
        value,
        count,
    }));

    // Color palette for bars
    const colors = ['#5e6ad2', '#828fff', '#6e79e0', '#525db8', '#434c95'];

    return (
        <div className="landing-room-panel animate-slide-up p-5 md:p-6">
            <h3 className="mb-5 text-center font-display text-[2rem] font-semibold tracking-[-0.04em] text-[var(--landing-ink)]">
                Voting Results
            </h3>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="landing-room-subpanel p-3 text-center">
                    <p className="mb-1 text-xs uppercase tracking-wide text-[var(--landing-ink-tertiary)]">Average</p>
                    <p className="text-xl font-bold text-primary-400">{stats.average}</p>
                </div>
                <div className="landing-room-subpanel p-3 text-center">
                    <p className="mb-1 text-xs uppercase tracking-wide text-[var(--landing-ink-tertiary)]">Median</p>
                    <p className="text-xl font-bold text-secondary-400">{stats.median}</p>
                </div>
                <div className="landing-room-subpanel p-3 text-center">
                    <p className="mb-1 text-xs uppercase tracking-wide text-[var(--landing-ink-tertiary)]">Mode</p>
                    <p className="text-xl font-bold text-primary-400">{stats.mode.join(', ')}</p>
                </div>
                <div className="landing-room-subpanel p-3 text-center">
                    <p className="mb-1 text-xs uppercase tracking-wide text-[var(--landing-ink-tertiary)]">Consensus</p>
                    <p className={`text-xl font-bold ${stats.consensus ? 'text-green-400' : 'text-orange-400'}`}>
                        {stats.consensus ? '✓' : '✗'}
                    </p>
                </div>
            </div>

            {/* Chart */}
            <div className="w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="value"
                            stroke="#94a3b8"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            style={{ fontSize: '12px' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                color: '#fff',
                            }}
                        />
                        <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                            {chartData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {stats.consensus && (
                <div className="mt-4 rounded-lg border border-green-500/50 bg-green-500/10 p-3 text-center">
                    <p className="text-sm text-green-400 font-semibold">
                        🎉 Consensus reached! All votes are the same.
                    </p>
                </div>
            )}
        </div>
    );
};

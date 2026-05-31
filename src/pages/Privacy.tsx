import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ArrowLeft } from 'lucide-react';

export const Privacy: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />
            <main className="relative mx-auto max-w-3xl px-4 pt-32 pb-20 md:px-6">
                <button
                    onClick={() => navigate('/')}
                    className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--landing-ink-subtle)] hover:text-[var(--landing-ink)] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to home
                </button>

                <h1 className="font-display text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                    Privacy Policy
                </h1>
                <p className="mt-2 text-sm text-[var(--landing-ink-tertiary)]">Last updated: May 2026</p>

                <div className="mt-10 space-y-8 text-[15px] leading-7 text-[var(--landing-ink-subtle)]">
                    <section>
                        <h2 className="mb-3 font-display text-xl font-semibold tracking-[-0.03em] text-[var(--landing-ink)]">1. What We Collect</h2>
                        <p>We collect only the data you choose to provide and what is necessary for the game to function:</p>
                        <ul className="mt-3 list-disc pl-5 space-y-1.5">
                            <li><strong>Display name</strong> — the name you enter when creating or joining a game session.</li>
                            <li><strong>Game activity</strong> — votes, issues, emoji reactions, and timestamps generated during a session.</li>
                            <li><strong>Anonymous identifier</strong> — a randomly generated ID (Firebase Anonymous Auth UID) used to associate your actions with your session. This ID contains no personal identifying information.</li>
                        </ul>
                        <p className="mt-3">We do <strong>not</strong> collect email addresses, phone numbers, location data, IP addresses (beyond what is inherent to HTTP), or any browsing history.</p>
                    </section>

                    <section>
                        <h2 className="mb-3 font-display text-xl font-semibold tracking-[-0.03em] text-[var(--landing-ink)]">2. How We Use Your Data</h2>
                        <p>Your data is used exclusively to operate the planning poker game:</p>
                        <ul className="mt-3 list-disc pl-5 space-y-1.5">
                            <li>Display your name and votes to other participants in the same game room.</li>
                            <li>Track issues, estimates, and voting history within a session.</li>
                            <li>Enable real-time collaboration (emoji reactions, participant presence).</li>
                        </ul>
                        <p className="mt-3">We do <strong>not</strong> use your data for advertising, profiling, analytics, or any purpose beyond the core functionality of the app.</p>
                    </section>

                    <section>
                        <h2 className="mb-3 font-display text-xl font-semibold tracking-[-0.03em] text-[var(--landing-ink)]">3. Where We Store Your Data</h2>
                        <p>All data is stored in <strong>Google Cloud Firestore</strong> (US multi-region) through Firebase, a Google Cloud Platform service. Firebase's privacy and security practices are governed by Google's privacy policy. We do not store data on our own servers.</p>
                    </section>

                    <section>
                        <h2 className="mb-3 font-display text-xl font-semibold tracking-[-0.03em] text-[var(--landing-ink)]">4. Data Retention</h2>
                        <p>Game session data persists until the game host removes participants or the session is abandoned. There is no automated data purge. You can delete your data at any time by leaving a game session, which removes your participant record and associated votes. Game hosts can delete entire sessions by removing all participants.</p>
                        <p className="mt-3">If you wish to have all your data removed and cannot do so through the app, contact us using the information below.</p>
                    </section>

                    <section>
                        <h2 className="mb-3 font-display text-xl font-semibold tracking-[-0.03em] text-[var(--landing-ink)]">5. Your Rights</h2>
                        <p>Depending on your jurisdiction (including GDPR and CCPA), you may have the right to:</p>
                        <ul className="mt-3 list-disc pl-5 space-y-1.5">
                            <li><strong>Access</strong> — request a copy of your data.</li>
                            <li><strong>Deletion</strong> — request that your data be erased.</li>
                            <li><strong>Objection</strong> — object to the processing of your data.</li>
                        </ul>
                        <p className="mt-3">To exercise these rights, contact us at the email below.</p>
                    </section>

                    <section>
                        <h2 className="mb-3 font-display text-xl font-semibold tracking-[-0.03em] text-[var(--landing-ink)]">6. Third-Party Services</h2>
                        <p>This app uses the following third-party services:</p>
                        <ul className="mt-3 list-disc pl-5 space-y-1.5">
                            <li><strong>Firebase (Google)</strong> — Authentication (anonymous), Firestore database, and Hosting. See <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="text-[var(--landing-primary-hover)] hover:underline">Google's privacy policy</a>.</li>
                            <li><strong>emoji-picker-react</strong> — an open-source emoji picker that runs entirely client-side. No data is sent to external servers.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-3 font-display text-xl font-semibold tracking-[-0.03em] text-[var(--landing-ink)]">7. Cookies & Local Storage</h2>
                        <p>This app does not use tracking cookies. Firebase Authentication uses browser <strong>IndexedDB</strong> to persist your anonymous session across page reloads. We also use <strong>localStorage</strong> to remember your current game session (game ID and participant ID) for convenience. No data stored in localStorage or IndexedDB is used for tracking or advertising.</p>
                    </section>

                    <section>
                        <h2 className="mb-3 font-display text-xl font-semibold tracking-[-0.03em] text-[var(--landing-ink)]">8. Contact</h2>
                        <p>If you have questions about this privacy policy or wish to exercise your data rights, please open an issue at the project repository or contact the developer through the channels listed on the landing page.</p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

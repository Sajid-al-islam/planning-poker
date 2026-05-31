import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ArrowLeft } from 'lucide-react';

export const Terms: React.FC = () => {
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
                    Terms of Service
                </h1>
                <p className="mt-2 text-sm text-[var(--landing-ink-tertiary)]">Last updated: May 2026</p>

                <div className="mt-10 space-y-8 text-[15px] leading-7 text-[var(--landing-ink-subtle)]">
                    <section>
                        <h2 className="mb-3 font-display text-xl font-semibold tracking-[-0.03em] text-[var(--landing-ink)]">1. Acceptance of Terms</h2>
                        <p>By accessing or using this application, you agree to be bound by these Terms of Service. If you do not agree, do not use the app.</p>
                    </section>

                    <section>
                        <h2 className="mb-3 font-display text-xl font-semibold tracking-[-0.03em] text-[var(--landing-ink)]">2. Description of Service</h2>
                        <p>This app is a real-time collaborative planning poker (Scrum poker) tool for agile estimation. It allows users to create or join game rooms, vote on issues, and estimate work items. The app is provided free of charge on an "as is" basis.</p>
                    </section>

                    <section>
                        <h2 className="mb-3 font-display text-xl font-semibold tracking-[-0.03em] text-[var(--landing-ink)]">3. User Responsibilities</h2>
                        <p>You agree to use the app only for its intended purpose. You must not:</p>
                        <ul className="mt-3 list-disc pl-5 space-y-1.5">
                            <li>Attempt to bypass rate limits or security rules.</li>
                            <li>Flood game rooms with excessive votes, emojis, or issues.</li>
                            <li>Use the app to distribute harmful content, spam, or abusive messages.</li>
                            <li>Attempt to access game rooms or data you are not authorized to access.</li>
                            <li>Reverse-engineer, decompile, or exploit the app for unauthorized purposes.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-3 font-display text-xl font-semibold tracking-[-0.03em] text-[var(--landing-ink)]">4. Acceptable Use</h2>
                        <p>Game rooms are intended for collaborative estimation among team members. The host of a game room is responsible for the conduct of participants in their session. Disruptive behavior such as vote manipulation, impersonation, or harassment may result in removal from a session.</p>
                    </section>

                    <section>
                        <h2 className="mb-3 font-display text-xl font-semibold tracking-[-0.03em] text-[var(--landing-ink)]">5. Data Handling</h2>
                        <p>Your use of the app is also governed by our Privacy Policy, which explains what data we collect and how it is processed. By using the app, you consent to the data practices described in the Privacy Policy.</p>
                    </section>

                    <section>
                        <h2 className="mb-3 font-display text-xl font-semibold tracking-[-0.03em] text-[var(--landing-ink)]">6. Limitation of Liability</h2>
                        <p>This app is provided "as is" without any warranty, express or implied. The developers are not liable for any damages arising from the use or inability to use the app, including but not limited to loss of data, loss of productivity, or any indirect damages. Firebase/Google Cloud services used by this app have their own service-level agreements and limitations; we are not responsible for outages or data loss caused by these third-party services.</p>
                    </section>

                    <section>
                        <h2 className="mb-3 font-display text-xl font-semibold tracking-[-0.03em] text-[var(--landing-ink)]">7. Termination</h2>
                        <p>We reserve the right to suspend or terminate access to the app for users who violate these terms. Game hosts may remove participants from their sessions at their discretion. We may discontinue the service at any time without notice.</p>
                    </section>

                    <section>
                        <h2 className="mb-3 font-display text-xl font-semibold tracking-[-0.03em] text-[var(--landing-ink)]">8. Changes to Terms</h2>
                        <p>We may update these terms from time to time. Continued use of the app after changes constitutes acceptance of the new terms. We will indicate the date of the last update at the top of this page.</p>
                    </section>

                    <section>
                        <h2 className="mb-3 font-display text-xl font-semibold tracking-[-0.03em] text-[var(--landing-ink)]">9. Governing Law</h2>
                        <p>These terms are governed by the laws applicable in the jurisdiction of the developer. Any disputes shall be resolved through informal negotiation first.</p>
                    </section>

                    <section>
                        <h2 className="mb-3 font-display text-xl font-semibold tracking-[-0.03em] text-[var(--landing-ink)]">10. Contact</h2>
                        <p>For questions about these terms, please open an issue at the project repository or contact the developer through the channels listed on the landing page.</p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

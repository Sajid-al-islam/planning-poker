import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { HowItWorks } from '../components/landing/HowItWorks';

export const Landing: React.FC = () => {
    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="relative overflow-hidden pt-16">
                <div className="landing-noise" />
                <Hero />

                <div id="features">
                    <Features />
                </div>

                <div id="how-it-works">
                    <HowItWorks />
                </div>
            </main>

            <Footer />
        </div>
    );
};

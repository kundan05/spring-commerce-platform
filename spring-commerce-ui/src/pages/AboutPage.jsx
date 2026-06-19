import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 section-padding-a select-none">

            {/* Provocative Header & Handwritten highlight */}
            <div className="relative mb-12">
                <span className="text-xs font-bold uppercase tracking-widest text-primary-500 block mb-2">Our Manifesto</span>
                <h1 className="text-4xl md:text-5.5xl font-display font-[570] text-stone-900 leading-tight">
                    We don't do mass-produced.
                </h1>
                <span className="absolute right-0 -top-8 font-script text-sm text-primary-500 transform rotate-[-4deg] border border-dashed border-primary-200 bg-primary-50 px-3 py-1.5 shadow-sm rounded-md hidden md:block">
                    🏏 We play every weekend!
                </span>
            </div>

            {/* Asymmetrical 35% / 65% grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">

                {/* Asymmetrical side column (35%) */}
                <div className="md:col-span-4 space-y-6 md:sticky md:top-28">
                    {/* Polaroid-framed "Office/Workshop" image */}
                    <div className="polaroid-frame bg-white p-3 pb-10 shadow-sm border border-secondary-200 transform rotate-[-2deg] hover:rotate-[1deg] transition-all duration-300">
                        <div className="aspect-square bg-stone-100 rounded overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=600"
                                alt="Our cricket net sessions"
                                className="w-full h-full object-cover object-[75%_20%]"
                            />
                        </div>
                        <div className="mt-3 text-center">
                            <p className="font-script text-stone-700 text-sm">Testing bats in the local nets</p>
                        </div>
                    </div>

                    <div className="bg-secondary-200 border border-secondary-300 p-6 rounded-lg text-left">
                        <h4 className="font-display font-[570] text-stone-950 mb-2">Direct Contact</h4>
                        <p className="text-stone-600 text-xs font-[450] leading-relaxed">
                            No automated support bots here. Mail us directly and a real human (likely Kundan) will get back to you between nets.
                        </p>
                        <a
                            href="mailto:hello@cricstore.com"
                            className="inline-block mt-3 text-xs font-bold text-primary-500 hover:text-primary-600 underline"
                        >
                            hello@cricstore.com
                        </a>
                    </div>
                </div>

                {/* Primary copy column (65%) */}
                <div className="md:col-span-8 text-left space-y-6 text-stone-700 font-[450] text-sm md:text-base leading-relaxed">
                    <p className="font-display font-medium text-lg md:text-xl text-stone-900 leading-relaxed italic">
                        CricStore started because we got tired of buying "Grade 1" bats online only to receive pieces of wood that felt like heavy railway sleepers.
                    </p>

                    <p>
                        We're a tiny team based in Bangalore. We don't have a corporate office, a board of directors, or fancy automated warehousing systems. What we do have is a massive stash of English willow clefts, a leather press, and a strong opinion on what makes a bat ping.
                    </p>

                    <p>
                        Every bat on this site is inspected, tapped, and weighted by hand. If the grain density is off, or the balance feels like a brick, we don't sell it. Simple as that. We treat your kit exactly how we treat our own matchday gear.
                    </p>

                    <h2 className="text-2xl font-display font-[570] text-stone-950 pt-4 pb-2 border-b border-secondary-200">
                        Things we stand by.
                    </h2>

                    {/* Hanging punctuation style lists */}
                    <ul className="space-y-4 pl-4 border-l-2 border-primary-200">
                        <li>
                            <strong className="text-stone-950 font-display font-[570] block">Real Stock & Same Day Dispatches</strong>
                            If the site says "in stock," it means it's sitting on our rack. No dropshipping, no waiting for container arrivals. We pack and ship the same day.
                        </li>
                        <li>
                            <strong className="text-stone-950 font-display font-[570] block">No Artificial Markups</strong>
                            We don't inflate prices just to display a fake 70% discount badge. The price you see is the honest value of the materials and work.
                        </li>
                        <li>
                            <strong className="text-stone-950 font-display font-[570] block">Try It In The Nets</strong>
                            Take it out, try the pick-up, tap a mallet. If you don't love the profile, package it up and send it back. We want you to play with gear you trust.
                        </li>
                    </ul>

                    <p className="pt-4 text-stone-500 text-xs">
                        * Disclaimer: While our bats are tested to withstand the fastest leather balls, we cannot guarantee they will save you from getting out for a duck. That part is entirely on you.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default AboutPage;
export { AboutPage };

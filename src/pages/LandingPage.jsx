import React, { useState, useEffect } from 'react';

// Simple Icon Components
const TerminalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
);
const ZapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);
const GlobeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
);
const TrophyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
);
const CodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
);
const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);

export default function LandingPage({ onLoginClick }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="min-h-screen bg-[#0A0F1C] text-white overflow-x-hidden selection:bg-primary selection:text-white">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse"></div>
                <div className="absolute top-[20%] right-[-10%] w-[30%] h-[40%] rounded-full bg-secondary/20 blur-[100px] animate-pulse delay-700"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[40%] rounded-full bg-purple-500/10 blur-[100px] animate-pulse delay-1000"></div>
            </div>

            {/* Navbar */}
            <nav className="relative z-50 w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                        <CodeIcon />
                    </div>
                    <span className="text-xl font-bold tracking-tight">CodeDuelZ</span>
                </div>
                <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                    <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
                    <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={onLoginClick}
                        className="hidden md:block text-slate-300 hover:text-white font-medium transition-colors"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={onLoginClick}
                        className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        Get Started Free
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 pt-20 pb-32 px-6 max-w-7xl mx-auto text-center">
                <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary-light mb-8 backdrop-blur-sm">
                        <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse"></span>
                        Real-time Multiplayer Coding is live!
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-tight">
                        Code. Compete. <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-secondary animate-gradient-x">
                            Dominate.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        The ultimate 1v1 competitive coding platform. Challenge developers worldwide,
                        climb the ranks, and master algorithms in real-time battles.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={onLoginClick}
                            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-primary-dark hover:to-primary text-white font-bold rounded-xl transition-all shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 text-lg group"
                        >
                            Start Battling Now
                            <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
                        </button>
                        <button className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all backdrop-blur-sm">
                            View Leaderboard
                        </button>
                    </div>
                </div>

                {/* Floating Stats / Hero Image Placeholder */}
                <div className={`mt-20 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                    <div className="relative mx-auto max-w-5xl rounded-2xl border border-white/10 bg-[#0F1629]/80 backdrop-blur-xl shadow-2xl overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

                        {/* Mock Editor UI */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#0A0F1C]/50">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                            </div>
                            <div className="ml-4 text-xs text-slate-500 font-mono">match_arena.js — CodeDuelZ</div>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="text-left space-y-6">
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-colors">
                                    <div className="p-3 rounded-lg bg-green-500/10 text-green-400">
                                        <UsersIcon />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">1,204</div>
                                        <div className="text-sm text-slate-400">Online Players</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-colors">
                                    <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400">
                                        <ZapIcon />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">54ms</div>
                                        <div className="text-sm text-slate-400">Average Match Time</div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative h-64 rounded-xl bg-[#0A0F1C] border border-white/5 p-4 font-mono text-xs md:text-sm text-left overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 text-slate-600">JS</div>
                                <div className="space-y-1">
                                    <div className="text-slate-500">// Solve the Two Sum problem</div>
                                    <div><span className="text-purple-400">function</span> <span className="text-blue-400">twoSum</span>(nums, target) {'{'}</div>
                                    <div className="pl-4"><span className="text-purple-400">const</span> map = <span className="text-purple-400">new</span> <span className="text-yellow-300">Map</span>();</div>
                                    <div className="pl-4"><span className="text-purple-400">for</span> (<span className="text-purple-400">let</span> i = 0; i &lt; nums.length; i++) {'{'}</div>
                                    <div className="pl-8"><span className="text-purple-400">const</span> diff = target - nums[i];</div>
                                    <div className="pl-8"><span className="text-slate-500">...</span></div>
                                    <div className="pl-4">{'}'}</div>
                                    <div>{'}'}</div>
                                </div>

                                {/* Typing Cursor Effect */}
                                <div className="absolute bottom-4 right-4 animate-bounce text-primary">
                                    <div className="px-3 py-1 rounded bg-primary/20 border border-primary/50 text-primary text-xs font-bold">
                                        OPPONENT COMPILING...
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Overlay Gradient at Bottom */}
                        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#0F1629] to-transparent pointer-events-none"></div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for <span className="text-primary">High-Speed</span> Duels</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Experience the most responsive and feature-rich competitive coding environment.
                        Zero latency, instant feedback.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <ZapIcon />,
                            title: "Real-time Execution",
                            desc: "See your code results instantly. Our distributed evaluation engine runs your code in milliseconds."
                        },
                        {
                            icon: <TrophyIcon />,
                            title: "Global Leaderboards",
                            desc: "Climb the ranks and earn badges. Compete in weekly tournaments for exclusive rewards."
                        },
                        {
                            icon: <GlobeIcon />,
                            title: "10+ Languages",
                            desc: "Python, Java, C++, JavaScript and more. Code in your preferred language without limitations."
                        },
                        {
                            icon: <TerminalIcon />,
                            title: "Smart Editor",
                            desc: "Monaco-based editor with IntelliSense, syntax highlighting, and Vim mode support."
                        },
                        {
                            icon: <UsersIcon />,
                            title: "Community Driven",
                            desc: "Join a thriving community of developers. Share solutions, discuss strategies, and grow together."
                        },
                        {
                            icon: <CodeIcon />,
                            title: "Interview Prep",
                            desc: "Problems curated from top tech interviews. Google, Amazon, and Meta style questions."
                        }
                    ].map((feature, idx) => (
                        <div key={idx} className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] hover:border-primary/30 transition-all duration-300">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors text-slate-100">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-32 px-6 text-center">
                <div className="max-w-4xl mx-auto relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-20 blur-[100px] rounded-full pointer-events-none"></div>

                    <div className="relative bg-[#0F1629]/50 backdrop-blur-md border border-white/10 rounded-3xl p-12 md:p-20 overflow-hidden">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Prove Your Skills?</h2>
                        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                            Join 10,000+ developers competing daily. It's free to start.
                        </p>
                        <button
                            onClick={onLoginClick}
                            className="px-10 py-5 bg-white text-black hover:bg-slate-200 font-bold rounded-xl transition-all shadow-xl hover:-translate-y-1 text-lg"
                        >
                            Join CodeDuelZ Free
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/10 bg-[#0A0F1C] pt-20 pb-10 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <CodeIcon />
                            <span className="text-xl font-bold">CodeDuelZ</span>
                        </div>
                        <p className="text-slate-400 max-w-sm">
                            The next generation competitive coding platform.
                            Built for developers, by developers.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-white">Platform</h4>
                        <ul className="space-y-4 text-slate-400">
                            <li className="hover:text-primary cursor-pointer transition-colors">Features</li>
                            <li className="hover:text-primary cursor-pointer transition-colors">Pricing</li>
                            <li className="hover:text-primary cursor-pointer transition-colors">Enterprise</li>
                            <li className="hover:text-primary cursor-pointer transition-colors">Changelog</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-white">Company</h4>
                        <ul className="space-y-4 text-slate-400">
                            <li className="hover:text-primary cursor-pointer transition-colors">About</li>
                            <li className="hover:text-primary cursor-pointer transition-colors">Careers</li>
                            <li className="hover:text-primary cursor-pointer transition-colors">Blog</li>
                            <li className="hover:text-primary cursor-pointer transition-colors">Contact</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 text-center text-slate-500 text-sm">
                    © 2026 CodeDuelZ Inc. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

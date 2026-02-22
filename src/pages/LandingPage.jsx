import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);
const ZapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
    <path d="M4 22h16"></path>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
  </svg>
);
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const TerminalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 5"></polyline>
    <line x1="12" y1="19" x2="20" y2="19"></line>
  </svg>
);

const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

export default function LandingPage({ onLoginClick }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    { icon: <ZapIcon />, title: "Instant Battles", desc: "Sub-50ms matchmaking. Jump into a match in seconds, not minutes." },
    { icon: <TrophyIcon />, title: "Ranked Competitions", desc: "Climb global leaderboards. Earn badges. Prove you're the best." },
    { icon: <GlobeIcon />, title: "10+ Languages", desc: "Code in Python, JavaScript, C++, Java, or whatever floats your boat." },
    { icon: <TerminalIcon />, title: "Pro Editor", desc: "Monaco-powered editor with IntelliSense. Feel like a pro." },
    { icon: <UsersIcon />, title: "Global Community", desc: "20,000+ developers. Daily tournaments. Infinite learning." },
    { icon: <CodeIcon />, title: "Interview Prep", desc: "Problems from Google, Meta, Amazon. Ace your next interview." },
  ];

  return (
    <div className="min-h-screen bg-background text-text overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30"></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-tertiary/10 rounded-full blur-[150px] animate-pulse delay-1000"></div>
        
        {/* Scanning line effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent animate-pulse"></div>
        </div>
      </div>

      {/* Navbar */}
      <nav className={`relative z-50 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="flex items-center gap-3">
          <img src={logo} alt="CodeDuelZ" className="w-12 h-12" />
          <span className="text-xl font-bold tracking-tight">CodeDuelZ</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-text-secondary hover:text-text transition-colors text-sm font-medium">Features</a>
          <a href="#how-it-works" className="text-text-secondary hover:text-text transition-colors text-sm font-medium">How it Works</a>
          <a href="#community" className="text-text-secondary hover:text-text transition-colors text-sm font-medium">Community</a>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={onLoginClick}
            className="text-text-secondary hover:text-text transition-colors text-sm font-medium"
          >
            Sign In
          </button>
          <button
            onClick={onLoginClick}
            className="btn-primary"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-32 px-6 max-w-7xl mx-auto">
        <div className={`text-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-elevated border border-border text-sm mb-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-text-secondary">Live: <span className="text-accent font-medium">1,247</span> players online</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
            Code. Battle. <br />
            <span className="text-gradient">Dominate.</span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed">
            The ultimate real-time competitive coding platform. Challenge developers worldwide, 
            climb the ranks, and prove you're the sharpest coder alive.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <button
              onClick={onLoginClick}
              className="btn-primary text-lg px-10 py-4"
            >
              Start Coding Now
              <ArrowRight />
            </button>
            <button className="btn-secondary text-lg px-10 py-4">
              View Leaderboard
            </button>
          </div>

          {/* Code Preview Card */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-accent/10 via-tertiary/10 to-accent/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-surface-elevated border border-border rounded-xl overflow-hidden shadow-2xl">
              {/* Window Controls */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="ml-4 text-xs text-text-muted font-mono">arena.js — CodeDuelZ</div>
              </div>

              {/* Code Content */}
              <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Stats */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-surface border border-border hover:border-accent/30 transition-colors group">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                      <UsersIcon />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">1,247</div>
                      <div className="text-sm text-text-secondary">Active Battlers</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-lg bg-surface border border-border hover:border-accent/30 transition-colors group">
                    <div className="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
                      <ZapIcon />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">47ms</div>
                      <div className="text-sm text-text-secondary">Avg Match Time</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-lg bg-surface border border-border hover:border-accent/30 transition-colors group">
                    <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                      <TrophyIcon />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">$10K</div>
                      <div className="text-sm text-text-secondary">Monthly Prizes</div>
                    </div>
                  </div>
                </div>

                {/* Code Block */}
                <div className="relative h-64 rounded-lg bg-background border border-border p-4 font-mono text-sm overflow-hidden">
                  <div className="absolute top-0 right-0 px-2 py-1 text-xs text-text-muted bg-surface rounded-bl">JavaScript</div>
                  <pre className="text-text-secondary">
{`// Solve Two Sum in O(n)
function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}

// 🏆 0.003ms - You won!`}
                  </pre>
                  
                  {/* Victory overlay */}
                  <div className="absolute bottom-4 right-4 animate-pulse">
                    <div className="px-4 py-2 rounded-lg bg-accent/20 border border-accent/50 text-accent text-sm font-bold">
                      ✓ OPPONENT SUBMITTED
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Engineered for <span className="text-accent">Speed</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Every millisecond counts. We've built the fastest competitive coding platform from the ground up.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="card group p-8"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/10 to-tertiary/10 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-text">{feature.title}</h3>
              <p className="text-text-secondary leading-relaxed text-sm">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '50K+', label: 'Total Players' },
              { number: '1M+', label: 'Matches Played' },
              { number: '10+', label: 'Languages' },
              { number: '99.9%', label: 'Uptime' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl md:text-5xl font-black text-gradient mb-2">{stat.number}</div>
                <div className="text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 md:p-20 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-tertiary/5"></div>
            <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20"></div>
            
            <div className="relative text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Prove Yourself?</h2>
              <p className="text-xl text-text-secondary mb-10 max-w-xl mx-auto">
                Join thousands of developers competing daily. Your next battle is just a click away.
              </p>
              <button
                onClick={onLoginClick}
                className="btn-primary text-lg px-12 py-5"
              >
                Start Battling Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border bg-surface py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img src={logo} alt="CodeDuelZ" className="w-10 h-10" />
                <span className="text-lg font-bold">CodeDuelZ</span>
              </div>
              <p className="text-text-secondary text-sm max-w-sm">
                The next generation competitive coding platform. Built for developers who demand excellence.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-text">Platform</h4>
              <ul className="space-y-3 text-text-secondary text-sm">
                <li className="hover:text-accent cursor-pointer transition-colors">Features</li>
                <li className="hover:text-accent cursor-pointer transition-colors">Pricing</li>
                <li className="hover:text-accent cursor-pointer transition-colors">Leaderboard</li>
                <li className="hover:text-accent cursor-pointer transition-colors">Tournaments</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-text">Company</h4>
              <ul className="space-y-3 text-text-secondary text-sm">
                <li className="hover:text-accent cursor-pointer transition-colors">About</li>
                <li className="hover:text-accent cursor-pointer transition-colors">Blog</li>
                <li className="hover:text-accent cursor-pointer transition-colors">Careers</li>
                <li className="hover:text-accent cursor-pointer transition-colors">Contact</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border text-center text-text-muted text-sm">
            © 2026 CodeDuelZ. Crafted with precision.
          </div>
        </div>
      </footer>
    </div>
  );
}

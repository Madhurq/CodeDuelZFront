import { useState } from 'react';

const DIFFICULTIES = [
    { value: 'easy', label: 'Easy', icon: '🌱', activeClass: 'border-success bg-success/10 text-success' },
    { value: 'medium', label: 'Medium', icon: '🔥', activeClass: 'border-warning bg-warning/10 text-warning' },
    { value: 'hard', label: 'Hard', icon: '💀', activeClass: 'border-error bg-error/10 text-error' },
];

export default function ChallengeModal({ challengeRequest, onAccept, onDecline }) {
    const [difficulty, setDifficulty] = useState('medium');

    if (!challengeRequest) return null;

    const { fromUsername } = challengeRequest;

    return (
        // Backdrop
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onDecline}
            />

            {/* Modal card */}
            <div className="relative z-10 w-full max-w-md bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-in">
                {/* Header glow strip */}
                <div className="h-1 w-full bg-gradient-to-r from-accent via-tertiary to-accent" />

                <div className="p-8">
                    {/* Avatar + title */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-dim flex items-center justify-center text-2xl font-bold text-black shadow-glow mb-4">
                            {fromUsername.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-2xl font-black mb-1">
                            Challenge Request!
                        </h2>
                        <p className="text-text-secondary">
                            <span className="text-accent font-semibold">{fromUsername}</span> wants to duel you
                        </p>
                    </div>

                    {/* Difficulty selector */}
                    <div className="mb-8">
                        <p className="text-sm font-medium text-text-secondary mb-3 text-center">Choose difficulty</p>
                        <div className="grid grid-cols-3 gap-3">
                            {DIFFICULTIES.map((d) => (
                                <button
                                    key={d.value}
                                    onClick={() => setDifficulty(d.value)}
                                    className={`p-3 rounded-xl border-2 font-semibold text-sm transition-all duration-200 flex flex-col items-center gap-1 ${difficulty === d.value
                                            ? d.activeClass
                                            : 'border-border text-text-secondary hover:border-border-light hover:text-text'
                                        }`}
                                >
                                    <span className="text-xl">{d.icon}</span>
                                    {d.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={onDecline}
                            className="py-3 rounded-xl border-2 border-error/40 bg-error/10 text-error font-semibold hover:bg-error/20 transition-all"
                        >
                            Decline
                        </button>
                        <button
                            onClick={() => onAccept(difficulty)}
                            className="py-3 rounded-xl bg-gradient-to-r from-accent to-accent-dim text-black font-bold hover:shadow-glow transition-all"
                        >
                            ⚡ Accept
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

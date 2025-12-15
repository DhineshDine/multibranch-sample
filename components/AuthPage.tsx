
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Lock, ChevronRight, Terminal } from 'lucide-react';
import { User } from '../types';
import { db } from '../db';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  // Credentials are now hidden, starting state is empty
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username) return;

    // Simulated network delay
    setTimeout(async () => {
        // --- ADMIN LOGIN LOGIC ---
        // Specific hardcoded check for the "Admin" logic as requested, but verified against DB presence
        if (username === 'dine_15' && password === 'Dhinesh') {
            const adminUser = await db.auth.login('dine_15');
            if (adminUser && adminUser.isAdmin) {
                onLogin(adminUser);
                return;
            }
        }

        if (username === 'dine_15' && password !== 'Dhinesh') {
            setError('INVALID CREDENTIALS CODE: 403');
            return;
        }

        // --- REGULAR USER LOGIC ---
        if (isRegistering) {
            // Check if user exists
            const existing = await db.auth.login(username);
            if (existing) {
                setError('IDENTITY ALREADY REGISTERED');
                return;
            }
            const newUser = await db.auth.register(username);
            onLogin(newUser);
        } else {
            const user = await db.auth.login(username);
            if (user) {
                onLogin(user);
            } else {
                setError('USER NOT FOUND. PLEASE REGISTER.');
            }
        }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-retro-dark p-4 relative overflow-hidden">
      {/* Background Matrix-like effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none font-mono text-xs overflow-hidden leading-none text-retro-primary">
        {Array.from({ length: 100 }).map((_, i) => (
          <div key={i} className="whitespace-nowrap animate-float" style={{ animationDuration: `${Math.random() * 5 + 2}s`, marginLeft: `${Math.random() * 100}vw` }}>
            {Math.random().toString(2).substring(2)}
          </div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-retro-dark border-4 border-retro-primary relative shadow-[0_0_40px_rgba(255,208,0,0.2)]"
      >
        <div className="bg-retro-primary p-2 text-retro-dark font-pixel flex justify-between items-center">
            <span>SYSTEM_ACCESS_V.1.0</span>
            <div className="flex gap-1">
                <div className="w-3 h-3 bg-retro-dark rounded-full"></div>
                <div className="w-3 h-3 bg-retro-dark/50 rounded-full"></div>
            </div>
        </div>

        <div className="p-8 space-y-8 relative">
             {/* Scanlines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-10 opacity-20"></div>

            <div className="text-center space-y-2">
                <Terminal size={48} className="mx-auto text-retro-primary mb-4 animate-pulse" />
                <h1 className="font-pixel text-4xl text-white">STRANGE SHOWS</h1>
                <p className="font-mono text-retro-primary text-xs tracking-widest uppercase">
                    {isRegistering ? 'Initialize New Identity' : 'Verify Credentials'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-20">
                <div className="space-y-2">
                    <label className="font-mono text-xs text-gray-400 uppercase">Username</label>
                    <div className="relative group">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-retro-primary transition-colors" size={18} />
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-[#16161e] border-2 border-gray-700 focus:border-retro-primary outline-none py-3 pl-10 pr-4 text-white font-mono transition-all"
                            placeholder="ENTER_ID"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="font-mono text-xs text-gray-400 uppercase">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-retro-primary transition-colors" size={18} />
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#16161e] border-2 border-gray-700 focus:border-retro-primary outline-none py-3 pl-10 pr-4 text-white font-mono transition-all"
                            placeholder="********"
                        />
                    </div>
                </div>

                {error && (
                    <div className="text-red-500 font-mono text-xs text-center border border-red-500/50 bg-red-500/10 p-2">
                        {error}
                    </div>
                )}

                <button 
                    type="submit"
                    className="w-full bg-retro-primary text-retro-dark font-pixel text-xl py-3 hover:bg-white transition-colors relative group overflow-hidden"
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {isRegistering ? 'REGISTER IDENTITY' : 'ACCESS SYSTEM'} <ChevronRight />
                    </span>
                    <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform z-0"></div>
                </button>
            </form>

            <div className="text-center font-mono text-xs relative z-20">
                <button 
                    type="button"
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-gray-500 hover:text-retro-primary underline decoration-dashed"
                >
                    {isRegistering ? 'ALREADY HAVE AN ID? LOGIN' : 'NEW USER? CLAIM $100 CREDITS'}
                </button>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Star } from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const days = Array.from({ length: 35 }, (_, i) => i + 1);
  const currentMonth = "OCTOBER 1999";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="max-w-6xl mx-auto"
    >
        <div className="flex justify-between items-center mb-8">
            <h2 className="font-pixel text-4xl text-retro-primary flex items-center gap-3">
                <CalendarIcon size={32} />
                SHOWTIME SCHEDULE
            </h2>
            <div className="flex items-center gap-4 bg-retro-dark border border-retro-light/20 p-2">
                <button className="p-2 hover:bg-retro-light/10 text-retro-light"><ChevronLeft /></button>
                <span className="font-mono font-bold text-xl min-w-[150px] text-center">{currentMonth}</span>
                <button className="p-2 hover:bg-retro-light/10 text-retro-light"><ChevronRight /></button>
            </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-retro-dark border-2 border-retro-purple/50 p-1 shadow-[0_0_20px_rgba(127,90,240,0.2)]">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                <div key={day} className="p-4 text-center font-pixel text-xl text-retro-purple bg-[#12121a]">
                    {day}
                </div>
            ))}
            
            {days.map((day) => {
                // Mock random events
                const hasEvent = [5, 12, 15, 22, 28, 31].includes(day);
                const isSpecial = day === 31;
                
                return (
                    <div 
                        key={day} 
                        className={`
                            min-h-[120px] bg-[#1a1a24] p-2 relative group hover:bg-[#20202e] transition-colors
                            ${day > 31 ? 'opacity-20 pointer-events-none' : ''}
                        `}
                    >
                        <span className={`font-mono text-sm ${isSpecial ? 'text-retro-accent font-bold' : 'text-gray-500'}`}>
                            {day <= 31 ? day : day - 31}
                        </span>

                        {hasEvent && day <= 31 && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-2"
                            >
                                <div className={`
                                    text-[10px] font-bold p-1 border-l-2 mb-1 truncate
                                    ${isSpecial 
                                        ? 'border-retro-accent bg-retro-accent/10 text-retro-accent' 
                                        : 'border-retro-primary bg-retro-primary/10 text-retro-primary'
                                    }
                                `}>
                                    {isSpecial ? 'HALLOWEEN SPECIAL' : 'MIDNIGHT PREMIERE'}
                                </div>
                                <div className="flex gap-1">
                                     <Star size={8} className="text-yellow-500" fill="currentColor" />
                                     <Star size={8} className="text-yellow-500" fill="currentColor" />
                                     <Star size={8} className="text-yellow-500" fill="currentColor" />
                                </div>
                            </motion.div>
                        )}

                        {/* Hover Effect Overlay */}
                        <div className="absolute inset-0 border-2 border-retro-primary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>
                );
            })}
        </div>

        <div className="mt-6 flex gap-8 justify-center font-mono text-xs text-gray-500">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-retro-primary/20 border-l-2 border-retro-primary"></div>
                STANDARD SHOWING
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-retro-accent/20 border-l-2 border-retro-accent"></div>
                SPECIAL EVENT
            </div>
        </div>
    </motion.div>
  );
};

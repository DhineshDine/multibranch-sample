import React from 'react';
import { motion } from 'framer-motion';
import { Ticket as TicketIcon, Clock, Star, Film, Clapperboard, Video } from 'lucide-react';
import { Movie } from '../types';

interface TicketCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ movie, onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover="hover"
      transition={{ type: 'spring', stiffness: 300 }}
      className="relative w-full max-w-sm mx-auto group cursor-pointer"
      onClick={() => onSelect(movie)}
    >
      {/* Animated Floating Icons on Hover */}
      <motion.div
        variants={{
          hover: { opacity: 1, y: -40, rotate: -15, transition: { duration: 0.4 } }
        }}
        initial={{ opacity: 0, y: 0, rotate: 0 }}
        className="absolute -top-6 -left-6 z-20 text-retro-primary"
      >
        <Clapperboard size={32} fill="currentColor" className="text-retro-dark" strokeWidth={1.5} />
      </motion.div>
      
      <motion.div
        variants={{
          hover: { opacity: 1, y: -50, x: 20, rotate: 15, transition: { duration: 0.5, delay: 0.1 } }
        }}
        initial={{ opacity: 0, y: 0, x: 0, rotate: 0 }}
        className="absolute -top-8 right-10 z-20 text-retro-accent"
      >
        <Film size={28} />
      </motion.div>

      <motion.div
        variants={{
          hover: { opacity: 1, y: 20, x: 40, rotate: -10, transition: { duration: 0.4, delay: 0.2 } }
        }}
        initial={{ opacity: 0, y: 0, x: 0, rotate: 0 }}
        className="absolute bottom-20 -right-6 z-20 text-retro-purple"
      >
        <Video size={30} fill="currentColor" className="text-retro-dark" />
      </motion.div>

      {/* Ticket Container */}
      <motion.div 
        variants={{ hover: { y: -10 } }}
        className="relative bg-retro-dark border-2 border-retro-purple overflow-hidden shadow-[0_0_15px_rgba(127,90,240,0.3)] hover:shadow-[0_0_25px_rgba(127,90,240,0.6)] transition-shadow duration-300"
      >
        
        {/* Notches */}
        <div className="absolute top-1/2 -left-3 w-6 h-6 bg-[#0f0e17] rounded-full z-10 border-r-2 border-retro-purple" />
        <div className="absolute top-1/2 -right-3 w-6 h-6 bg-[#0f0e17] rounded-full z-10 border-l-2 border-retro-purple" />
        
        {/* Dashed Line */}
        <div className="absolute top-1/2 left-4 right-4 border-t-2 border-dashed border-retro-purple/30 z-0" />

        <div className="flex flex-col h-full relative z-1">
            {/* Top Section (Image) */}
            <div className="h-64 relative overflow-hidden border-b-2 border-retro-purple border-dashed">
                <img 
                    src={movie.image} 
                    alt={movie.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-retro-dark to-transparent p-4 pt-12">
                     <h3 className="font-pixel text-3xl text-retro-primary drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                        {movie.title}
                     </h3>
                </div>
                <div className="absolute top-2 right-2 bg-retro-accent text-white font-mono text-xs px-2 py-1 transform rotate-3">
                    ${movie.price}
                </div>
            </div>

            {/* Bottom Section (Info) */}
            <div className="p-4 pt-6 bg-retro-dark flex flex-col gap-3">
                <div className="flex justify-between items-center text-retro-light/70 font-mono text-xs">
                    <span className="flex items-center gap-1">
                        <Clock size={14} /> {movie.duration}
                    </span>
                    <span className="flex items-center gap-1 border border-retro-light/30 px-1 rounded">
                        {movie.rating}
                    </span>
                    <span className="flex items-center gap-1 text-yellow-400">
                        <Star size={14} fill="currentColor" /> 4.5
                    </span>
                </div>
                
                <p className="font-mono text-sm text-gray-400 line-clamp-2 min-h-[2.5rem]">
                    {movie.tagline}
                </p>

                <div className="flex flex-wrap gap-2 mt-2">
                    {movie.genre.map(g => (
                        <span key={g} className="text-[10px] font-mono uppercase tracking-widest border border-retro-green text-retro-green px-2 py-0.5 rounded-full">
                            {g}
                        </span>
                    ))}
                </div>

                <div className="mt-2 pt-4 border-t border-retro-purple/20 flex justify-between items-center group-hover:text-retro-primary transition-colors">
                     <span className="font-pixel text-xl uppercase">Book Now</span>
                     <TicketIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                </div>
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
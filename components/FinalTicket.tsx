import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Movie } from '../types';
import { QrCode, Share2, Download } from 'lucide-react';
import { RetroButton } from './RetroButton';

interface FinalTicketProps {
  ticket: Ticket;
  movie: Movie;
  onReset: () => void;
}

export const FinalTicket: React.FC<FinalTicketProps> = ({ ticket, movie, onReset }) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", duration: 0.8 }}
      className="max-w-md mx-auto w-full relative"
    >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-retro-accent blur-[60px] opacity-20 animate-pulse"></div>

      <div className="bg-[#fffdf5] text-retro-dark relative overflow-hidden rounded-sm shadow-2xl">
        {/* Perforation Line */}
        <div className="absolute top-[70%] left-0 right-0 border-t-4 border-dashed border-gray-300 z-10 flex justify-between items-center -translate-y-1/2">
            <div className="w-8 h-8 bg-retro-dark rounded-full -translate-x-1/2"></div>
            <div className="w-8 h-8 bg-retro-dark rounded-full translate-x-1/2"></div>
        </div>

        {/* Top Part */}
        <div className="p-8 pb-12 relative">
           <div className="border-4 border-retro-dark p-4 h-full">
               <div className="flex justify-between items-start mb-6">
                   <h1 className="font-pixel text-4xl leading-none uppercase max-w-[70%]">{movie.title}</h1>
                   <div className="text-right">
                       <span className="block font-mono text-xs uppercase tracking-wider text-gray-500">Admit One</span>
                       <span className="block font-bold font-mono text-xl">{ticket.seats.length}x</span>
                   </div>
               </div>
               
               <div className="space-y-4 font-mono">
                   <div className="flex justify-between border-b-2 border-gray-200 pb-2">
                       <span className="uppercase text-gray-500 text-xs">Date</span>
                       <span className="font-bold">{new Date().toLocaleDateString()}</span>
                   </div>
                   <div className="flex justify-between border-b-2 border-gray-200 pb-2">
                       <span className="uppercase text-gray-500 text-xs">Time</span>
                       <span className="font-bold">{ticket.showtime}</span>
                   </div>
                   <div className="flex justify-between border-b-2 border-gray-200 pb-2">
                       <span className="uppercase text-gray-500 text-xs">Seats</span>
                       <span className="font-bold text-retro-accent">{ticket.seats.join(', ')}</span>
                   </div>
                    <div className="flex justify-between items-end pt-2">
                       <span className="uppercase text-gray-500 text-xs">Total Paid</span>
                       <span className="font-pixel text-3xl">${ticket.total}</span>
                   </div>
               </div>
           </div>
           
           <div className="absolute top-2 right-2">
               <span className="font-mono text-[10px] text-gray-400 rotating-text">STRANGE SHOWS ADMISSION</span>
           </div>
        </div>

        {/* Bottom Part (Stub) */}
        <div className="bg-[#f0eadd] p-6 pt-10 flex justify-between items-center">
            <div className="flex flex-col gap-1">
                <span className="font-pixel text-2xl text-retro-dark">SCAN ME</span>
                <span className="font-mono text-[10px] text-gray-500 max-w-[150px]">{ticket.id}</span>
            </div>
            <div className="p-2 bg-white border-2 border-retro-dark">
                <QrCode size={64} className="text-retro-dark" />
            </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4 justify-center">
          <RetroButton onClick={onReset} variant="secondary">
             Book Another
          </RetroButton>
          <RetroButton onClick={() => alert('Saved to gallery!')} variant="primary" className="flex items-center gap-2">
             <Download size={18} /> Save
          </RetroButton>
      </div>
    </motion.div>
  );
};
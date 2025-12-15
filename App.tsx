import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Ticket as TicketIcon, Zap } from 'lucide-react';
import { MOVIES } from './constants';
import { Movie, BookingStep, Ticket } from './types';
import { TicketCard } from './components/TicketCard';
import { SeatSelector } from './components/SeatSelector';
import { FinalTicket } from './components/FinalTicket';

const App = () => {
  const [step, setStep] = useState<BookingStep>(BookingStep.BROWSING);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [ticket, setTicket] = useState<Ticket | null>(null);

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    // Auto-select first showtime for simplicity in this demo, or we could add a time selector step
    setSelectedTime(movie.showtimes[0]);
    setStep(BookingStep.SELECTING_SEATS);
  };

  const handleConfirmSeats = (seats: string[]) => {
    if (!selectedMovie) return;

    const newTicket: Ticket = {
      id: `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      movieId: selectedMovie.id,
      showtime: selectedTime,
      seats: seats,
      total: seats.length * selectedMovie.price,
      date: new Date().toISOString()
    };
    setTicket(newTicket);
    setStep(BookingStep.CONFIRMATION);
  };

  const handleReset = () => {
    setStep(BookingStep.BROWSING);
    setSelectedMovie(null);
    setTicket(null);
  };

  return (
    <div className="min-h-screen bg-retro-dark text-retro-light font-mono selection:bg-retro-accent selection:text-white pb-20">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-retro-dark/90 backdrop-blur-md border-b border-retro-purple/30 mb-8">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={handleReset}>
            <div className="bg-retro-primary p-2 rounded-sm border-2 border-retro-light group-hover:rotate-12 transition-transform shadow-[4px_4px_0px_#e53170]">
                <Film className="text-retro-dark w-6 h-6" />
            </div>
            <div className="flex flex-col">
                <h1 className="font-pixel text-3xl leading-none text-transparent bg-clip-text bg-gradient-to-r from-retro-primary to-retro-accent filter drop-shadow-[2px_2px_0px_rgba(255,255,255,0.2)]">
                    STRANGE SHOWS
                </h1>
                <span className="text-[10px] tracking-[0.3em] uppercase text-retro-purple">Tickets & Oddities</span>
            </div>
          </div>
          
          <nav className="hidden md:flex gap-6 text-sm font-bold uppercase tracking-wider">
             <a href="#" className="hover:text-retro-primary transition-colors flex items-center gap-1"><Zap size={14} /> Now Showing</a>
             <a href="#" className="hover:text-retro-primary transition-colors">Coming Soon</a>
             <a href="#" className="hover:text-retro-primary transition-colors">Merch</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 relative">
        <AnimatePresence mode="wait">
          
          {step === BookingStep.BROWSING && (
            <motion.div
              key="browsing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -100 }}
              className="space-y-12"
            >
              <div className="flex flex-col items-center justify-center space-y-8 mb-16">
                  {/* Now Showing Box */}
                  <div className="border-4 border-retro-purple p-4 px-12 bg-retro-dark relative shadow-[0_0_20px_rgba(127,90,240,0.3)]">
                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-retro-purple"></div>
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-retro-purple"></div>
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-retro-purple"></div>
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-retro-purple"></div>
                    
                    <h2 className="text-4xl md:text-6xl font-pixel text-white tracking-widest animate-pulse-fast">NOW SHOWING</h2>
                  </div>

                  <p className="text-retro-green font-mono text-sm md:text-base max-w-lg mx-auto border-l-4 border-retro-green pl-4 text-left bg-retro-green/5 p-4 rounded-r-md">
                    // SYSTEM_MSG: Select a feature presentation below. 
                    <br/>// WARNING: Side effects may include popcorn craving and mild hallucinations.
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {MOVIES.map((movie) => (
                  <TicketCard key={movie.id} movie={movie} onSelect={handleSelectMovie} />
                ))}
              </div>
            </motion.div>
          )}

          {step === BookingStep.SELECTING_SEATS && selectedMovie && (
            <motion.div
              key="seats"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-4xl mx-auto"
            >
              <div className="mb-8 flex items-center gap-4 border-b border-dashed border-gray-700 pb-4">
                 <button onClick={() => setStep(BookingStep.BROWSING)} className="text-retro-primary hover:underline font-pixel text-xl">
                    &lt; BACK
                 </button>
                 <div>
                    <h2 className="text-2xl font-bold text-white">{selectedMovie.title}</h2>
                    <p className="text-sm text-gray-400">
                        {selectedTime} • {selectedMovie.rating} • 
                        <span className="text-retro-accent ml-2">${selectedMovie.price}/ticket</span>
                    </p>
                 </div>
              </div>

              <SeatSelector 
                price={selectedMovie.price}
                onConfirm={handleConfirmSeats}
                onCancel={() => setStep(BookingStep.BROWSING)}
              />
            </motion.div>
          )}

          {step === BookingStep.CONFIRMATION && ticket && selectedMovie && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center min-h-[60vh]"
            >
                <div className="text-center mb-8">
                    <h2 className="font-pixel text-5xl text-retro-primary mb-2">ENJOY THE SHOW</h2>
                    <p className="font-mono text-gray-400">Please present this ticket at the airlock.</p>
                </div>
                <FinalTicket ticket={ticket} movie={selectedMovie} onReset={handleReset} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Retro Footer Decoration */}
      <footer className="fixed bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-retro-primary via-retro-accent to-retro-purple animate-pulse"></footer>
    </div>
  );
};

export default App;
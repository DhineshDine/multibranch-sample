import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SEAT_ROWS, SEAT_COLS } from '../constants';

interface SeatSelectorProps {
  price: number;
  onConfirm: (seats: string[]) => void;
  onCancel: () => void;
}

export const SeatSelector: React.FC<SeatSelectorProps> = ({ price, onConfirm, onCancel }) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const toggleSeat = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  // Generate seats grid
  const renderSeats = () => {
    const seats = [];
    for (let r = 0; r < SEAT_ROWS; r++) {
      const rowLabel = String.fromCharCode(65 + r);
      const rowSeats = [];
      for (let c = 1; c <= SEAT_COLS; c++) {
        const seatId = `${rowLabel}${c}`;
        const isSelected = selectedSeats.includes(seatId);
        // Randomly disable some seats to simulate occupancy
        const isOccupied = (r * c + c) % 7 === 0 || (r * c + c) % 11 === 0;

        rowSeats.push(
          <motion.button
            key={seatId}
            whileHover={!isOccupied ? { scale: 1.2 } : {}}
            whileTap={!isOccupied ? { scale: 0.9 } : {}}
            disabled={isOccupied}
            onClick={() => toggleSeat(seatId)}
            className={`
              w-8 h-8 md:w-10 md:h-10 m-1 rounded-sm text-xs font-mono font-bold
              flex items-center justify-center transition-all border-b-4
              ${isOccupied 
                ? 'bg-gray-800 text-gray-600 border-gray-900 cursor-not-allowed' 
                : isSelected 
                  ? 'bg-retro-accent text-white border-red-900 shadow-[0_0_10px_#e53170]' 
                  : 'bg-retro-green/20 text-retro-green border-retro-green/50 hover:bg-retro-green hover:text-retro-dark'
              }
            `}
          >
            {seatId}
          </motion.button>
        );
      }
      seats.push(
        <div key={rowLabel} className="flex justify-center mb-2">
          {rowSeats}
        </div>
      );
    }
    return seats;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-retro-dark border border-retro-purple/30 rounded-lg relative overflow-hidden">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(rgba(127, 90, 240, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(127, 90, 240, 0.5) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

      <div className="mb-8 text-center relative z-10">
        <div className="w-full h-12 bg-gradient-to-b from-retro-primary/20 to-transparent border-t-4 border-retro-primary rounded-[50%] transform perspective-[500px] rotate-x-12 shadow-[0_-10px_20px_rgba(255,137,6,0.3)] mb-8 flex items-end justify-center">
            <span className="text-retro-primary font-pixel text-xl tracking-widest uppercase opacity-70 mb-2">Screen</span>
        </div>
      </div>

      <div className="flex flex-col items-center mb-8 relative z-10">
        {renderSeats()}
      </div>

      <div className="flex justify-between items-center border-t border-dashed border-gray-700 pt-6 relative z-10">
        <div className="font-mono text-retro-light">
          <p className="text-sm opacity-60">SELECTED: {selectedSeats.length}</p>
          <p className="text-2xl text-retro-primary font-bold">TOTAL: ${selectedSeats.length * price}</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onCancel}
            className="px-6 py-2 font-pixel text-lg text-gray-400 hover:text-white underline decoration-dashed"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selectedSeats)}
            disabled={selectedSeats.length === 0}
            className="px-8 py-2 bg-retro-primary text-retro-dark font-pixel text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform shadow-[4px_4px_0px_rgba(255,255,255,0.2)]"
          >
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
};
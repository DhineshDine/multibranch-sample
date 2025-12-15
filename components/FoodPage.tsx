
import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, Pizza, Zap, Utensils } from 'lucide-react';
import { FoodItem } from '../types';

interface FoodPageProps {
    items: FoodItem[];
}

export const FoodPage: React.FC<FoodPageProps> = ({ items }) => {

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-6xl mx-auto"
    >
      <div className="text-center mb-12 relative">
        <h2 className="font-pixel text-5xl md:text-7xl text-retro-accent tracking-widest drop-shadow-[4px_4px_0_rgba(255,255,255,0.2)]">
          CONCESSIONS
        </h2>
        <p className="font-mono text-retro-light mt-4 text-sm tracking-wider uppercase">
          Fuel for your journey into the unknown.
        </p>
        <div className="absolute top-1/2 left-0 w-full h-px bg-retro-accent/30 -z-10"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((item) => (
          <motion.div 
            key={item.id}
            whileHover={{ y: -10 }}
            className={`
                bg-[#16161e] border-2 border-retro-accent/30 p-6 relative group overflow-hidden
                ${item.isOutOfStock ? 'opacity-50 grayscale pointer-events-none' : ''}
            `}
          >
            {item.isOutOfStock && (
                <div className="absolute top-4 right-4 z-20 text-red-500 font-bold border-2 border-red-500 px-2 py-1 rotate-12 bg-black">
                    SOLD OUT
                </div>
            )}

            <div className="h-40 bg-[#121218] mb-6 flex items-center justify-center border border-retro-accent/10 relative overflow-hidden group-hover:border-retro-accent transition-colors">
                {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                    <Utensils size={48} className="text-retro-accent group-hover:scale-110 transition-transform duration-500" />
                )}
                
                {/* Scanlines on image */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
            </div>

            <div className="flex justify-between items-start mb-2">
                <h3 className="font-pixel text-2xl text-white leading-none">{item.name}</h3>
                <span className="font-mono font-bold text-retro-accent text-xl">${item.price}</span>
            </div>
            
            <div className="flex gap-2 mb-4 flex-wrap">
                {item.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-retro-accent/10 text-retro-accent px-2 py-0.5 border border-retro-accent/20">
                        {tag}
                    </span>
                ))}
            </div>

            <p className="font-mono text-xs text-gray-500 mb-6 min-h-[3rem]">
                {item.description}
            </p>

            <button className="w-full bg-transparent border-2 border-retro-accent text-retro-accent font-pixel text-lg py-2 hover:bg-retro-accent hover:text-white transition-all uppercase tracking-wider relative overflow-hidden group/btn">
                <span className="relative z-10">Add to Order</span>
                <div className="absolute inset-0 bg-retro-accent translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-300 z-0"></div>
            </button>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-16 border-t border-dashed border-gray-700 pt-8 text-center">
          <p className="font-mono text-xs text-gray-500">
              * WARNING: Consuming Void Soda may result in temporary invisibility or loss of object permanence.
          </p>
      </div>
    </motion.div>
  );
};

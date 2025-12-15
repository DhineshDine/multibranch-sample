import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface RetroButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'accent';
  children: React.ReactNode;
}

export const RetroButton: React.FC<RetroButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '',
  ...props 
}) => {
  const colors = {
    primary: 'bg-retro-primary text-retro-dark border-retro-primary',
    secondary: 'bg-transparent text-retro-light border-retro-light hover:bg-retro-light hover:text-retro-dark',
    accent: 'bg-retro-accent text-white border-retro-accent',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: "4px 4px 0px rgba(255,255,255,0.2)" }}
      whileTap={{ scale: 0.95, boxShadow: "0px 0px 0px rgba(0,0,0,0)" }}
      className={`
        font-pixel text-xl tracking-wider px-6 py-2 border-2 uppercase transition-colors
        ${colors[variant]} ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
};
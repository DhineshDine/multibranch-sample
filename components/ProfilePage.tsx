
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Award, Film, Star, Ticket as TicketIcon, Zap, Edit2, Camera, Check, X } from 'lucide-react';
import { RetroButton } from './RetroButton';
import { User } from '../types';

interface ProfilePageProps {
    user: User;
    onUpdateUser: (updatedUser: Partial<User>) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.username);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveName = () => {
    if (editName.trim()) {
        onUpdateUser({ username: editName });
        setIsEditing(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            onUpdateUser({ avatar: reader.result as string });
        };
        reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header Profile Card */}
      <div className="bg-retro-dark border-2 border-retro-primary p-8 relative overflow-hidden shadow-[0_0_30px_rgba(255,208,0,0.1)]">
        <div className="absolute top-0 right-0 p-2 bg-retro-primary text-retro-dark font-pixel text-sm">
          LEVEL {user.level} OPERATOR
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
          {/* Avatar Area */}
          <div className="relative group">
            <div className="w-32 h-32 bg-retro-purple/20 border-4 border-retro-primary rounded-full overflow-hidden flex items-center justify-center relative">
               {user.avatar ? (
                   <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                   <UserIcon size={64} className="text-retro-light/50" />
               )}
               <div className="absolute inset-0 bg-gradient-to-tr from-retro-accent/20 to-transparent"></div>
               
               {/* Hover Overlay for Edit */}
               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}>
                    <Camera className="text-white" />
               </div>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept="image/*"
                 onChange={handleFileChange}
               />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-retro-accent border-2 border-retro-dark rounded-full p-2">
                <Zap size={16} className="text-white fill-current" />
            </div>
          </div>

          {/* Info Area */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-3">
                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <input 
                            type="text" 
                            value={editName} 
                            onChange={(e) => setEditName(e.target.value)}
                            className="bg-retro-dark border-b-2 border-retro-primary text-2xl font-pixel outline-none py-1 text-white w-48"
                            autoFocus
                        />
                        <button onClick={handleSaveName} className="p-1 hover:text-green-400"><Check size={20}/></button>
                        <button onClick={() => setIsEditing(false)} className="p-1 hover:text-red-400"><X size={20}/></button>
                    </div>
                ) : (
                    <h2 className="font-pixel text-4xl text-white flex items-center gap-3 group">
                        {user.username}
                        <button onClick={() => setIsEditing(true)} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-retro-primary">
                            <Edit2 size={16} />
                        </button>
                    </h2>
                )}
            </div>

            <p className="font-mono text-retro-green flex items-center justify-center md:justify-start gap-2">
               <span className="w-2 h-2 bg-retro-green rounded-full animate-pulse"></span>
               ONLINE // READY TO WATCH
            </p>
            <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
               <div className="bg-retro-primary/10 border border-retro-primary/50 px-4 py-2 rounded relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-2 h-2 bg-retro-primary animate-pulse"></div>
                  <p className="text-xs text-retro-primary font-mono mb-1">CREDITS AVAILABLE</p>
                  <p className="font-pixel text-2xl text-retro-primary">${user.credits}.00</p>
               </div>
               <div className="bg-white/5 border border-white/10 px-4 py-2 rounded">
                  <p className="text-xs text-gray-400 font-mono mb-1">WATCHED</p>
                  <p className="font-pixel text-2xl text-retro-secondary">0</p>
               </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
             <RetroButton variant="secondary" onClick={() => setIsEditing(!isEditing)}>
                 {isEditing ? 'CANCEL EDIT' : 'EDIT DETAILS'}
             </RetroButton>
          </div>
        </div>

        {/* Decorative BG */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-retro-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Tickets */}
        <div className="bg-[#16161e] border border-retro-purple/30 p-6 rounded-sm">
           <h3 className="font-pixel text-2xl text-retro-light mb-6 flex items-center gap-2">
             <TicketIcon className="text-retro-purple" /> RECENT BOOKINGS
           </h3>
           <div className="flex flex-col items-center justify-center py-8 text-gray-600 font-mono text-sm border-2 border-dashed border-gray-800">
               <Film size={32} className="mb-2 opacity-50"/>
               <p>NO ACTIVE BOOKINGS</p>
               <p className="text-xs mt-1">USE YOUR ${user.credits} CREDITS!</p>
           </div>
        </div>

        {/* Achievements */}
        <div className="bg-[#16161e] border border-retro-secondary/30 p-6 rounded-sm">
            <h3 className="font-pixel text-2xl text-retro-light mb-6 flex items-center gap-2">
             <Award className="text-retro-secondary" /> TROPHIES
           </h3>
           <div className="grid grid-cols-3 gap-4">
               <div className="aspect-square bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 p-2 text-center transition-colors cursor-help opacity-100">
                   <Zap className="text-retro-primary" size={32} />
                   <span className="text-[10px] font-mono leading-tight">NEWCOMER</span>
               </div>
               <div className="aspect-square bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 p-2 text-center opacity-30 grayscale">
                   <Star className="text-retro-accent" size={32} />
                   <span className="text-[10px] font-mono leading-tight">BIG SPENDER</span>
               </div>
               <div className="aspect-square bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 p-2 text-center opacity-30 grayscale">
                   <Award className="text-gray-400" size={32} />
                   <span className="text-[10px] font-mono leading-tight">COLLECTOR</span>
               </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

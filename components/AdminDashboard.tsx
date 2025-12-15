
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminView, User, Movie, Location, FoodItem } from '../types';
import { Film, Coffee, BarChart2, Calendar, MapPin, LogOut, Settings, Plus, ToggleRight, Edit3, User as UserIcon, MonitorPlay, Utensils, Trash2, X, Check, Upload, Grid } from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  movies: Movie[];
  locations: Location[];
  foodItems: FoodItem[];
  onAddMovie: (movie: Movie) => void;
  onUpdateMovie: (movie: Movie) => void;
  onDeleteMovie: (id: string) => void;
  onAddLocation: (location: Location) => void;
  onUpdateLocation: (location: Location) => void;
  onDeleteLocation: (id: string) => void;
  onAddFood: (item: FoodItem) => void;
  onUpdateFood: (item: FoodItem) => void;
  onDeleteFood: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    user, 
    onLogout,
    movies,
    locations,
    foodItems,
    onAddMovie,
    onUpdateMovie,
    onDeleteMovie,
    onAddLocation,
    onUpdateLocation,
    onDeleteLocation,
    onAddFood,
    onUpdateFood,
    onDeleteFood
}) => {
  const [view, setView] = useState<AdminView>(AdminView.STREAMING);
  
  // Modal State
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);

  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const foodFileInputRef = useRef<HTMLInputElement>(null);

  // Movie Form State
  const [movieFormData, setMovieFormData] = useState<Partial<Movie>>({
      title: '', tagline: '', description: '', rating: 'PG-13',
      duration: '1h 30m', genre: [], price: 12, image: '', showtimes: ['18:00'], locationIds: []
  });

  // Location Form State
  const [locationFormData, setLocationFormData] = useState<Partial<Location>>({
      name: '', address: '', coordinates: 'A-1', status: 'OPEN', capacity: 100
  });

  // Food Form State
  const [foodFormData, setFoodFormData] = useState<Partial<FoodItem>>({
      name: '', price: 5, description: '', image: '', tags: [], isOutOfStock: false
  });

  // --- MOVIE MODAL HANDLERS ---
  const handleOpenAddMovie = () => {
      setEditingMovie(null);
      setMovieFormData({
        title: '', tagline: '', description: '', rating: 'PG-13', duration: '1h 30m',
        genre: [], price: 12, image: 'https://picsum.photos/400/600?random=' + Math.floor(Math.random() * 100),
        showtimes: ['18:00'], locationIds: []
      });
      setIsMovieModalOpen(true);
  };

  const handleOpenEditMovie = (movie: Movie) => {
      setEditingMovie(movie);
      setMovieFormData(movie);
      setIsMovieModalOpen(true);
  };

  const handleMovieSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const genreArray = typeof movieFormData.genre === 'string' 
        ? (movieFormData.genre as string).split(',').map((g:string) => g.trim()) 
        : movieFormData.genre || ['Sci-Fi'];

      if (editingMovie) {
          onUpdateMovie({ ...editingMovie, ...movieFormData, genre: genreArray } as Movie);
      } else {
          const newMovie: Movie = {
              id: 'm' + Date.now(),
              ...movieFormData as Movie,
              genre: genreArray
          };
          onAddMovie(newMovie);
      }
      setIsMovieModalOpen(false);
  };

  // --- LOCATION MODAL HANDLERS ---
  const handleOpenAddLocation = () => {
      setEditingLocation(null);
      setLocationFormData({ name: '', address: '', coordinates: 'A-1', status: 'OPEN', capacity: 100 });
      setIsLocationModalOpen(true);
  };

  const handleOpenEditLocation = (loc: Location) => {
      setEditingLocation(loc);
      setLocationFormData(loc);
      setIsLocationModalOpen(true);
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingLocation) {
          onUpdateLocation({ ...editingLocation, ...locationFormData } as Location);
      } else {
          const newLoc: Location = {
              id: 'l' + Date.now(),
              ...locationFormData as Location
          };
          onAddLocation(newLoc);
      }
      setIsLocationModalOpen(false);
  };

  // --- FOOD MODAL HANDLERS ---
  const handleOpenAddFood = () => {
      setEditingFood(null);
      setFoodFormData({ name: '', price: 5, description: '', image: '', tags: [], isOutOfStock: false });
      setIsFoodModalOpen(true);
  };

  const handleOpenEditFood = (item: FoodItem) => {
      setEditingFood(item);
      setFoodFormData(item);
      setIsFoodModalOpen(true);
  };

  const handleFoodSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const tagArray = typeof foodFormData.tags === 'string'
        ? (foodFormData.tags as string).split(',').map((t: string) => t.trim().toUpperCase())
        : foodFormData.tags || [];

      if (editingFood) {
          onUpdateFood({ ...editingFood, ...foodFormData, tags: tagArray } as FoodItem);
      } else {
          const newFood: FoodItem = {
              id: 'f' + Date.now(),
              ...foodFormData as FoodItem,
              tags: tagArray
          };
          onAddFood(newFood);
      }
      setIsFoodModalOpen(false);
  };

  // --- FORM HELPERS ---
  const handleMovieChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setMovieFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setLocationFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFoodChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFoodFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleLocationForMovie = (locationId: string) => {
      const currentIds = movieFormData.locationIds || [];
      if (currentIds.includes(locationId)) {
          setMovieFormData(prev => ({ ...prev, locationIds: currentIds.filter(id => id !== locationId) }));
      } else {
          setMovieFormData(prev => ({ ...prev, locationIds: [...currentIds, locationId] }));
      }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'MOVIE' | 'FOOD') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'MOVIE') {
            setMovieFormData(prev => ({ ...prev, image: reader.result as string }));
        } else {
            setFoodFormData(prev => ({ ...prev, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Define neon colors per section
  const getThemeColor = (currentView: AdminView) => {
    switch(currentView) {
        case AdminView.STREAMING: return 'text-retro-primary border-retro-primary'; // Yellow
        case AdminView.CANTEEN: return 'text-retro-accent border-retro-accent'; // Pink/Red
        case AdminView.INSIGHTS: return 'text-retro-green border-retro-green'; // Green
        case AdminView.CALENDAR_EDIT: return 'text-retro-purple border-retro-purple'; // Purple
        case AdminView.LOCATIONS: return 'text-[#00f5d4] border-[#00f5d4]'; // Cyan
        default: return 'text-retro-primary border-retro-primary';
    }
  };

  const menuItems = [
    { id: AdminView.STREAMING, label: 'Now Streaming', icon: MonitorPlay },
    { id: AdminView.LOCATIONS, label: 'Location Management', icon: MapPin },
    { id: AdminView.CANTEEN, label: 'Food and Beverages', icon: Utensils },
    { id: AdminView.CALENDAR_EDIT, label: 'Calendar Control', icon: Calendar },
    { id: AdminView.INSIGHTS, label: 'Insight Viewer', icon: BarChart2 },
  ];

  const activeThemeClass = getThemeColor(view);
  const activeColor = activeThemeClass.split(' ')[0];

  // Helper for Map Grid
  const renderMapGrid = () => {
    const rows = ['A', 'B', 'C', 'D', 'E'];
    const cols = [1, 2, 3, 4, 5];
    return (
        <div className="grid grid-cols-5 gap-1 bg-black/50 p-2 border border-gray-700">
            {rows.map(row => 
                cols.map(col => {
                    const coord = `${row}-${col}`;
                    const isSelected = locationFormData.coordinates === coord;
                    return (
                        <button
                            key={coord}
                            type="button"
                            onClick={() => setLocationFormData(prev => ({ ...prev, coordinates: coord }))}
                            className={`
                                aspect-square flex items-center justify-center text-[10px] font-mono border
                                ${isSelected 
                                    ? 'bg-[#00f5d4] text-black border-[#00f5d4] font-bold' 
                                    : 'bg-transparent text-gray-500 border-gray-800 hover:border-[#00f5d4]/50 hover:text-[#00f5d4]'
                                }
                            `}
                        >
                            {coord}
                        </button>
                    );
                })
            )}
        </div>
    );
  };

  return (
    <div className="flex h-screen bg-retro-dark text-retro-light font-mono overflow-hidden selection:bg-white/20 relative">
      
      {/* VERTICAL SIDEBAR */}
      <aside className="w-72 bg-[#0f0e17] border-r border-gray-800 flex flex-col relative z-20 shrink-0 shadow-2xl">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-800 bg-[#121218]">
            <div className="flex items-center gap-3 group cursor-pointer">
                <div className={`p-2 rounded-sm border-2 ${activeThemeClass} group-hover:rotate-12 transition-transform bg-retro-dark`}>
                    <Settings className={activeColor} size={24} />
                </div>
                <div className="flex flex-col">
                    <h1 className="font-pixel text-2xl leading-none text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400">
                        ADMIN
                    </h1>
                    <span className={`text-[10px] tracking-widest uppercase ${activeColor}`}>
                        CONSOLE
                    </span>
                </div>
            </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
             {menuItems.map(item => {
                 const isActive = view === item.id;
                 const itemColorClass = getThemeColor(item.id).split(' ')[0];
                 const itemBorderClass = getThemeColor(item.id).split(' ')[1];
                 
                 return (
                    <button 
                        key={item.id}
                        onClick={() => setView(item.id)}
                        className={`
                            w-full flex items-center gap-4 px-4 py-3 text-xs font-bold uppercase tracking-widest border-l-4 transition-all duration-300 group
                            ${isActive 
                                ? `bg-[#1a1a24] ${itemBorderClass.replace('border-', 'border-l-')} text-white shadow-[inset_10px_0_20px_-10px_rgba(0,0,0,0.5)]` 
                                : 'border-transparent text-gray-500 hover:bg-[#16161e] hover:text-gray-300'
                            }
                        `}
                    >
                        <item.icon 
                            size={18} 
                            className={`transition-colors ${isActive ? itemColorClass : 'group-hover:text-gray-300'}`} 
                        />
                        <span className={isActive ? 'text-white' : ''}>{item.label}</span>
                    </button>
                 )
             })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-gray-800 bg-[#0d0c13]">
            <div className="flex items-center gap-3 mb-4 px-2 bg-white/5 p-3 rounded-md border border-white/5">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-600">
                    <UserIcon size={16} />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-xs font-bold text-white truncate" title={user.username}>{user.username}</span>
                        <span className="text-[9px] text-green-500 font-bold tracking-wider">● ONLINE</span>
                    </div>
            </div>
            <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white p-2 text-xs uppercase font-bold transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
            >
                <LogOut size={14} /> Disconnect
            </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative bg-[#12121a] custom-scrollbar">
        {/* Top Gradient Bar */}
        <div className={`h-1 w-full bg-gradient-to-r from-transparent via-${activeColor.replace('text-', '')} to-transparent opacity-50`}></div>
        
        <div className="p-8 pb-20 max-w-7xl mx-auto min-h-full">
            <motion.div
                key={view}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
            >
                {/* 1. NOW STREAMING */}
                {view === AdminView.STREAMING && (
                    <div className="space-y-8">
                        <div className="flex justify-between items-end border-b border-retro-primary/30 pb-6 mb-8">
                            <div>
                                <h2 className="font-pixel text-5xl text-retro-primary mb-2 tracking-wide">NOW STREAMING</h2>
                                <p className="text-gray-400 text-sm font-mono flex items-center gap-2">
                                    <span className="w-2 h-2 bg-retro-primary rounded-full animate-pulse"></span>
                                    Manage movies and their location availability.
                                </p>
                            </div>
                            <button 
                                onClick={handleOpenAddMovie}
                                className="flex items-center gap-2 bg-retro-primary text-retro-dark px-6 py-3 font-pixel text-sm hover:bg-white transition-colors shadow-[4px_4px_0px_rgba(255,255,255,0.1)]"
                            >
                                <Plus size={16} /> ADD MOVIE
                            </button>
                        </div>

                        <div className="grid gap-4">
                            {movies.map((movie) => (
                                <div key={movie.id} className="bg-[#16161e] border border-gray-800 p-4 flex items-center justify-between group hover:border-retro-primary transition-all shadow-lg hover:shadow-retro-primary/10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-24 overflow-hidden relative border border-gray-700 bg-black">
                                            <img src={movie.image} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-xl font-pixel tracking-wide">{movie.title}</h3>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1 font-mono">
                                                <span>{movie.rating}</span>
                                                <span>•</span>
                                                <span>{movie.duration}</span>
                                                <span>•</span>
                                                <span className="text-retro-primary">${movie.price}</span>
                                            </div>
                                            
                                            {/* Showing Location Info */}
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {movie.locationIds && movie.locationIds.length > 0 ? (
                                                    movie.locationIds.map(locId => {
                                                        const loc = locations.find(l => l.id === locId);
                                                        return loc ? (
                                                            <span key={locId} className="flex items-center gap-1 text-[9px] bg-[#00f5d4]/10 text-[#00f5d4] px-1.5 py-0.5 rounded border border-[#00f5d4]/30">
                                                                <MapPin size={10} /> {loc.name}
                                                            </span>
                                                        ) : null;
                                                    })
                                                ) : (
                                                    <span className="text-[9px] text-red-500 flex items-center gap-1 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/30">
                                                        NO LOCATION ASSIGNED
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex gap-2 mt-2">
                                                {movie.genre.map(g => (
                                                    <span key={g} className="text-[10px] uppercase tracking-wider border border-gray-700 px-2 py-0.5 text-gray-400 rounded-sm">{g}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="flex gap-2 border-l border-gray-700 pl-6 ml-2">
                                            <button 
                                                onClick={() => handleOpenEditMovie(movie)}
                                                className="flex flex-col items-center gap-1 text-gray-500 hover:text-white p-2 hover:bg-white/5 rounded transition-colors"
                                            >
                                                <Edit3 size={18} />
                                                <span className="text-[9px] font-bold">EDIT</span>
                                            </button>
                                            <button 
                                                onClick={() => onDeleteMovie(movie.id)}
                                                className="flex flex-col items-center gap-1 text-gray-500 hover:text-red-500 p-2 hover:bg-red-500/10 rounded transition-colors"
                                            >
                                                <Trash2 size={18} />
                                                <span className="text-[9px] font-bold">DELETE</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 5. LOCATION MANAGEMENT (Updated with CRUD) */}
                {view === AdminView.LOCATIONS && (
                    <div className="space-y-8">
                        <div className="flex justify-between items-end border-b border-[#00f5d4]/30 pb-6 mb-8">
                            <div>
                                <h2 className="font-pixel text-5xl text-[#00f5d4] mb-2 tracking-wide">LOCATION MANAGEMENT</h2>
                                <p className="text-gray-400 text-sm font-mono">Manage theater physical assets, coordinates and maintenance status.</p>
                            </div>
                            <button 
                                onClick={handleOpenAddLocation}
                                className="flex items-center gap-2 bg-[#00f5d4] text-black px-6 py-3 font-pixel text-sm hover:bg-white transition-colors shadow-[4px_4px_0px_rgba(255,255,255,0.1)]"
                            >
                                <Plus size={16} /> NEW SECTOR
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                             {locations.map((loc) => (
                                 <div key={loc.id} className="bg-[#16161e] border border-gray-800 p-6 hover:border-[#00f5d4] group transition-all flex flex-col justify-between h-auto min-h-[16rem] shadow-lg hover:shadow-[#00f5d4]/20 relative overflow-hidden">
                                     <div>
                                         <div className="flex justify-between items-start mb-6">
                                             <div className="bg-[#00f5d4]/10 p-3 rounded-full text-[#00f5d4] group-hover:scale-110 transition-transform border border-[#00f5d4]/20">
                                                 <MapPin size={24} />
                                             </div>
                                             <span className={`px-3 py-1 text-[10px] font-bold border rounded-full uppercase tracking-wider ${loc.status === 'OPEN' ? 'text-green-500 border-green-500 bg-green-500/5' : loc.status === 'CLOSED' ? 'text-red-500 border-red-500 bg-red-500/5' : 'text-yellow-500 border-yellow-500 bg-yellow-500/5'}`}>
                                                 {loc.status}
                                             </span>
                                         </div>
                                         <h3 className="font-bold text-xl text-white mb-1 group-hover:text-[#00f5d4] transition-colors">{loc.name}</h3>
                                         <p className="text-sm text-gray-500">{loc.address}</p>
                                         <p className="text-xs text-[#00f5d4] mt-1 font-mono">COORD: {loc.coordinates}</p>
                                     </div>
                                     
                                     <div className="space-y-4 mt-6">
                                         <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                             <div className={`h-full bg-[#00f5d4]`} style={{ width: `${loc.capacity}%` }}></div>
                                         </div>
                                         <div className="flex justify-between text-[10px] text-gray-500 uppercase font-bold">
                                             <span>Capacity Load</span>
                                             <span>{loc.capacity}%</span>
                                         </div>
                                         <div className="flex gap-2 pt-4 border-t border-gray-800">
                                             <button 
                                                onClick={() => handleOpenEditLocation(loc)}
                                                className="flex-1 py-2 text-[10px] font-bold uppercase bg-gray-800 hover:bg-[#00f5d4] hover:text-black transition-colors rounded-sm flex items-center justify-center gap-1"
                                             >
                                                <Edit3 size={12} /> Edit
                                             </button>
                                             <button 
                                                onClick={() => onDeleteLocation(loc.id)}
                                                className="flex-1 py-2 text-[10px] font-bold uppercase bg-gray-800 hover:bg-red-500 hover:text-white transition-colors rounded-sm flex items-center justify-center gap-1"
                                             >
                                                <Trash2 size={12} /> Delete
                                             </button>
                                         </div>
                                     </div>
                                 </div>
                             ))}
                        </div>
                    </div>
                )}

                {/* 2. CANTEEN MANAGEMENT */}
                {view === AdminView.CANTEEN && (
                    <div className="space-y-8">
                         <div className="flex justify-between items-end border-b border-retro-accent/30 pb-6 mb-8">
                            <div>
                                <h2 className="font-pixel text-5xl text-retro-accent mb-2 tracking-wide">FOOD & BEVERAGES</h2>
                                <p className="text-gray-400 text-sm font-mono">Inventory control for snacks, drinks and consumables.</p>
                            </div>
                            <button 
                                onClick={handleOpenAddFood}
                                className="flex items-center gap-2 bg-retro-accent text-white px-6 py-3 font-pixel text-sm hover:bg-white hover:text-retro-dark transition-colors shadow-[4px_4px_0px_rgba(255,255,255,0.1)]"
                            >
                                <Plus size={16} /> NEW ITEM
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {foodItems.map((item) => (
                                <div key={item.id} className="bg-[#16161e] border border-gray-800 p-4 group hover:border-retro-accent transition-all relative overflow-hidden flex flex-col">
                                    <div className="relative h-40 bg-black border border-gray-700 mb-4 overflow-hidden">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-700">
                                                <Utensils size={40} />
                                            </div>
                                        )}
                                        {item.isOutOfStock && (
                                            <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 font-bold uppercase">Out of Stock</div>
                                        )}
                                        <div className="absolute bottom-2 right-2 bg-retro-dark/80 text-retro-accent px-2 py-0.5 font-pixel text-lg">
                                            ${item.price}
                                        </div>
                                    </div>
                                    
                                    <h3 className="font-pixel text-xl text-white mb-2">{item.name}</h3>
                                    <p className="font-mono text-xs text-gray-500 mb-4 flex-1">{item.description}</p>
                                    
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {item.tags.map(t => (
                                            <span key={t} className="text-[9px] border border-retro-accent/30 text-retro-accent/70 px-1 rounded">{t}</span>
                                        ))}
                                    </div>

                                    <div className="flex gap-2 pt-4 border-t border-gray-800 mt-auto">
                                        <button 
                                            onClick={() => handleOpenEditFood(item)}
                                            className="flex-1 py-2 text-[10px] font-bold uppercase bg-gray-800 hover:bg-retro-accent hover:text-white transition-colors rounded-sm flex items-center justify-center gap-1"
                                        >
                                            <Edit3 size={12} /> Edit
                                        </button>
                                        <button 
                                            onClick={() => onDeleteFood(item.id)}
                                            className="flex-1 py-2 text-[10px] font-bold uppercase bg-gray-800 hover:bg-red-500 hover:text-white transition-colors rounded-sm flex items-center justify-center gap-1"
                                        >
                                            <Trash2 size={12} /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {view === AdminView.INSIGHTS && (
                    <div className="flex items-center justify-center h-full text-gray-500 font-pixel text-xl">
                        [ INSIGHTS MODULE UNCHANGED ]
                    </div>
                )}
                {view === AdminView.CALENDAR_EDIT && (
                    <div className="flex items-center justify-center h-full text-gray-500 font-pixel text-xl">
                        [ CALENDAR MODULE UNCHANGED ]
                    </div>
                )}

            </motion.div>
        </div>
      </main>

      {/* --- MOVIE MODAL --- */}
      <AnimatePresence>
        {isMovieModalOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                onClick={() => setIsMovieModalOpen(false)}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-retro-dark border-4 border-retro-primary w-full max-w-2xl relative shadow-[0_0_50px_rgba(255,208,0,0.2)]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="bg-retro-primary text-retro-dark font-pixel text-xl p-3 flex justify-between items-center">
                        <span>{editingMovie ? 'EDIT_PROTOCOL_V2' : 'INIT_NEW_ENTRY'}</span>
                        <button onClick={() => setIsMovieModalOpen(false)}><X size={24} /></button>
                    </div>

                    <form onSubmit={handleMovieSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 font-mono uppercase">Title</label>
                                <input name="title" value={movieFormData.title} onChange={handleMovieChange} className="w-full bg-[#16161e] border border-gray-700 p-2 text-white font-mono focus:border-retro-primary outline-none" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 font-mono uppercase">Price ($)</label>
                                <input name="price" type="number" value={movieFormData.price} onChange={handleMovieChange} className="w-full bg-[#16161e] border border-gray-700 p-2 text-white font-mono focus:border-retro-primary outline-none" required />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs text-gray-500 font-mono uppercase">Tagline</label>
                                <input name="tagline" value={movieFormData.tagline} onChange={handleMovieChange} className="w-full bg-[#16161e] border border-gray-700 p-2 text-white font-mono focus:border-retro-primary outline-none" />
                            </div>
                            
                            {/* --- LOCATION SELECTION --- */}
                            <div className="space-y-2 md:col-span-2 border border-retro-primary/30 p-4 bg-retro-primary/5">
                                <label className="text-xs text-retro-primary font-mono uppercase font-bold flex items-center gap-2">
                                    <MapPin size={12} /> Assign Locations
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                                    {locations.map(loc => (
                                        <div 
                                            key={loc.id} 
                                            onClick={() => toggleLocationForMovie(loc.id)}
                                            className={`
                                                cursor-pointer flex items-center gap-2 p-2 border text-xs transition-colors
                                                ${movieFormData.locationIds?.includes(loc.id) 
                                                    ? 'bg-retro-primary text-retro-dark border-retro-primary' 
                                                    : 'bg-transparent text-gray-400 border-gray-700 hover:border-retro-primary/50'
                                                }
                                            `}
                                        >
                                            <div className={`w-3 h-3 border flex items-center justify-center ${movieFormData.locationIds?.includes(loc.id) ? 'border-retro-dark bg-retro-dark' : 'border-gray-500'}`}>
                                                {movieFormData.locationIds?.includes(loc.id) && <Check size={10} className="text-retro-primary" />}
                                            </div>
                                            {loc.name}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs text-gray-500 font-mono uppercase">Description</label>
                                <textarea name="description" value={movieFormData.description} onChange={handleMovieChange} rows={3} className="w-full bg-[#16161e] border border-gray-700 p-2 text-white font-mono focus:border-retro-primary outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 font-mono uppercase">Rating</label>
                                <select name="rating" value={movieFormData.rating} onChange={handleMovieChange} className="w-full bg-[#16161e] border border-gray-700 p-2 text-white font-mono focus:border-retro-primary outline-none">
                                    <option value="G">G</option>
                                    <option value="PG">PG</option>
                                    <option value="PG-13">PG-13</option>
                                    <option value="R">R</option>
                                    <option value="NC-17">NC-17</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 font-mono uppercase">Duration</label>
                                <input name="duration" value={movieFormData.duration} onChange={handleMovieChange} placeholder="1h 30m" className="w-full bg-[#16161e] border border-gray-700 p-2 text-white font-mono focus:border-retro-primary outline-none" />
                            </div>
                             <div className="space-y-2 md:col-span-2">
                                <label className="text-xs text-gray-500 font-mono uppercase">Genres (Comma separated)</label>
                                <input name="genre" value={Array.isArray(movieFormData.genre) ? movieFormData.genre.join(', ') : movieFormData.genre} onChange={(e) => setMovieFormData({...movieFormData, genre: e.target.value as any})} className="w-full bg-[#16161e] border border-gray-700 p-2 text-white font-mono focus:border-retro-primary outline-none" />
                            </div>
                             <div className="space-y-2 md:col-span-2">
                                <label className="text-xs text-gray-500 font-mono uppercase">Image URL</label>
                                <div className="flex gap-2">
                                    <input name="image" value={movieFormData.image} onChange={handleMovieChange} className="w-full bg-[#16161e] border border-gray-700 p-2 text-white font-mono focus:border-retro-primary outline-none" />
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'MOVIE')} />
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-gray-700 text-white p-2 border border-gray-600 hover:bg-gray-600 transition-colors">
                                        <Upload size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-gray-700">
                            <button type="button" onClick={() => setIsMovieModalOpen(false)} className="flex-1 py-3 bg-transparent border-2 border-gray-600 text-gray-400 font-pixel text-lg hover:text-white hover:border-white transition-colors">CANCEL</button>
                            <button type="submit" className="flex-1 py-3 bg-retro-primary text-retro-dark font-pixel text-lg hover:bg-white transition-colors flex items-center justify-center gap-2"><Check size={20} /> {editingMovie ? 'SAVE CHANGES' : 'CREATE ENTRY'}</button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* --- LOCATION MODAL --- */}
      <AnimatePresence>
        {isLocationModalOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                onClick={() => setIsLocationModalOpen(false)}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-retro-dark border-4 border-[#00f5d4] w-full max-w-lg relative shadow-[0_0_50px_rgba(0,245,212,0.2)]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="bg-[#00f5d4] text-retro-dark font-pixel text-xl p-3 flex justify-between items-center">
                        <span>{editingLocation ? 'MODIFY_SECTOR' : 'INIT_NEW_SECTOR'}</span>
                        <button onClick={() => setIsLocationModalOpen(false)}><X size={24} /></button>
                    </div>

                    <form onSubmit={handleLocationSubmit} className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 font-mono uppercase">Sector Name</label>
                            <input name="name" value={locationFormData.name} onChange={handleLocationChange} className="w-full bg-[#16161e] border border-gray-700 p-2 text-white font-mono focus:border-[#00f5d4] outline-none" required />
                        </div>
                         <div className="space-y-2">
                            <label className="text-xs text-gray-500 font-mono uppercase">Address / System</label>
                            <input name="address" value={locationFormData.address} onChange={handleLocationChange} className="w-full bg-[#16161e] border border-gray-700 p-2 text-white font-mono focus:border-[#00f5d4] outline-none" required />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 font-mono uppercase">Status</label>
                                <select name="status" value={locationFormData.status} onChange={handleLocationChange} className="w-full bg-[#16161e] border border-gray-700 p-2 text-white font-mono focus:border-[#00f5d4] outline-none">
                                    <option value="OPEN">OPEN</option>
                                    <option value="MAINTENANCE">MAINTENANCE</option>
                                    <option value="CLOSED">CLOSED</option>
                                </select>
                            </div>
                             <div className="space-y-2">
                                <label className="text-xs text-gray-500 font-mono uppercase">Current Load (%)</label>
                                <input name="capacity" type="number" min="0" max="100" value={locationFormData.capacity} onChange={handleLocationChange} className="w-full bg-[#16161e] border border-gray-700 p-2 text-white font-mono focus:border-[#00f5d4] outline-none" />
                            </div>
                        </div>

                        {/* MAP SELECTOR */}
                        <div className="space-y-2">
                             <label className="text-xs text-[#00f5d4] font-mono uppercase font-bold flex items-center gap-2">
                                <Grid size={12} /> Sector Map (Select Grid)
                             </label>
                             <div className="flex gap-4">
                                <div className="flex-1">
                                    {renderMapGrid()}
                                </div>
                                <div className="w-24 flex flex-col items-center justify-center border border-gray-700 bg-black/30 p-2 text-center">
                                    <span className="text-[10px] text-gray-500 uppercase">Selected</span>
                                    <span className="font-pixel text-2xl text-[#00f5d4]">{locationFormData.coordinates}</span>
                                </div>
                             </div>
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-gray-700">
                            <button type="button" onClick={() => setIsLocationModalOpen(false)} className="flex-1 py-3 bg-transparent border-2 border-gray-600 text-gray-400 font-pixel text-lg hover:text-white hover:border-white transition-colors">CANCEL</button>
                            <button type="submit" className="flex-1 py-3 bg-[#00f5d4] text-black font-pixel text-lg hover:bg-white transition-colors flex items-center justify-center gap-2"><Check size={20} /> {editingLocation ? 'UPDATE' : 'DEPLOY'}</button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* --- FOOD MODAL --- */}
      <AnimatePresence>
        {isFoodModalOpen && (
             <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                onClick={() => setIsFoodModalOpen(false)}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-retro-dark border-4 border-retro-accent w-full max-w-lg relative shadow-[0_0_50px_rgba(242,95,76,0.2)]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="bg-retro-accent text-white font-pixel text-xl p-3 flex justify-between items-center">
                        <span>{editingFood ? 'EDIT_RATION' : 'ADD_SUPPLY'}</span>
                        <button onClick={() => setIsFoodModalOpen(false)}><X size={24} /></button>
                    </div>

                    <form onSubmit={handleFoodSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <label className="text-xs text-gray-500 font-mono uppercase">Item Name</label>
                                <input name="name" value={foodFormData.name} onChange={handleFoodChange} className="w-full bg-[#16161e] border border-gray-700 p-2 text-white font-mono focus:border-retro-accent outline-none" required />
                            </div>
                             <div className="space-y-2">
                                <label className="text-xs text-gray-500 font-mono uppercase">Price ($)</label>
                                <input name="price" type="number" value={foodFormData.price} onChange={handleFoodChange} className="w-full bg-[#16161e] border border-gray-700 p-2 text-white font-mono focus:border-retro-accent outline-none" required />
                            </div>
                             <div className="space-y-2">
                                <label className="text-xs text-gray-500 font-mono uppercase">Tags (comma sep)</label>
                                <input name="tags" value={Array.isArray(foodFormData.tags) ? foodFormData.tags.join(', ') : foodFormData.tags} onChange={(e) => setFoodFormData({...foodFormData, tags: e.target.value as any})} className="w-full bg-[#16161e] border border-gray-700 p-2 text-white font-mono focus:border-retro-accent outline-none" />
                            </div>
                        </div>

                         <div className="space-y-2">
                            <label className="text-xs text-gray-500 font-mono uppercase">Description</label>
                            <textarea name="description" rows={2} value={foodFormData.description} onChange={handleFoodChange} className="w-full bg-[#16161e] border border-gray-700 p-2 text-white font-mono focus:border-retro-accent outline-none" />
                        </div>

                         <div className="space-y-2">
                            <label className="text-xs text-gray-500 font-mono uppercase">Image URL</label>
                            <div className="flex gap-2">
                                <input name="image" value={foodFormData.image} onChange={handleFoodChange} className="w-full bg-[#16161e] border border-gray-700 p-2 text-white font-mono focus:border-retro-accent outline-none" />
                                <input type="file" ref={foodFileInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'FOOD')} />
                                <button type="button" onClick={() => foodFileInputRef.current?.click()} className="bg-gray-700 text-white p-2 border border-gray-600 hover:bg-gray-600 transition-colors">
                                    <Upload size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                             <input type="checkbox" checked={foodFormData.isOutOfStock} onChange={(e) => setFoodFormData({...foodFormData, isOutOfStock: e.target.checked})} className="w-4 h-4 accent-retro-accent" />
                             <label className="text-xs text-gray-400 font-mono uppercase">Mark as Out of Stock</label>
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-gray-700">
                            <button type="button" onClick={() => setIsFoodModalOpen(false)} className="flex-1 py-3 bg-transparent border-2 border-gray-600 text-gray-400 font-pixel text-lg hover:text-white hover:border-white transition-colors">CANCEL</button>
                            <button type="submit" className="flex-1 py-3 bg-retro-accent text-white font-pixel text-lg hover:bg-white hover:text-retro-dark transition-colors flex items-center justify-center gap-2"><Check size={20} /> {editingFood ? 'UPDATE' : 'ADD'}</button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

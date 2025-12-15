
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Ticket as TicketIcon, Zap, Calendar, User as UserIcon, LogOut, MapPin, Pizza, MessageSquare, ChevronDown, Loader } from 'lucide-react';
import { Movie, BookingStep, Ticket, User, Location, FoodItem } from './types';
import { TicketCard } from './components/TicketCard';
import { SeatSelector } from './components/SeatSelector';
import { FinalTicket } from './components/FinalTicket';
import { ProfilePage } from './components/ProfilePage';
import { CalendarPage } from './components/CalendarPage';
import { FoodPage } from './components/FoodPage';
import { ReviewPage } from './components/ReviewPage';
import { AuthPage } from './components/AuthPage';
import { AdminDashboard } from './components/AdminDashboard';
import { db } from './db';

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [step, setStep] = useState<BookingStep>(BookingStep.BROWSING);
  const [loading, setLoading] = useState(true);
  
  // App State (Lifted for CRUD and Filtering)
  const [movies, setMovies] = useState<Movie[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  
  // User Selection State
  const [selectedLocationId, setSelectedLocationId] = useState<string>(''); 
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [ticket, setTicket] = useState<Ticket | null>(null);

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    const loadData = async () => {
        setLoading(true);
        const [loadedMovies, loadedLocations, loadedFood] = await Promise.all([
            db.movies.getAll(),
            db.locations.getAll(),
            db.food.getAll()
        ]);
        
        setMovies(loadedMovies);
        setLocations(loadedLocations);
        setFoodItems(loadedFood);
        
        if (loadedLocations.length > 0) {
            setSelectedLocationId(loadedLocations[0].id);
        }
        setLoading(false);
    };
    loadData();
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setStep(BookingStep.BROWSING);
  };

  const handleUpdateUser = async (updates: Partial<User>) => {
    if (user) {
        const updatedUser = { ...user, ...updates };
        await db.auth.updateUser(updatedUser);
        setUser(updatedUser);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setStep(BookingStep.BROWSING);
    setSelectedMovie(null);
    setTicket(null);
  };

  // --- CRUD Handlers (Async) ---

  // Movies
  const handleAddMovie = async (movie: Movie) => {
    const updated = await db.movies.add(movie);
    setMovies(updated);
  };

  const handleUpdateMovie = async (updatedMovie: Movie) => {
    const updated = await db.movies.update(updatedMovie);
    setMovies(updated);
  };

  const handleDeleteMovie = async (id: string) => {
    const updated = await db.movies.delete(id);
    setMovies(updated);
  };

  // Locations
  const handleAddLocation = async (location: Location) => {
    const updated = await db.locations.add(location);
    setLocations(updated);
  };

  const handleUpdateLocation = async (updatedLocation: Location) => {
    const updated = await db.locations.update(updatedLocation);
    setLocations(updated);
  };

  const handleDeleteLocation = async (id: string) => {
    const updated = await db.locations.delete(id);
    setLocations(updated);
  };

  // Food Items
  const handleAddFood = async (item: FoodItem) => {
      const updated = await db.food.add(item);
      setFoodItems(updated);
  };

  const handleUpdateFood = async (updatedItem: FoodItem) => {
      const updated = await db.food.update(updatedItem);
      setFoodItems(updated);
  };

  const handleDeleteFood = async (id: string) => {
      const updated = await db.food.delete(id);
      setFoodItems(updated);
  };

  // --- Booking Flow ---

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
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

  // Filter movies based on selected location
  const displayedMovies = movies.filter(movie => 
    movie.locationIds && movie.locationIds.includes(selectedLocationId)
  );

  const selectedLocationName = locations.find(l => l.id === selectedLocationId)?.name || 'Unknown Sector';

  if (!user) {
      return <AuthPage onLogin={handleLogin} />;
  }

  if (loading) {
      return (
          <div className="min-h-screen bg-retro-dark flex items-center justify-center flex-col gap-4">
              <div className="w-16 h-16 border-4 border-retro-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="font-pixel text-retro-primary animate-pulse">CONNECTING TO DATABASE...</p>
          </div>
      )
  }

  // Admin View
  if (user.isAdmin) {
      return (
        <AdminDashboard 
            user={user} 
            onLogout={handleLogout}
            movies={movies}
            locations={locations}
            foodItems={foodItems}
            onAddMovie={handleAddMovie}
            onUpdateMovie={handleUpdateMovie}
            onDeleteMovie={handleDeleteMovie}
            onAddLocation={handleAddLocation}
            onUpdateLocation={handleUpdateLocation}
            onDeleteLocation={handleDeleteLocation}
            onAddFood={handleAddFood}
            onUpdateFood={handleUpdateFood}
            onDeleteFood={handleDeleteFood}
        />
      );
  }

  // Regular User View
  return (
    <div className="min-h-screen bg-retro-dark text-retro-light font-mono selection:bg-retro-accent selection:text-white pb-20">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-retro-dark/90 backdrop-blur-md border-b border-retro-purple/30 mb-8">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
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
          
          <nav className="flex gap-4 md:gap-6 text-sm font-bold uppercase tracking-wider items-center flex-wrap justify-center">
             <button 
                onClick={() => setStep(BookingStep.BROWSING)}
                className={`flex items-center gap-1 hover:text-retro-primary transition-colors ${step === BookingStep.BROWSING ? 'text-retro-primary' : ''}`}
             >
                <Zap size={14} /> <span className="hidden sm:inline">Shows</span>
             </button>
             
             <button 
                onClick={() => setStep(BookingStep.FOOD)}
                className={`flex items-center gap-1 hover:text-retro-primary transition-colors ${step === BookingStep.FOOD ? 'text-retro-primary' : ''}`}
             >
                <Pizza size={14} /> <span className="hidden sm:inline">Snacks</span>
             </button>

             <button 
                onClick={() => setStep(BookingStep.REVIEWS)}
                className={`flex items-center gap-1 hover:text-retro-primary transition-colors ${step === BookingStep.REVIEWS ? 'text-retro-primary' : ''}`}
             >
                <MessageSquare size={14} /> <span className="hidden sm:inline">Reviews</span>
             </button>

             <button 
                onClick={() => setStep(BookingStep.CALENDAR)}
                className={`flex items-center gap-1 hover:text-retro-primary transition-colors ${step === BookingStep.CALENDAR ? 'text-retro-primary' : ''}`}
             >
                <Calendar size={14} /> <span className="hidden sm:inline">Calendar</span>
             </button>

             <div className="h-6 w-px bg-gray-700 hidden md:block"></div>

             <div className="flex items-center gap-4">
                 <button 
                    onClick={() => setStep(BookingStep.PROFILE)}
                    className={`flex items-center gap-2 hover:text-retro-primary transition-colors ${step === BookingStep.PROFILE ? 'text-retro-primary' : ''}`}
                 >
                    <div className="w-8 h-8 rounded-full bg-retro-purple/20 border border-retro-primary overflow-hidden">
                        {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover"/> : <UserIcon className="p-1" />}
                    </div>
                    <span className="hidden lg:inline">{user.username}</span>
                    <span className="text-retro-green text-xs bg-retro-green/10 px-1 rounded border border-retro-green/20">${user.credits}</span>
                 </button>

                 <button 
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                    title="Logout"
                 >
                    <LogOut size={18} />
                 </button>
             </div>
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
              <div className="flex flex-col items-center justify-center space-y-6 mb-16">
                  {/* Now Showing Box */}
                  <div className="border-4 border-blue-500 p-4 px-12 bg-retro-dark relative shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500"></div>
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500"></div>
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500"></div>
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500"></div>
                    
                    <h2 className="text-4xl md:text-6xl font-pixel text-white tracking-widest animate-pulse-fast text-center">NOW SHOWING</h2>
                  </div>

                  {/* LOCATION SELECTOR */}
                  <div className="relative w-full max-w-md group z-20">
                     <div className="absolute inset-0 bg-retro-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <div className="relative flex items-center bg-[#16161e] border-2 border-retro-primary/50 group-hover:border-retro-primary transition-colors">
                        <div className="p-3 text-retro-primary border-r border-retro-primary/30 bg-retro-primary/5">
                            <MapPin size={20} />
                        </div>
                        <select 
                            value={selectedLocationId}
                            onChange={(e) => setSelectedLocationId(e.target.value)}
                            className="w-full bg-transparent border-none focus:outline-none px-4 py-3 text-retro-light font-mono text-sm uppercase tracking-wider cursor-pointer appearance-none"
                        >
                            {locations.map(loc => (
                                <option key={loc.id} value={loc.id} className="bg-retro-dark">
                                    {loc.name} {loc.status !== 'OPEN' ? `[${loc.status}]` : ''}
                                </option>
                            ))}
                        </select>
                        <div className="p-3 text-gray-400 pointer-events-none">
                            <ChevronDown size={20} />
                        </div>
                     </div>
                  </div>

                  <p className="text-retro-green font-mono text-sm md:text-base max-w-lg mx-auto border-l-4 border-retro-green pl-4 text-left bg-retro-green/5 p-4 rounded-r-md">
                    // SYSTEM_MSG: Retrieving signals from {selectedLocationName}... 
                    <br/>// WARNING: Side effects may include popcorn craving and mild hallucinations.
                  </p>
              </div>

              {displayedMovies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {displayedMovies.map((movie) => (
                    <TicketCard key={movie.id} movie={movie} onSelect={handleSelectMovie} />
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 opacity-50">
                    <Zap size={64} className="text-gray-600 mb-4" />
                    <p className="font-pixel text-2xl text-gray-500">NO SIGNAL IN THIS SECTOR</p>
                    <p className="font-mono text-sm text-gray-600">Try selecting a different location.</p>
                </div>
              )}
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

          {step === BookingStep.PROFILE && user && (
             <ProfilePage key="profile" user={user} onUpdateUser={handleUpdateUser} />
          )}

          {step === BookingStep.CALENDAR && (
             <CalendarPage key="calendar" />
          )}

          {step === BookingStep.FOOD && (
             <FoodPage key="food" items={foodItems} />
          )}

          {step === BookingStep.REVIEWS && (
             <ReviewPage key="reviews" movies={movies} />
          )}

        </AnimatePresence>
      </main>

      {/* Retro Footer Decoration */}
      <footer className="fixed bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-retro-primary via-retro-accent to-retro-purple animate-pulse"></footer>
    </div>
  );
};

export default App;

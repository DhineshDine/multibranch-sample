
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, ThumbsUp, User, Search, Plus, X, Film, Calendar, Loader } from 'lucide-react';
import { Review, Movie } from '../types';
import { RetroButton } from './RetroButton';
import { db } from '../db';

interface ReviewPageProps {
  movies: Movie[];
}

// Simulated Global Database for "World Wide" search
const GLOBAL_ARCHIVE: Partial<Movie>[] = [
    { title: 'BLADE RUNNER', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=400', duration: '1h 57m', rating: 'R', genre: ['Sci-Fi', 'Noir'] },
    { title: 'THE MATRIX', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400', duration: '2h 16m', rating: 'R', genre: ['Sci-Fi', 'Action'] },
    { title: 'ALIEN', image: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&q=80&w=400', duration: '1h 57m', rating: 'R', genre: ['Horror', 'Sci-Fi'] },
    { title: 'TRON: LEGACY', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=400', duration: '2h 5m', rating: 'PG', genre: ['Sci-Fi', 'Action'] },
    { title: 'AKIRA', image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=400', duration: '2h 4m', rating: 'R', genre: ['Anime', 'Sci-Fi'] },
    { title: 'BACK TO THE FUTURE', image: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?auto=format&fit=crop&q=80&w=400', duration: '1h 56m', rating: 'PG', genre: ['Adventure', 'Sci-Fi'] },
    { title: 'DUNE', image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=400', duration: '2h 35m', rating: 'PG-13', genre: ['Sci-Fi', 'Adventure'] },
    { title: 'THE FIFTH ELEMENT', image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=400', duration: '2h 6m', rating: 'PG-13', genre: ['Action', 'Sci-Fi'] },
    { title: 'GHOST IN THE SHELL', image: 'https://images.unsplash.com/photo-1515634928627-2a4e0dae3ddf?auto=format&fit=crop&q=80&w=400', duration: '1h 23m', rating: 'NR', genre: ['Anime', 'Sci-Fi'] },
    { title: 'TERMINATOR 2', image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&q=80&w=400', duration: '2h 17m', rating: 'R', genre: ['Action', 'Sci-Fi'] },
    { title: 'TOTAL RECALL', image: 'https://images.unsplash.com/photo-1462332420958-a05d1e002413?auto=format&fit=crop&q=80&w=400', duration: '1h 53m', rating: 'R', genre: ['Action', 'Sci-Fi'] },
    { title: 'ROBOCOP', image: 'https://images.unsplash.com/photo-1535156434750-4248ff53ab06?auto=format&fit=crop&q=80&w=400', duration: '1h 42m', rating: 'R', genre: ['Action', 'Crime'] },
    { title: 'JURASSIC PARK', image: 'https://images.unsplash.com/photo-1550951298-5c7b95a66b21?auto=format&fit=crop&q=80&w=400', duration: '2h 7m', rating: 'PG-13', genre: ['Adventure', 'Sci-Fi'] },
    { title: 'INTERSTELLAR', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400', duration: '2h 49m', rating: 'PG-13', genre: ['Sci-Fi', 'Drama'] },
    { title: 'THE THING', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400', duration: '1h 49m', rating: 'R', genre: ['Horror', 'Sci-Fi'] }
];

export const ReviewPage: React.FC<ReviewPageProps> = ({ movies }) => {
  // DB State
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // View State
  const [listSearch, setListSearch] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<'SEARCH' | 'WRITE'>('SEARCH');
  const [modalSearch, setModalSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Partial<Movie>[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Partial<Movie> | null>(null);
  
  // Review Form State
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  // Load reviews on mount
  useEffect(() => {
    const fetchReviews = async () => {
        const data = await db.reviews.getAll();
        setReviews(data);
    };
    fetchReviews();
  }, []);

  // Search Logic for Modal
  useEffect(() => {
    if (!modalSearch.trim()) {
        setSearchResults([]);
        return;
    }

    setIsSearching(true);
    const delayDebounceFn = setTimeout(() => {
        const query = modalSearch.toLowerCase();
        
        // Filter local current movies
        const localMatches = movies.filter(m => m.title.toLowerCase().includes(query));
        
        // Filter global archive
        const globalMatches = GLOBAL_ARCHIVE.filter(m => 
            m.title?.toLowerCase().includes(query) && 
            !localMatches.some(local => local.title === m.title)
        );

        setSearchResults([...localMatches, ...globalMatches]);
        setIsSearching(false);
    }, 500); // Simulate network delay

    return () => clearTimeout(delayDebounceFn);
  }, [modalSearch, movies]);


  // Filtered reviews for list view (Main Page)
  const filteredReviews = reviews.filter(r => 
    r.movieTitle.toLowerCase().includes(listSearch.toLowerCase()) || 
    r.username.toLowerCase().includes(listSearch.toLowerCase())
  );

  const handleOpenModal = () => {
    setModalStep('SEARCH');
    setModalSearch('');
    setSearchResults([]);
    setSelectedMovie(null);
    setNewRating(0);
    setNewComment('');
    setIsModalOpen(true);
  };

  const handleSelectMovie = (movie: Partial<Movie>) => {
    setSelectedMovie(movie);
    setModalStep('WRITE');
  };

  const handleSubmitReview = async () => {
    if (!selectedMovie) return;

    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      movieId: selectedMovie.id || `ext-${Date.now()}`,
      movieTitle: selectedMovie.title || 'Unknown Title',
      movieImage: selectedMovie.image,
      username: 'CURRENT_USER', // In a real app, get from auth context
      rating: newRating,
      comment: newComment,
      date: 'JUST NOW',
      likes: 0
    };

    // Save to DB
    const updatedReviews = await db.reviews.add(newReview);
    setReviews(updatedReviews);
    setIsModalOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-6 border-b-4 border-retro-primary pb-6">
        <div>
            <h2 className="font-pixel text-4xl md:text-6xl text-retro-primary mb-2">TRANSMISSIONS</h2>
            <p className="font-mono text-gray-400 text-xs md:text-sm uppercase tracking-widest">
                Latest signals from the audience
            </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {/* Search Existing Reviews */}
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-retro-primary transition-colors" size={18} />
                <input 
                    type="text" 
                    placeholder="FILTER SIGNALS..." 
                    value={listSearch}
                    onChange={(e) => setListSearch(e.target.value)}
                    className="w-full md:w-64 bg-[#16161e] border border-gray-700 focus:border-retro-primary outline-none py-2 pl-10 pr-4 text-retro-light font-mono text-sm"
                />
            </div>
            
            <RetroButton onClick={handleOpenModal} className="flex items-center gap-2 justify-center shadow-[4px_4px_0_white]">
                <Plus size={18} /> LOG ENTRY
            </RetroButton>
        </div>
      </div>

      {/* Review Feed */}
      <div className="space-y-6">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <motion.div 
              key={review.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#16161e] p-6 border-l-4 border-retro-purple hover:bg-[#1c1c26] transition-colors relative group"
            >
              <div className="flex gap-6">
                  {/* Poster Thumbnail */}
                  <div className="hidden sm:block w-20 h-28 flex-shrink-0 bg-black border border-gray-800 shadow-lg">
                      {review.movieImage ? (
                          <img src={review.movieImage} alt={review.movieTitle} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-700"><Film /></div>
                      )}
                  </div>

                  <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-retro-purple/20 rounded-full flex items-center justify-center text-retro-purple border border-retro-purple/50">
                                  <User size={16} />
                              </div>
                              <div>
                                  <div className="flex items-center gap-2">
                                      <h4 className="font-bold text-white font-mono text-sm">{review.username}</h4>
                                      <span className="text-gray-600 text-[10px] font-mono">WATCHED</span>
                                  </div>
                                  <h3 className="text-retro-primary font-pixel text-xl leading-none">{review.movieTitle}</h3>
                              </div>
                          </div>
                          <span className="text-[10px] text-gray-600 font-mono border border-gray-800 px-2 py-1">{review.date}</span>
                      </div>

                      <div className="flex text-yellow-500 mb-3 gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-700"} />
                          ))}
                      </div>

                      <p className="font-mono text-gray-300 text-sm leading-relaxed mb-4">
                          "{review.comment}"
                      </p>

                      <div className="flex gap-4 border-t border-gray-800 pt-4">
                          <button className="flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-retro-primary transition-colors">
                              <ThumbsUp size={14} /> {review.likes} LIKES
                          </button>
                          <button className="flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors">
                              <MessageSquare size={14} /> REPLY
                          </button>
                      </div>
                  </div>
              </div>
            </motion.div>
          ))
        ) : (
            <div className="text-center py-20 opacity-50 font-mono">
                NO TRANSMISSIONS FOUND.
            </div>
        )}
      </div>

      {/* --- LOG REVIEW MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                onClick={() => setIsModalOpen(false)}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-retro-dark border-2 border-retro-light w-full max-w-xl relative shadow-[0_0_50px_rgba(255,255,255,0.1)] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className="bg-retro-light text-retro-dark font-pixel text-xl p-3 flex justify-between items-center">
                        <span>{modalStep === 'SEARCH' ? 'SELECT_TARGET' : 'LOG_TRANSMISSION'}</span>
                        <button onClick={() => setIsModalOpen(false)} className="hover:bg-retro-dark hover:text-retro-light p-1 transition-colors"><X size={24} /></button>
                    </div>

                    <div className="p-6 md:p-8 min-h-[400px] flex flex-col">
                        
                        {/* STEP 1: SEARCH MOVIE */}
                        {modalStep === 'SEARCH' && (
                            <div className="space-y-6 flex-1 flex flex-col">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                    <input 
                                        type="text" 
                                        autoFocus
                                        placeholder="Search global archive..." 
                                        value={modalSearch}
                                        onChange={(e) => setModalSearch(e.target.value)}
                                        className="w-full bg-[#16161e] border-2 border-gray-700 focus:border-retro-primary outline-none py-4 pl-12 pr-4 text-white font-mono text-lg transition-colors"
                                    />
                                    {isSearching && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                            <Loader className="animate-spin text-retro-primary" size={20} />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                                    {searchResults.map((movie, index) => (
                                        <button 
                                            key={movie.id || index}
                                            onClick={() => handleSelectMovie(movie)}
                                            className="w-full flex items-center gap-4 p-2 hover:bg-white/10 text-left transition-colors border border-transparent hover:border-retro-primary/30 group animate-fade-in"
                                        >
                                            <div className="w-12 h-16 bg-black border border-gray-700 flex-shrink-0">
                                                {movie.image ? (
                                                    <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-700"><Film size={20}/></div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-pixel text-xl text-retro-light group-hover:text-retro-primary truncate">{movie.title}</h4>
                                                <div className="flex gap-2 text-xs text-gray-500 font-mono">
                                                     {movie.duration && <span>{movie.duration.split(' ')[0]}</span>}
                                                     {movie.rating && <span>• {movie.rating}</span>}
                                                     {movie.genre && <span>• {movie.genre[0]}</span>}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                    
                                    {!modalSearch && (
                                        <div className="text-center text-gray-600 font-mono py-8 flex flex-col items-center">
                                            <Film size={32} className="mb-2 opacity-50"/>
                                            ACCESSING WORLD WIDE DATABASE...
                                            <span className="text-xs mt-2">TYPE TO SEARCH MILLIONS OF TITLES</span>
                                        </div>
                                    )}
                                    
                                    {modalSearch && !isSearching && searchResults.length === 0 && (
                                        <div className="text-center text-gray-500 font-mono py-8">
                                            TITLE NOT FOUND IN ARCHIVE.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* STEP 2: WRITE REVIEW */}
                        {modalStep === 'WRITE' && selectedMovie && (
                            <div className="flex flex-col gap-6 h-full">
                                <div className="flex gap-4 items-start bg-[#16161e] p-4 border border-gray-800">
                                    <div className="w-20 h-28 bg-black border border-gray-700 shadow-lg flex-shrink-0">
                                        {selectedMovie.image ? (
                                            <img src={selectedMovie.image} alt={selectedMovie.title} className="w-full h-full object-cover" />
                                        ) : (
                                             <div className="w-full h-full flex items-center justify-center text-gray-700"><Film /></div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-pixel text-2xl text-white leading-none mb-1">{selectedMovie.title}</h3>
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-[10px] border border-gray-700 px-1 text-gray-500">{selectedMovie.rating || 'NR'}</span>
                                            <span className="text-[10px] text-gray-500 font-mono">{new Date().toLocaleDateString()}</span>
                                        </div>
                                        <button 
                                            onClick={() => setModalStep('SEARCH')} 
                                            className="text-xs text-retro-primary hover:underline font-mono"
                                        >
                                            Change film
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-2 py-2">
                                    <span className="text-xs text-gray-500 font-mono uppercase tracking-widest">Rate this film</span>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                onClick={() => setNewRating(star)}
                                                className="focus:outline-none transition-transform hover:scale-110"
                                            >
                                                <Star 
                                                    size={32} 
                                                    className={`${(hoverRating || newRating) >= star ? 'text-retro-primary fill-retro-primary' : 'text-gray-700'}`}
                                                    strokeWidth={1.5}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-1 relative">
                                    <textarea 
                                        placeholder="Add a review..." 
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="w-full h-full bg-[#16161e] border-2 border-gray-700 focus:border-retro-primary outline-none p-4 text-white font-mono resize-none text-sm leading-relaxed"
                                    />
                                    <div className="absolute bottom-2 right-2">
                                        <Calendar size={16} className="text-gray-600 hover:text-white cursor-pointer" />
                                    </div>
                                </div>

                                <RetroButton 
                                    onClick={handleSubmitReview}
                                    disabled={newRating === 0}
                                    className={`w-full py-3 ${newRating === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    LOG ENTRY
                                </RetroButton>
                            </div>
                        )}

                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

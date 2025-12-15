
import { Movie, Location, FoodItem, User, Review, Ticket } from './types';
import { MOVIES, LOCATIONS, FOOD_ITEMS } from './constants';

const KEYS = {
  MOVIES: 'strange_shows_movies',
  LOCATIONS: 'strange_shows_locations',
  FOOD: 'strange_shows_food',
  USERS: 'strange_shows_users',
  REVIEWS: 'strange_shows_reviews',
  TICKETS: 'strange_shows_tickets',
};

// --- INITIAL SEEDING ---
const seedDatabase = () => {
  if (!localStorage.getItem(KEYS.MOVIES)) {
    localStorage.setItem(KEYS.MOVIES, JSON.stringify(MOVIES));
  }
  if (!localStorage.getItem(KEYS.LOCATIONS)) {
    localStorage.setItem(KEYS.LOCATIONS, JSON.stringify(LOCATIONS));
  }
  if (!localStorage.getItem(KEYS.FOOD)) {
    localStorage.setItem(KEYS.FOOD, JSON.stringify(FOOD_ITEMS));
  }
  
  // Seed Admin User if not exists
  const existingUsers = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
  const adminExists = existingUsers.find((u: User) => u.username === 'dine_15');
  
  if (!adminExists) {
    const adminUser: User = {
      username: 'dine_15', // Used for login check logic
      avatar: null,
      credits: 999999,
      level: 99,
      isAdmin: true,
      // We store the password hash or plain text here for simulation since it's local
      // In a real app, never store passwords like this.
    };
    localStorage.setItem(KEYS.USERS, JSON.stringify([...existingUsers, adminUser]));
  }

  if (!localStorage.getItem(KEYS.REVIEWS)) {
    const initialReviews: Review[] = [
        { id: '1', username: 'NeonDrifter88', rating: 5, movieId: 'm1', movieTitle: 'THE GOO FROM SECTOR 7', comment: 'Absolutely visceral. The texture of the goo was mind-blowing.', date: '2 HOURS AGO', likes: 24, movieImage: 'https://picsum.photos/400/600?random=1' },
        { id: '2', username: 'PixelQueen', rating: 4, movieId: 'm2', movieTitle: 'MIDNIGHT NEON DINER', comment: 'A bit slow in the second act, but the aesthetic is purely divine.', date: 'YESTERDAY', likes: 12, movieImage: 'https://picsum.photos/400/600?random=2' },
    ];
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(initialReviews));
  }
};

// Initialize DB immediately
seedDatabase();

// --- HELPER ---
const get = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const set = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- API ---

export const db = {
  movies: {
    getAll: async (): Promise<Movie[]> => get<Movie>(KEYS.MOVIES),
    add: async (item: Movie) => {
      const items = get<Movie>(KEYS.MOVIES);
      const newItems = [...items, item];
      set(KEYS.MOVIES, newItems);
      return newItems;
    },
    update: async (item: Movie) => {
      const items = get<Movie>(KEYS.MOVIES);
      const newItems = items.map(i => i.id === item.id ? item : i);
      set(KEYS.MOVIES, newItems);
      return newItems;
    },
    delete: async (id: string) => {
      const items = get<Movie>(KEYS.MOVIES);
      const newItems = items.filter(i => i.id !== id);
      set(KEYS.MOVIES, newItems);
      return newItems;
    }
  },

  locations: {
    getAll: async (): Promise<Location[]> => get<Location>(KEYS.LOCATIONS),
    add: async (item: Location) => {
      const items = get<Location>(KEYS.LOCATIONS);
      const newItems = [...items, item];
      set(KEYS.LOCATIONS, newItems);
      return newItems;
    },
    update: async (item: Location) => {
      const items = get<Location>(KEYS.LOCATIONS);
      const newItems = items.map(i => i.id === item.id ? item : i);
      set(KEYS.LOCATIONS, newItems);
      return newItems;
    },
    delete: async (id: string) => {
      const items = get<Location>(KEYS.LOCATIONS);
      const newItems = items.filter(i => i.id !== id);
      set(KEYS.LOCATIONS, newItems);
      return newItems;
    }
  },

  food: {
    getAll: async (): Promise<FoodItem[]> => get<FoodItem>(KEYS.FOOD),
    add: async (item: FoodItem) => {
      const items = get<FoodItem>(KEYS.FOOD);
      const newItems = [...items, item];
      set(KEYS.FOOD, newItems);
      return newItems;
    },
    update: async (item: FoodItem) => {
      const items = get<FoodItem>(KEYS.FOOD);
      const newItems = items.map(i => i.id === item.id ? item : i);
      set(KEYS.FOOD, newItems);
      return newItems;
    },
    delete: async (id: string) => {
      const items = get<FoodItem>(KEYS.FOOD);
      const newItems = items.filter(i => i.id !== id);
      set(KEYS.FOOD, newItems);
      return newItems;
    }
  },

  reviews: {
    getAll: async (): Promise<Review[]> => get<Review>(KEYS.REVIEWS),
    add: async (item: Review) => {
      const items = get<Review>(KEYS.REVIEWS);
      const newItems = [item, ...items]; // Prepend
      set(KEYS.REVIEWS, newItems);
      return newItems;
    }
  },

  auth: {
    login: async (username: string): Promise<User | null> => {
        const users = get<User>(KEYS.USERS);
        // In a real app, password check would happen here
        const user = users.find(u => u.username === username);
        return user || null;
    },
    register: async (username: string): Promise<User> => {
        const users = get<User>(KEYS.USERS);
        const newUser: User = {
            username,
            avatar: null,
            credits: 100,
            level: 1,
            isAdmin: false
        };
        set(KEYS.USERS, [...users, newUser]);
        return newUser;
    },
    updateUser: async (updatedUser: User) => {
        const users = get<User>(KEYS.USERS);
        const newUsers = users.map(u => u.username === updatedUser.username ? updatedUser : u);
        set(KEYS.USERS, newUsers);
        return updatedUser;
    }
  }
};

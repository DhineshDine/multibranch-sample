
export interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: string; // e.g., "A-4"
  status: 'OPEN' | 'CLOSED' | 'MAINTENANCE';
  capacity: number; // percentage 0-100
}

export interface Movie {
  id: string;
  title: string;
  tagline: string;
  description: string;
  rating: string;
  duration: string;
  genre: string[];
  image: string;
  price: number;
  showtimes: string[];
  locationIds: string[]; // IDs of locations showing this movie
}

export interface Ticket {
  id: string;
  movieId: string;
  showtime: string;
  seats: string[];
  total: number;
  date: string;
}

export interface User {
  username: string;
  avatar: string | null;
  credits: number;
  level: number;
  isAdmin?: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  tags: string[];
  isOutOfStock?: boolean;
}

export interface Review {
  id: string;
  movieId: string;
  movieTitle: string;
  movieImage?: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
}

export enum BookingStep {
  BROWSING = 'BROWSING',
  SELECTING_SEATS = 'SELECTING_SEATS',
  CONFIRMATION = 'CONFIRMATION',
  PROFILE = 'PROFILE',
  CALENDAR = 'CALENDAR',
  FOOD = 'FOOD',
  REVIEWS = 'REVIEWS',
}

export enum AdminView {
  STREAMING = 'STREAMING',
  CANTEEN = 'CANTEEN',
  INSIGHTS = 'INSIGHTS',
  CALENDAR_EDIT = 'CALENDAR_EDIT',
  LOCATIONS = 'LOCATIONS',
}

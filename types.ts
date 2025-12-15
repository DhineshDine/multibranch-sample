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
}

export interface Ticket {
  id: string;
  movieId: string;
  showtime: string;
  seats: string[];
  total: number;
  date: string;
}

export enum BookingStep {
  BROWSING = 'BROWSING',
  SELECTING_SEATS = 'SELECTING_SEATS',
  CONFIRMATION = 'CONFIRMATION',
}
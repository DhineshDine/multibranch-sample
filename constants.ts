
import { Movie, Location, FoodItem } from './types';

export const LOCATIONS: Location[] = [
  {
    id: 'l1',
    name: 'Downtown Retroplex',
    address: '101 Neon Ave',
    coordinates: 'C-3',
    status: 'OPEN',
    capacity: 98
  },
  {
    id: 'l2',
    name: 'Sector 7 Underground',
    address: 'Sector 7, Level B',
    coordinates: 'E-5',
    status: 'MAINTENANCE',
    capacity: 0
  },
  {
    id: 'l3',
    name: 'Orbital Station Alpha',
    address: 'Low Earth Orbit',
    coordinates: 'A-1',
    status: 'OPEN',
    capacity: 45
  }
];

export const MOVIES: Movie[] = [
  {
    id: 'm1',
    title: 'THE GOO FROM SECTOR 7',
    tagline: 'It hungers for plasma.',
    description: 'A scientific experiment goes horribly wrong when Sector 7 scientists try to synthesize a new flavor of soda. Now, the carbonation is alive, and it is angry.',
    rating: 'R',
    duration: '1h 34m',
    genre: ['Sci-Fi', 'Horror'],
    image: 'https://picsum.photos/400/600?random=1',
    price: 12,
    showtimes: ['18:00', '20:30', '23:00'],
    locationIds: ['l1', 'l2']
  },
  {
    id: 'm2',
    title: 'MIDNIGHT NEON DINER',
    tagline: 'Coffee. Pie. Murder.',
    description: 'In a city that never sleeps, a lonely detective finds solace in a 24-hour diner run by androids. But when the pie starts tasting like motor oil, he knows something is up.',
    rating: 'PG-13',
    duration: '2h 10m',
    genre: ['Noir', 'Cyberpunk'],
    image: 'https://picsum.photos/400/600?random=2',
    price: 14,
    showtimes: ['19:15', '21:45'],
    locationIds: ['l1', 'l3']
  },
  {
    id: 'm3',
    title: 'ATTACK OF THE POLYGONS',
    tagline: 'Low poly. High terror.',
    description: 'They came from the 64-bit dimension. Sharp edges, flat shading, and a thirst for high-resolution textures. Can humanity upgrade in time?',
    rating: 'PG',
    duration: '1h 45m',
    genre: ['Adventure', 'Comedy'],
    image: 'https://picsum.photos/400/600?random=3',
    price: 10,
    showtimes: ['14:00', '16:30', '19:00'],
    locationIds: ['l1', 'l2', 'l3']
  },
  {
    id: 'm4',
    title: 'VAMPIRE SYNTH 1999',
    tagline: 'Bite the beat.',
    description: 'A rock band of vampires tours the underground club scene of 1999 Tokyo. They don\'t just want your blood, they want your applause.',
    rating: 'R',
    duration: '1h 55m',
    genre: ['Musical', 'Horror'],
    image: 'https://picsum.photos/400/600?random=4',
    price: 15,
    showtimes: ['22:00', '00:30'],
    locationIds: ['l3']
  }
];

export const FOOD_ITEMS: FoodItem[] = [
    { 
        id: 'f1', 
        name: 'NEON POPCORN', 
        price: 8, 
        description: 'Glows in the dark. Radioactive butter flavor.', 
        tags: ['POPULAR', 'VEGAN?'],
        image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&q=80&w=400'
    },
    { 
        id: 'f2', 
        name: 'VOID SODA', 
        price: 5, 
        description: 'Tastes like static. Zero calories, zero soul.', 
        tags: ['SUGAR-FREE'],
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400'
    },
    { 
        id: 'f3', 
        name: 'CYBER PIZZA', 
        price: 12, 
        description: 'Holographic pepperoni. 100% Polygon cheese.', 
        tags: ['HOT'],
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400'
    },
    { 
        id: 'f4', 
        name: 'DATA CHIPS', 
        price: 6, 
        description: 'Crunchy binary bites. May improve coding skills.', 
        tags: ['CRUNCHY'],
        image: 'https://images.unsplash.com/photo-1566478919030-26d9c286094d?auto=format&fit=crop&q=80&w=400'
    },
];

export const SEAT_ROWS = 6;
export const SEAT_COLS = 8;

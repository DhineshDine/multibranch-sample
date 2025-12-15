import { Movie } from './types';

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
    showtimes: ['18:00', '20:30', '23:00']
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
    showtimes: ['19:15', '21:45']
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
    showtimes: ['14:00', '16:30', '19:00']
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
    showtimes: ['22:00', '00:30']
  }
];

export const SEAT_ROWS = 6;
export const SEAT_COLS = 8;
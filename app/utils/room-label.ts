import { seededRandom } from "./seed-random";

const rooms = [
  "Einstein",
  "Newton",
  "Galileo",
  "Darwin",
  "Curie",
  "Hawking",
  "Feynman",
  "Socrates",
  "Plato",
  "Aristotle",
  "Descartes",
  "Kant",
  "Nietzsche",
  "Confucius",
  "Shakespeare",
  "Hemingway",
  "Orwell",
  "Fitzgerald",
  "Tolkien",
  "Mozart",
  "Beethoven",
  "Bach",
  "Vivaldi",
  "Chopin",
  "DaVinci",
  "Michelangelo",
  "Picasso",
  "Rembrandt",
  "VanGogh",
  "Copernicus",
  "Kepler",
  "Bohr",
  "Maxwell",
  "Archimedes",
  "Heidegger",
  "Locke",
  "Hume",
];

export const getRoomLabel = (id: string) => seededRandom(id, rooms);
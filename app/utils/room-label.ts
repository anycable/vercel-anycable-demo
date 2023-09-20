import { seededRandom } from "./seed-random";

const rooms = [
  "Pushkin",
  "Chekhov",
  "Tolstoy",
  "Dostoevsky",
  "Tchaikovsky",
  "Rublev",
  "Kandinsky",
  "Eisenstein",
  "Mayakovsky",
  "Ostrovsky",
  "Borodin",
  "Prokofiev",
  "Solzhenitsyn",
  "Shostakovich",
  "Pasternak",
  "Lomonosov",
  "Mendeleev",
  "Akhmatova",
  "Tarkovsky",
  "Korolev",
  "Chagall",
  "Sakharov",
  "Popov",
  "Zhukovsky",
];

export const getRoomLabel = (id: string) => seededRandom(id, rooms);

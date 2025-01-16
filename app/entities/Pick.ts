import { Hero } from "./Hero";

export interface Pick {
    radiantHeroes: Hero[]; // IDs героев Radiant
    radiantPositions: number[]; // Позиции героев Radiant
    direHeroes: Hero[]; // IDs героев Dire
    direPositions: number[]; // Позиции героев Dire
  }
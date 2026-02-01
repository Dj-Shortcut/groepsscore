export type Level = {
  minPoints: number;
  title: string;
  description: string;
};

/**
 * Startfase levels – bewust laagdrempelig
 */
export const LEVELS: Level[] = [
  {
    minPoints: 0,
    title: "Aanwezig",
    description: "Je bent erbij. Dat is al genoeg.",
  },
  {
    minPoints: 10,
    title: "Eerste bijdrage",
    description: "Je hebt je eerste bijdrage geleverd.",
  },
  {
    minPoints: 30,
    title: "Meedenker",
    description: "Je denkt mee en reageert actief.",
  },
];

/**
 * Bepaal level op basis van totaal aantal punten
 */
export function getLevel(totalPoints: number): Level {
  // Ga van hoog naar laag om juiste level te vinden
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalPoints >= LEVELS[i].minPoints) {
      return LEVELS[i];
    }
  }

  // fallback (zou nooit gebeuren)
  return LEVELS[0];
}

import { getMonthlyLeaderboard } from "./store.js";
import { getLevel } from "./levels.js";
import { getUserScore } from "./store.js";
export function generateMonthlyLeaderboardText() {
    const rows = getMonthlyLeaderboard(10);
    if (rows.length === 0) {
        return "Nog geen activiteit deze maand 👀";
    }
    let text = "🏆 **Groepsscore – Maandranking**\n\n";
    rows.forEach((row, index) => {
        const score = getUserScore(row.user_id);
        const level = getLevel(score.total);
        const medal = index === 0 ? "•" : "•"; // geen podium in startfase
        text += `${medal} ${row.user_id} — ${row.weekly} punten (${level.title})\n`;
    });
    text += "\nIedere bijdrage telt. Volgende reset: einde van de maand ✨";
    return text;
}
//# sourceMappingURL=leaderboard.js.map
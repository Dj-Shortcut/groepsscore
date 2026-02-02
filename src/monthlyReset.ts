import { resetMonthlyScores } from "./store.js";

export function runMonthlyReset() {
  console.log("🔁 Maandelijkse reset gestart");
  resetMonthlyScores();
  console.log("✅ Maandelijkse reset voltooid");
}

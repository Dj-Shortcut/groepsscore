import { resetWeeklyScores } from "./store.js";

export function runWeeklyReset() {
  console.log("🔁 Wekelijkse reset gestart");
  resetWeeklyScores();
  console.log("✅ Wekelijkse reset voltooid");
}

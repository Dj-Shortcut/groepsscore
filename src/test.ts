import { awardPoints } from "./xpEngine";

for (let i = 0; i < 5; i++) {
  awardPoints("andy", "comment", Date.now(), true);
}

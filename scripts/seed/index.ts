import { seedTopics } from "./seed-topics";
import { seedCompanies } from "./seed-companies";
import { seedQuant } from "./seed-quant";
import { seedVerbal } from "./seed-verbal";
import { seedLogical } from "./seed-logical";
import { seedDi } from "./seed-di";
import { seedNumerical } from "./seed-numerical";
import { seedCriticalReasoning } from "./seed-critical-reasoning";

// Phase B: topics + companies + the full question bank across all 6
// subjects. Safe to re-run — each seed-<subject>.ts deletes and replaces
// only its own subject's questions first.
async function main() {
  await seedTopics();
  await seedCompanies();
  await seedQuant();
  await seedVerbal();
  await seedLogical();
  await seedDi();
  await seedNumerical();
  await seedCriticalReasoning();
  console.log("Seed complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

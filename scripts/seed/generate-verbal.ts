import type { QuestionSeed } from "./lib";
import { opts } from "./lib";
import type { Difficulty } from "@/lib/types/database";

// Hand-curated: WORD | synonym | antonym | decoy | decoy | difficulty (e/m/h).
// Decoys are picked to be clearly unrelated in meaning, so each question has
// exactly one defensible answer (the opposite-meaning word is the trap).
const TABLE = `
ABUNDANT|Plentiful|Scarce|Fragrant|Ancient|e
ADVERSITY|Hardship|Prosperity|Curiosity|Silence|m
AMBIGUOUS|Unclear|Explicit|Ancient|Loud|m
AMIABLE|Friendly|Hostile|Wealthy|Tall|e
ARROGANT|Haughty|Humble|Hungry|Distant|e
BENEVOLENT|Kind-hearted|Malevolent|Sleepy|Narrow|m
CAUTIOUS|Careful|Reckless|Wealthy|Noisy|e
COMPETENT|Capable|Inept|Fragrant|Silent|e
CONCEAL|Hide|Reveal|Borrow|Travel|e
DILIGENT|Industrious|Lazy|Musical|Hollow|e
DIMINISH|Lessen|Augment|Celebrate|Borrow|m
ELOQUENT|Articulate|Inarticulate|Wealthy|Ancient|m
EPHEMERAL|Fleeting|Permanent|Colourful|Heavy|h
EXPAND|Enlarge|Shrink|Imitate|Polish|e
FEASIBLE|Practicable|Impractical|Fragrant|Cheerful|m
FEROCIOUS|Fierce|Gentle|Punctual|Shallow|e
FRAGILE|Delicate|Sturdy|Bitter|Rapid|e
GENUINE|Authentic|Counterfeit|Cheerful|Distant|e
IMMENSE|Enormous|Tiny|Clever|Ancient|e
INEVITABLE|Unavoidable|Avoidable|Fragrant|Joyful|m
JUBILANT|Joyful|Dejected|Careful|Ancient|m
LETHARGIC|Sluggish|Energetic|Honest|Narrow|m
LUCID|Clear|Confusing|Wealthy|Bitter|m
METICULOUS|Thorough|Careless|Generous|Loud|m
NOVICE|Beginner|Expert|Neighbour|Critic|e
OBSOLETE|Outdated|Modern|Bitter|Generous|e
OPTIMISTIC|Hopeful|Pessimistic|Punctual|Hollow|e
PROFOUND|Deep|Superficial|Noisy|Rapid|m
PROHIBIT|Forbid|Permit|Repair|Inspect|e
PRUDENT|Wise|Foolish|Fragrant|Tall|m
RELUCTANT|Unwilling|Eager|Ancient|Bitter|e
RESILIENT|Tough|Fragile|Generous|Noisy|m
SINCERE|Honest|Insincere|Rapid|Hollow|e
SPONTANEOUS|Impulsive|Planned|Wealthy|Bitter|m
SUCCINCT|Concise|Verbose|Fragrant|Ancient|h
TEDIOUS|Boring|Interesting|Honest|Shallow|e
TENTATIVE|Provisional|Definite|Cheerful|Bitter|m
TRANQUIL|Calm|Turbulent|Clever|Narrow|m
TRIVIAL|Insignificant|Important|Fragrant|Rapid|e
UBIQUITOUS|Omnipresent|Rare|Honest|Bitter|h
VAGUE|Imprecise|Precise|Hungry|Generous|e
VIGILANT|Watchful|Inattentive|Fragrant|Wealthy|m
ZEALOUS|Enthusiastic|Apathetic|Punctual|Narrow|m
AFFLUENT|Wealthy|Impoverished|Curious|Silent|m
ALLEVIATE|Relieve|Aggravate|Inspect|Borrow|h
ANIMOSITY|Hostility|Goodwill|Curiosity|Silence|h
AUDACIOUS|Bold|Timid|Fragrant|Hollow|m
BANAL|Commonplace|Original|Bitter|Rapid|h
CONCUR|Agree|Disagree|Borrow|Travel|m
DEFER|Postpone|Expedite|Polish|Imitate|m
DETRIMENTAL|Harmful|Beneficial|Ancient|Noisy|m
ERRATIC|Unpredictable|Consistent|Generous|Fragrant|m
EXONERATE|Acquit|Convict|Inspect|Celebrate|h
FUTILE|Useless|Fruitful|Bitter|Tall|m
GREGARIOUS|Sociable|Reclusive|Punctual|Shallow|h
HINDER|Obstruct|Facilitate|Polish|Travel|m
IMPARTIAL|Unbiased|Biased|Hungry|Rapid|e
INDIGENOUS|Native|Foreign|Cheerful|Hollow|m
LENIENT|Tolerant|Strict|Fragrant|Ancient|m
MITIGATE|Ease|Intensify|Borrow|Inspect|h
NEGLIGENT|Careless|Conscientious|Wealthy|Rapid|m
OBSTINATE|Stubborn|Flexible|Fragrant|Silent|m
PLACID|Serene|Agitated|Hungry|Narrow|m
REDUNDANT|Superfluous|Essential|Cheerful|Ancient|h
SCRUTINIZE|Examine|Overlook|Celebrate|Borrow|m
TENACIOUS|Persistent|Wavering|Fragrant|Noisy|h
ADEPT|Skilled|Clumsy|Honest|Distant|m
DOCILE|Obedient|Rebellious|Fragrant|Rapid|m
INTREPID|Fearless|Cowardly|Punctual|Bitter|h
LAUD|Praise|Criticize|Borrow|Inspect|h
`;

const DIFF: Record<string, Difficulty> = { e: "easy", m: "medium", h: "hard" };

export function generateVerbal(): QuestionSeed[] {
  const out: QuestionSeed[] = [];
  for (const line of TABLE.trim().split("\n")) {
    const [word, syn, ant, d1, d2, d] = line.split("|");
    const difficulty = DIFF[d];
    const unrelated = `'${d1}' and '${d2}' are unrelated in meaning.`;
    out.push({
      question_type: "Vocabulary",
      question_text: `Choose the word most nearly SIMILAR in meaning to '${word}'.`,
      options: opts(syn, ant, d1, d2),
      correct_option_key: "A",
      difficulty,
      explanation: `'${word}' is closest in meaning to '${syn}'. '${ant}' is its opposite (the trap option). ${unrelated}`,
      concept: "Synonyms",
      exam_tip: "The exact opposite is the most common trap in synonym questions — read 'SIMILAR' vs 'OPPOSITE' twice.",
    });
    out.push({
      question_type: "Vocabulary",
      question_text: `Choose the word most nearly OPPOSITE in meaning to '${word}'.`,
      options: opts(ant, syn, d1, d2),
      correct_option_key: "A",
      difficulty,
      explanation: `'${word}' means roughly '${syn}', so its opposite is '${ant}'. '${syn}' is a synonym (the trap option). ${unrelated}`,
      concept: "Antonyms",
      exam_tip: "Antonym questions almost always include a synonym as a trap — eliminate it first.",
    });
  }
  return out;
}

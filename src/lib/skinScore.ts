export interface QuizState {
  concern: string;
  skinType: string;
  timeline: string;
  history: string;
  routine: string;
  sunProtection: string;
}

export type ScoreResult = {
  overall: number;          // 55-95
  categories: {
    label: string;          
    score: number;          // 55-95
  }[];
};

/**
 * Calculates a gamified "Skin Score" based on quiz answers.
 * Clamps all final scores between 55 and 95 to ensure an encouraging tone.
 */
export function calculateSkinScore(answers: QuizState): ScoreResult {
  // 1. Calculate raw Routine score (0-100)
  let rawRoutine = 50;
  if (answers.routine === 'strict daily routine') rawRoutine = 100;
  else if (answers.routine === 'sometimes i forget') rawRoutine = 60;
  else if (answers.routine === "i don't have one") rawRoutine = 20;

  if (answers.history === 'yes') rawRoutine += 15; // Bonus for professional history

  // 2. Calculate raw Protection score (0-100)
  let rawProtection = 50;
  if (answers.sunProtection === 'every single day') rawProtection = 100;
  else if (answers.sunProtection === "only when it's sunny") rawProtection = 50;
  else if (answers.sunProtection === 'rarely') rawProtection = 10;

  // 3. Calculate raw Hydration/Barrier score (0-100)
  let rawBarrier = 75; // Baseline
  if (answers.skinType === 'dry') rawBarrier -= 15;
  if (answers.skinType === 'sensitive') rawBarrier -= 20;
  if (answers.skinType === 'oily') rawBarrier += 10;
  if (answers.skinType === 'combination') rawBarrier += 5;

  if (answers.concern === 'general glow') rawBarrier += 10;
  if (answers.concern === 'aging/fine lines') rawBarrier -= 5;
  if (answers.concern === 'acne') rawBarrier -= 10;

  // Normalize raw scores
  rawRoutine = Math.max(0, Math.min(100, rawRoutine));
  rawProtection = Math.max(0, Math.min(100, rawProtection));
  rawBarrier = Math.max(0, Math.min(100, rawBarrier));

  // Map 0-100 raw score to 55-95 range
  const mapToRange = (val: number) => Math.round(55 + (val / 100) * 40);

  const routineScore = mapToRange(rawRoutine);
  const protectionScore = mapToRange(rawProtection);
  const barrierScore = mapToRange(rawBarrier);

  // Overall is average of clamped scores
  const overall = Math.round((routineScore + protectionScore + barrierScore) / 3);

  return {
    overall,
    categories: [
      { label: 'Hydration & Barrier', score: barrierScore },
      { label: 'Sun Protection', score: protectionScore },
      { label: 'Routine Consistency', score: routineScore }
    ]
  };
}

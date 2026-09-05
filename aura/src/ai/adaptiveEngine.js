// ============================================================
// AURA ADAPTIVE ENGINE
// ============================================================
// This is the decision layer for Adaptive Cognitive Rhythm.
//
// CURRENT VERSION:
// Rule-based baseline.
//
// FUTURE VERSION:
// Replace this logic with an actual ML model/API.
// Rhythm.jsx should NOT need major changes.
// ============================================================

export function generateAdaptivePlan(patient) {
  if (!patient) {
    throw new Error("Patient data is required.");
  }

  const {
    memory = 0,
    attention = 0,
    engagement = 0,
    recentActivities = [],
    bestTime = "10:00 AM",
  } = patient;

  // ----------------------------------------------------------
  // 1. Find the strongest and weakest cognitive areas
  // ----------------------------------------------------------

  const strongestArea =
    memory >= attention ? "Memory" : "Attention";

  const weakestArea =
    memory < attention ? "Memory" : "Attention";

  // ----------------------------------------------------------
  // 2. Calculate recent average performance
  // ----------------------------------------------------------

  const recentScores = recentActivities
    .map((activity) => activity.score)
    .filter((score) => typeof score === "number");

  const recentAverage =
    recentScores.length > 0
      ? Math.round(
          recentScores.reduce((sum, score) => sum + score, 0) /
            recentScores.length
        )
      : 0;

  // ----------------------------------------------------------
  // 3. Determine recommended difficulty
  // ----------------------------------------------------------

  let difficulty = "Easy";

  if (
    recentAverage >= 80 &&
    engagement >= 80 &&
    Math.min(memory, attention) >= 75
  ) {
    difficulty = "Medium";
  }

  if (
    recentAverage >= 88 &&
    engagement >= 90 &&
    Math.min(memory, attention) >= 85
  ) {
    difficulty = "Hard";
  }

  // ----------------------------------------------------------
  // 4. Choose activity based on weakest area
  // ----------------------------------------------------------

  let activityType = "Pattern Recognition";

  if (weakestArea === "Attention") {
    activityType = "Attention Match";
  }

  if (weakestArea === "Memory") {
    activityType = "Memory Recall";
  }

  // ----------------------------------------------------------
  // 5. Adapt based on engagement
  // ----------------------------------------------------------

  let assistanceLevel = "Standard";

  if (engagement < 60) {
    assistanceLevel = "High Assistance";
  } else if (engagement < 75) {
    assistanceLevel = "Gentle Assistance";
  }

  // ----------------------------------------------------------
  // 6. Generate explanation
  // ----------------------------------------------------------

  let reason = "";

  if (weakestArea === "Attention") {
    reason =
      `Attention (${attention}%) is currently lower than memory ` +
      `(${memory}%). AURA is prioritizing an attention-focused ` +
      `activity to gently support this area.`;
  } else {
    reason =
      `Memory (${memory}%) is currently lower than attention ` +
      `(${attention}%). AURA is prioritizing a memory-focused ` +
      `activity to gently support this area.`;
  }

  // ----------------------------------------------------------
  // 7. Confidence score
  // ----------------------------------------------------------

  let confidence = 70;

  if (recentScores.length >= 3) {
    confidence += 10;
  }

  if (engagement >= 80) {
    confidence += 10;
  }

  confidence = Math.min(confidence, 95);

  // ----------------------------------------------------------
  // FINAL ADAPTIVE OUTPUT
  // ----------------------------------------------------------

  return {
    activityType,
    difficulty,
    suggestedTime: bestTime,
    assistanceLevel,

    strongestArea,
    weakestArea,

    recentAverage,

    confidence,

    reason,

    generatedAt: new Date().toISOString(),
  };
}
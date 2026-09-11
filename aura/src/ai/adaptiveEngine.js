const ACTIVITY_LEVELS = ["easy", "medium", "hard"];

const ACTIVITIES = [
  {
    name: "Memory Game",
    focus: "memory",
    preferredCategories: ["People", "Culture"],
  },
  {
    name: "Family Memory Recall",
    focus: "memory",
    preferredCategories: ["People"],
  },
  {
    name: "Pattern Recognition",
    focus: "attention",
    preferredCategories: ["All"],
  },
  {
    name: "Daily Routine",
    focus: "sequencing",
    preferredCategories: ["All"],
  },
];

export function analyzePerformance(result, history = []) {
  const accuracy = Number(result?.accuracy || 0);
  const hints = Number(result?.hintsUsed || 0);
  const time = Number(result?.elapsedTime || 0);

  let performanceScore = accuracy;

  // Small penalty for heavy hint dependence.
  performanceScore -= hints * 5;

  // Reward faster completion without making speed dominant.
  if (time > 0 && time <= 40) {
    performanceScore += 5;
  } else if (time >= 90) {
    performanceScore -= 5;
  }

  performanceScore = Math.max(
    0,
    Math.min(100, Math.round(performanceScore))
  );

  let performanceBand = "moderate";

  if (performanceScore >= 80) {
    performanceBand = "strong";
  } else if (performanceScore < 60) {
    performanceBand = "needs_support";
  }

  return {
    performanceScore,
    performanceBand,
    accuracy,
    hints,
    time,
    historyCount: history.length,
  };
}

export function generateAdaptivePlan(result, history = []) {
  const analysis = analyzePerformance(result, history);

  let difficulty = result?.difficulty || "easy";
  let activity = "Memory Game";
  let reason = "";

  if (analysis.performanceBand === "strong") {
    difficulty = increaseDifficulty(difficulty);

    activity =
      result?.category === "People"
        ? "Pattern Recognition"
        : "Family Memory Recall";

    reason =
      "Strong recent performance detected. Increasing cognitive challenge gradually.";
  } else if (analysis.performanceBand === "needs_support") {
    difficulty = decreaseDifficulty(difficulty);

    activity = "Family Memory Recall";

    reason =
      "Recent performance suggests a higher cognitive load. Returning to familiar-memory activities with gentler difficulty.";
  } else {
    difficulty = result?.difficulty || "medium";

    activity =
      result?.category === "People"
        ? "Family Memory Recall"
        : "Memory Game";

    reason =
      "Performance is stable. Maintaining a similar challenge while reinforcing familiar memories.";
  }

  return {
    activity,
    difficulty,
    performanceScore: analysis.performanceScore,
    performanceBand: analysis.performanceBand,
    reason,
    recommendedTime:
      analysis.performanceBand === "strong"
        ? "10–15 min"
        : "5–10 min",
  };
}

function increaseDifficulty(current) {
  const index = ACTIVITY_LEVELS.indexOf(current);

  if (index === -1) return "medium";

  return ACTIVITY_LEVELS[Math.min(index + 1, ACTIVITY_LEVELS.length - 1)];
}

function decreaseDifficulty(current) {
  const index = ACTIVITY_LEVELS.indexOf(current);

  if (index === -1) return "easy";

  return ACTIVITY_LEVELS[Math.max(index - 1, 0)];
}
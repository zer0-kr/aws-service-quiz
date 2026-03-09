import { PENALTY_MS } from "@/lib/utils";

export function calculateFinalTime(
  totalTimeMs: number,
  penaltyCount: number
): number {
  return totalTimeMs + penaltyCount * PENALTY_MS;
}

export function calculateRankScore(finalTimeMs: number): number {
  // Lower time = better score. Return the raw ms for ranking.
  return finalTimeMs;
}

export function getDifficultyLabel(difficulty: number): string {
  switch (difficulty) {
    case 1:
      return "Very Easy";
    case 2:
      return "Easy";
    case 3:
      return "Medium";
    case 4:
      return "Hard";
    case 5:
      return "Very Hard";
    default:
      return "Unknown";
  }
}

export function getDifficultyColor(difficulty: number): string {
  switch (difficulty) {
    case 1:
      return "text-green-400";
    case 2:
      return "text-emerald-400";
    case 3:
      return "text-yellow-400";
    case 4:
      return "text-orange-400";
    case 5:
      return "text-red-400";
    default:
      return "text-gray-400";
  }
}

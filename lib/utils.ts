export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);

  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
  }
  return `${seconds}.${centiseconds.toString().padStart(2, "0")}`;
}

export function formatRank(rank: number): string {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getKSTDate(): Date {
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  return new Date(now.getTime() + kstOffset);
}

export function getKSTDateString(): string {
  const kst = getKSTDate();
  return kst.toISOString().split("T")[0];
}

export const PENALTY_MS = 10000;
export const TOTAL_QUESTIONS = 15;
export const MAX_DAILY_ATTEMPTS = 3;
export const ICON_CDN_BASE =
  "https://cdn.jsdelivr.net/npm/aws-icons@3.2.0/icons/architecture-service";

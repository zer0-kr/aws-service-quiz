export interface AwsService {
  id: string;
  name: string;
  iconFile: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  category: ServiceCategory;
}

export type ServiceCategory =
  | "compute"
  | "storage"
  | "database"
  | "networking"
  | "security"
  | "management"
  | "developer-tools"
  | "analytics"
  | "ml-ai"
  | "integration"
  | "iot"
  | "migration"
  | "media"
  | "other";

export interface QuizQuestion {
  serviceId: string;
  iconUrl: string;
  choices: string[];
  correctIndex: number;
}

export interface GameSession {
  id: string;
  user_id: string;
  started_at: string;
  completed_at: string | null;
  total_time_ms: number | null;
  penalty_ms: number;
  final_time_ms: number | null;
  penalty_count: number;
  correct_count: number;
  questions: QuizQuestion[];
  status: "playing" | "completed" | "abandoned";
}

export interface Profile {
  id: string;
  nickname: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  nickname: string;
  avatar_url: string | null;
  best_time_ms: number;
  penalty_count: number;
  correct_count: number;
  completed_at: string;
  rank: number;
}

export interface GameState {
  sessionId: string;
  questions: QuizQuestion[];
  currentIndex: number;
  answers: (number | null)[];
  penaltyCount: number;
  startedAt: number;
}

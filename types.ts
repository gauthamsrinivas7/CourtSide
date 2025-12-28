export interface Team {
  id: string;
  name: string;
  league: string;
}

export interface UserPreferences {
  email: string;
  timezone: string;
  teams: Team[];
}

export interface GamePreview {
  matchup: string;
  time: string;
  broadcaster: string;
}

export interface GameSummary {
  matchup: string;
  score: string;
  detailsLink: string;
}

export interface PreviewResponse {
  games: GamePreview[];
  date: string;
}

export interface SummaryResponse {
  results: GameSummary[];
  date: string;
}

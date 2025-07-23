// MLB Teams and their information
export interface MLBTeam {
  id: string;
  name: string;
  shortName: string;
  city: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
}

// Odds data from The Odds API
export interface OddsData {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
}

export interface Bookmaker {
  key: string;
  title: string;
  last_update: string;
  markets: Market[];
}

export interface Market {
  key: string; // 'h2h' | 'spreads' | 'totals'
  last_update: string;
  outcomes: Outcome[];
}

export interface Outcome {
  name: string;
  price: number;
  point?: number; // For spreads and totals
}

// Game data structure
export interface MLBGame {
  id: string;
  homeTeam: MLBTeam;
  awayTeam: MLBTeam;
  commenceTime: string;
  odds: {
    moneyLine?: {
      home: number;
      away: number;
    };
    runLine?: {
      home: { price: number; point: number };
      away: { price: number; point: number };
    };
    total?: {
      over: { price: number; point: number };
      under: { price: number; point: number };
    };
  };
  result?: GameResult;
}

export interface GameResult {
  homeScore: number;
  awayScore: number;
  winner: 'home' | 'away';
  totalRuns: number;
  gameDate: string;
}

// Streak tracking
export interface TeamStreak {
  teamId: string;
  winStreak: number;
  lossStreak: number;
  overStreak: number;
  underStreak: number;
  runLineWinStreak: number;
  runLineLossStreak: number;
  seriesResults: SeriesResult[];
  lastUpdated: string;
}

export interface SeriesResult {
  opponent: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  startDate: string;
  endDate: string;
  isComplete: boolean;
}

// User preferences and alerts
export interface UserThreshold {
  teamId: string;
  winStreakThreshold: number;
  lossStreakThreshold: number;
  overStreakThreshold: number;
  underStreakThreshold: number;
  runLineStreakThreshold: number;
  alertEnabled: boolean;
}

export interface UserSettings {
  userId: string;
  thresholds: UserThreshold[];
  favoriteTeams: string[];
  defaultView: 'today' | 'favorites' | 'all';
  notifications: boolean;
}

// API response types
export interface OddsApiResponse {
  data: OddsData[];
  success: boolean;
  error?: string;
}

export interface StreakAlert {
  teamId: string;
  alertType: 'win' | 'loss' | 'over' | 'under' | 'runline';
  currentStreak: number;
  threshold: number;
  message: string;
  timestamp: string;
}

import axios from 'axios';
import { OddsData, MLBGame } from '@/types';
import { getTeamByName } from './teams';

const ODDS_API_BASE_URL = process.env.ODDS_API_BASE_URL || 'https://api.the-odds-api.com/v4';
const ODDS_API_KEY = process.env.ODDS_API_KEY;

// Enhanced error handling for production
if (!ODDS_API_KEY && process.env.NODE_ENV === 'production') {
  console.error('CRITICAL: ODDS_API_KEY is not set in production environment');
} else if (!ODDS_API_KEY) {
  console.warn('ODDS_API_KEY is not set. MLB odds functionality will be limited.');
}

export class OddsAPIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = ODDS_API_KEY || '';
    this.baseUrl = ODDS_API_BASE_URL;
  }

  /**
   * Fetch MLB odds for a specific date
   */
  async getMLBOdds(date?: string): Promise<MLBGame[]> {
    try {
      if (!this.apiKey) {
        throw new Error('API key not configured');
      }

      console.log('🔄 Fetching live MLB odds from The Odds API...');
      console.log('📅 Date filter:', date || 'All upcoming games');

      const params = new URLSearchParams({
        apiKey: this.apiKey,
        sport: 'baseball_mlb',
        regions: 'us',
        markets: 'h2h,spreads,totals',
        oddsFormat: 'american',
        bookmakers: 'draftkings'
      });

      if (date) {
        params.append('commenceTimeFrom', `${date}T00:00:00Z`);
        params.append('commenceTimeTo', `${date}T23:59:59Z`);
      }

      const apiUrl = `${this.baseUrl}/sports/baseball_mlb/odds`;
      console.log('🌐 API URL:', apiUrl);

      const response = await axios.get(apiUrl, {
        params: Object.fromEntries(params)
      });

      console.log('✅ API Response received:');
      console.log('📊 Raw games count:', response.data?.length || 0);
      console.log('🔄 Requests used:', response.headers['x-requests-used']);
      console.log('⏳ Requests remaining:', response.headers['x-requests-remaining']);

      const transformedGames = this.transformOddsData(response.data);
      console.log('🎯 Transformed games count:', transformedGames.length);

      return transformedGames;
    } catch (error) {
      console.error('Error fetching MLB odds:', error);
      throw new Error('Failed to fetch MLB odds');
    }
  }

  /**
   * Transform raw odds data to our MLBGame format
   */
  private transformOddsData(oddsData: OddsData[]): MLBGame[] {
    return oddsData.map(game => {
      const homeTeam = getTeamByName(game.home_team);
      const awayTeam = getTeamByName(game.away_team);

      if (!homeTeam || !awayTeam) {
        console.warn(`Unknown team in game: ${game.home_team} vs ${game.away_team}`);
        return null;
      }

      const draftkingsBookmaker = game.bookmakers?.find(b => b.key === 'draftkings');
      
      const mlbGame: MLBGame = {
        id: game.id,
        homeTeam,
        awayTeam,
        commenceTime: game.commence_time,
        odds: {}
      };

      if (draftkingsBookmaker) {
        // Money Line (h2h)
        const moneyLineMarket = draftkingsBookmaker.markets.find(m => m.key === 'h2h');
        if (moneyLineMarket) {
          const homeOutcome = moneyLineMarket.outcomes.find(o => o.name === game.home_team);
          const awayOutcome = moneyLineMarket.outcomes.find(o => o.name === game.away_team);
          
          if (homeOutcome && awayOutcome) {
            mlbGame.odds.moneyLine = {
              home: homeOutcome.price,
              away: awayOutcome.price
            };
          }
        }

        // Run Line (spreads)
        const runLineMarket = draftkingsBookmaker.markets.find(m => m.key === 'spreads');
        if (runLineMarket) {
          const homeOutcome = runLineMarket.outcomes.find(o => o.name === game.home_team);
          const awayOutcome = runLineMarket.outcomes.find(o => o.name === game.away_team);
          
          if (homeOutcome && awayOutcome && homeOutcome.point !== undefined && awayOutcome.point !== undefined) {
            mlbGame.odds.runLine = {
              home: { price: homeOutcome.price, point: homeOutcome.point },
              away: { price: awayOutcome.price, point: awayOutcome.point }
            };
          }
        }

        // Total (totals)
        const totalMarket = draftkingsBookmaker.markets.find(m => m.key === 'totals');
        if (totalMarket) {
          const overOutcome = totalMarket.outcomes.find(o => o.name === 'Over');
          const underOutcome = totalMarket.outcomes.find(o => o.name === 'Under');
          
          if (overOutcome && underOutcome && overOutcome.point !== undefined && underOutcome.point !== undefined) {
            mlbGame.odds.total = {
              over: { price: overOutcome.price, point: overOutcome.point },
              under: { price: underOutcome.price, point: underOutcome.point }
            };
          }
        }
      }

      return mlbGame;
    }).filter(game => game !== null) as MLBGame[];
  }

  /**
   * Get sports available from the API
   */
  async getSports(): Promise<Record<string, unknown>[]> {
    try {
      if (!this.apiKey) {
        throw new Error('API key not configured');
      }

      const response = await axios.get(`${this.baseUrl}/sports`, {
        params: { apiKey: this.apiKey }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching sports:', error);
      throw new Error('Failed to fetch sports');
    }
  }

  /**
   * Check API usage/remaining requests
   */
  async getUsage(): Promise<Record<string, unknown> | null> {
    try {
      if (!this.apiKey) {
        throw new Error('API key not configured');
      }

      const response = await axios.get(`${this.baseUrl}/sports/baseball_mlb/odds`, {
        params: {
          apiKey: this.apiKey,
          sport: 'baseball_mlb',
          regions: 'us',
          markets: 'h2h',
          oddsFormat: 'american'
        }
      });

      return {
        requestsUsed: response.headers['x-requests-used'],
        requestsRemaining: response.headers['x-requests-remaining']
      };
    } catch (error) {
      console.error('Error checking API usage:', error);
      return null;
    }
  }
}

export const oddsAPI = new OddsAPIService();

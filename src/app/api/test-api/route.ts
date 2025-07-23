import { NextResponse } from 'next/server';
import { oddsAPI } from '@/lib/odds-api';

export async function GET() {
  try {
    console.log('🧪 Testing The Odds API connection...');
    
    // Check if API key is configured
    const apiKey = process.env.ODDS_API_KEY;
    if (!apiKey || apiKey === 'your_odds_api_key_here') {
      return NextResponse.json({
        success: false,
        error: 'API key not properly configured',
        configured: false,
        hasKey: !!apiKey,
        keyPreview: apiKey ? `${apiKey.substring(0, 8)}...` : 'Not set'
      });
    }

    // Test getting available sports
    const sports = await oddsAPI.getSports();
    console.log('📋 Available sports from API:', sports.length);
    
    // Test getting MLB odds for today
    const todayGames = await oddsAPI.getMLBOdds();
    console.log('⚾ Today\'s MLB games:', todayGames.length);

    // Check API usage
    const usage = await oddsAPI.getUsage();
    console.log('📊 API Usage:', usage);

    return NextResponse.json({
      success: true,
      configured: true,
      apiKey: `${apiKey.substring(0, 8)}...`,
      sports: {
        count: sports.length,
        baseball: sports.find((sport: Record<string, unknown>) => sport.key === 'baseball_mlb') ? 'Available' : 'Not found'
      },
      games: {
        count: todayGames.length,
        hasOdds: todayGames.some(game => game.odds.moneyLine || game.odds.runLine || game.odds.total)
      },
      usage,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ API test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'API test failed',
      configured: true,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

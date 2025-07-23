import { NextRequest, NextResponse } from 'next/server';
import { oddsAPI } from '@/lib/odds-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    console.log('🎯 MLB Odds API endpoint called');
    console.log('📅 Requested date:', date || 'No date filter');
    
    const games = await oddsAPI.getMLBOdds(date || undefined);
    
    console.log('🏆 Successfully fetched games:', games.length);
    
    return NextResponse.json({
      success: true,
      data: games,
      count: games.length,
      message: `Fetched ${games.length} games from The Odds API`
    });
  } catch (error) {
    console.error('❌ Error in odds API endpoint:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch odds',
        isUsingRealAPI: true
      },
      { status: 500 }
    );
  }
}

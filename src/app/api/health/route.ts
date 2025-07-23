import { NextResponse } from 'next/server';

export async function GET() {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      oddsApi: {
        configured: !!process.env.ODDS_API_KEY,
        status: process.env.ODDS_API_KEY ? 'configured' : 'missing'
      },
      auth: {
        secretConfigured: !!process.env.NEXTAUTH_SECRET,
        usersConfigured: !!process.env.ALLOWED_USERS,
        status: (process.env.NEXTAUTH_SECRET && process.env.ALLOWED_USERS) ? 'configured' : 'incomplete'
      }
    }
  };

  // Check if all critical env vars are configured
  const isHealthy = healthCheck.checks.oddsApi.configured && 
                   healthCheck.checks.auth.secretConfigured && 
                   healthCheck.checks.auth.usersConfigured;

  return NextResponse.json(healthCheck, {
    status: isHealthy ? 200 : 500,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}

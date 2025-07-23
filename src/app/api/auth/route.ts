import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key-here'
);

const ALLOWED_USERS = (process.env.ALLOWED_USERS || 'steven@example.com,user2@example.com').split(',');

// Production environment checks
if (process.env.NODE_ENV === 'production') {
  if (!process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET === 'your_nextauth_secret_here') {
    console.error('CRITICAL: NEXTAUTH_SECRET must be set in production');
  }
  if (!process.env.ALLOWED_USERS || process.env.ALLOWED_USERS.includes('example.com')) {
    console.warn('WARNING: Update ALLOWED_USERS for production use');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Basic authentication - in production, use proper password hashing
    if (!ALLOWED_USERS.includes(email)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized user' },
        { status: 401 }
      );
    }

    // For demo purposes, accept any password for allowed users
    // In production, verify against hashed passwords
    if (!password || password.length < 4) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = await new SignJWT({ email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    const response = NextResponse.json({
      success: true,
      user: { email },
      message: 'Login successful'
    });

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful'
    });

    // Clear the auth cookie
    response.cookies.delete('auth-token');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token found' },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    return NextResponse.json({
      success: true,
      user: { email: payload.email }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Invalid token' },
      { status: 401 }
    );
  }
}

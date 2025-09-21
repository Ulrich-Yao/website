import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const result = await authenticateUser(username, password);

    if (!result) {
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    // ✅ Mettre le token dans un cookie HTTP-only
    const response = NextResponse.json({
      success: true,
      user: result.user,
    });

    response.cookies.set('auth-token', result.token, {
      httpOnly: true, // important : pas accessible côté JS
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24h
    });

    return response;
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function verifyToken(token: string) {
  try {
    console.log('🔧 JWT_SECRET in middleware:', JWT_SECRET);
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    console.log('🔧 Token successfully decoded:', payload);
    return payload;
  } catch (error) {
    console.log('🔧 Token verification error:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}
 
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log('🔍 Middleware executing for:', pathname);

  const token = request.cookies.get('auth-token')?.value;
  
  console.log('🍪 Token found:', !!token);
  console.log('🍪 Token value:', token ? token.substring(0, 20) + '...' : 'none');

  if (!token) {
    console.log('❌ No token, redirecting to login');
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const decoded = await verifyToken(token);
  console.log('🔑 Token decoded:', !!decoded);
  
  if (!decoded) {
    console.log('❌ Invalid token, redirecting to login');
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  
  console.log('✅ Access granted to:', pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/((?!login).*)' // Exclut seulement /admin/login
  ]
};

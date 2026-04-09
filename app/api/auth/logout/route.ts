import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  const seralized = serialize('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: -1, // Scade immediatamente
    path: '/',
  });

  return NextResponse.json(
    { message: 'Logged out' },
    {
      status: 200,
      headers: { 'Set-Cookie': seralized },
    }
  );
}
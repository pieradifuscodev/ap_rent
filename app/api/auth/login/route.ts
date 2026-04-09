import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const seralized = serialize('admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_VERSION === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 ore
      path: '/',
    });

    return NextResponse.json({ message: 'Success' }, {
      status: 200,
      headers: { 'Set-Cookie': seralized },
    });
  }

  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}
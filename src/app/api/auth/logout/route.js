// src/app/api/auth/logout/route.js
import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export async function POST() {
	clearSessionCookie();

	// langsung arahkan ke beranda
	return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
}

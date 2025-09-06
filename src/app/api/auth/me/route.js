import { NextResponse } from 'next/server';

export async function GET() {
	// TODO: baca cookie & verify token
	return NextResponse.json({ user: { id: 1, name: 'Demo User', email: 'demo@example.com' } });
}

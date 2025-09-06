import { NextResponse } from 'next/server';

export async function POST(req) {
	const body = await req.json();
	if (!body.email || !body.password) {
		return NextResponse.json({ error: 'Email/password wajib' }, { status: 400 });
	}

	// DEMO ONLY: di produksi, set HttpOnly cookie:
	// const res = NextResponse.json({ ok: true });
	// res.cookies.set('token', 'demo-token', { httpOnly: true, path: '/', maxAge: 60*60*24 });
	// return res;

	return NextResponse.json({ token: 'demo-token' });
}

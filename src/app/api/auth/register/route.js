import { NextResponse } from 'next/server';

export async function POST(req) {
	const body = await req.json();
	if (!body.name || !body.email || !body.password) {
		return NextResponse.json({ error: 'Field wajib diisi' }, { status: 400 });
	}
	return NextResponse.json({ token: 'demo-token' });
}

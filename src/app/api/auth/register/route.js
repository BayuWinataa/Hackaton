// src/app/api/auth/register/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
	if (process.env.NODE_ENV === 'production') {
		return NextResponse.json({ 
			error: 'This endpoint is disabled in production. Please use Supabase authentication.' 
		}, { status: 503 });
	}

	// Import Prisma only in development
	const { prisma } = await import('@/lib/prisma');
	const bcrypt = await import('bcrypt');

	try {
		const { email, password, name } = await req.json();
		if (!email || !password) {
			return NextResponse.json({ error: 'Email & password wajib.' }, { status: 400 });
		}
		const exists = await prisma.user.findUnique({ where: { email } });
		if (exists) return NextResponse.json({ error: 'Email sudah terdaftar.' }, { status: 400 });
		const hash = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: { email, password: hash, name: name || null },
			select: { id: true, email: true, name: true },
		});
		// ⛔️ JANGAN set cookie sesi di sini
		return NextResponse.json({ ok: true, user }, { status: 201 });
	} catch (e) {
		return NextResponse.json({ error: e.message || 'Gagal register.' }, { status: 500 });
	}
}

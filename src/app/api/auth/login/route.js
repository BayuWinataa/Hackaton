// Temporary bypass for Prisma in production
// Since we're using Supabase now, we can disable Prisma routes in production

import { NextResponse } from 'next/server';

export async function POST(req) {
	if (process.env.NODE_ENV === 'production') {
		return NextResponse.json({ 
			error: 'This endpoint is disabled in production. Please use Supabase authentication.' 
		}, { status: 503 });
	}

	// Import Prisma only in development
	const { prisma } = await import('@/lib/prisma');
	const { z } = await import('zod');
	const bcrypt = await import('bcrypt');
	const { signSession, setSessionCookie } = await import('@/lib/auth');

	const schema = z.object({
		email: z.string().email(),
		password: z.string().min(6),
	});

	try {
		const body = await req.json();
		const { email, password } = schema.parse(body);

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) return NextResponse.json({ error: 'Email atau password salah' }, { status: 400 });

		const ok = await bcrypt.compare(password, user.password);
		if (!ok) return NextResponse.json({ error: 'Email atau password salah' }, { status: 400 });

		const token = await signSession({ id: user.id, email: user.email, name: user.name });
		setSessionCookie(token);

		return NextResponse.json({
			ok: true,
			user: { id: user.id, email: user.email, name: user.name },
		});
	} catch (err) {
		const msg = err?.errors?.[0]?.message || err.message || 'Gagal login';
		return NextResponse.json({ error: msg }, { status: 400 });
	}
}

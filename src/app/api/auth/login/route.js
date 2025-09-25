import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { signSession, setSessionCookie } from '@/lib/auth';

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export async function POST(req) {
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

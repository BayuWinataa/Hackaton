// src/app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req) {
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

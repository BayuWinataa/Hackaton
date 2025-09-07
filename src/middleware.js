import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE = 'session';
const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret');

async function isAuthed(req) {
	const token = req.cookies.get(SESSION_COOKIE)?.value;
	if (!token) return false;
	try {
		await jwtVerify(token, secret);
		return true;
	} catch {
		return false;
	}
}

export async function middleware(req) {
	const { pathname, searchParams } = req.nextUrl;

	// Lindungi semua route dashboard
	if (pathname.startsWith('/dashboard')) {
		const ok = await isAuthed(req);
		if (!ok) {
			const url = new URL('/login', req.url);
			url.searchParams.set('next', pathname + (req.nextUrl.search || ''));
			return NextResponse.redirect(url);
		}
	}
	return NextResponse.next();
}

export const config = {
	matcher: ['/dashboard/:path*'],
};

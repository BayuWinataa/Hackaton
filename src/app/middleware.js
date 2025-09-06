// middleware.js
import { NextResponse } from 'next/server';

const PROTECTED = ['/dashboard'];

export function middleware(req) {
	const { pathname } = req.nextUrl;
	const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
	if (!isProtected) return NextResponse.next();

	const token = req.cookies.get('token')?.value;
	if (!token) {
		const url = req.nextUrl.clone();
		url.pathname = '/login';
		url.searchParams.set('from', pathname);
		return NextResponse.redirect(url);
	}
	return NextResponse.next();
}

export const config = {
	matcher: ['/dashboard/:path*'],
};

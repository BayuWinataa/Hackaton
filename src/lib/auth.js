import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'session';
const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret');

export async function signSession(payload) {
	return await new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('7d') 
		.sign(secret);
}

export async function verifySession(token) {
	try {
		const { payload } = await jwtVerify(token, secret);
		return payload;
	} catch {
		return null;
	}
}

export function setSessionCookie(token) {
	// hanya bisa dipanggil di ROUTE HANDLER (server)
	cookies().set({
		name: SESSION_COOKIE,
		value: token,
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		path: '/',
		maxAge: 60 * 60 * 24 * 7, // 7 hari
	});
}

export function clearSessionCookie() {
	cookies().set({
		name: SESSION_COOKIE,
		value: '',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		path: '/',
		maxAge: 0,
	});
}

export async function getSessionUser() {
	const token = cookies().get(SESSION_COOKIE)?.value;
	if (!token) return null;
	const payload = await verifySession(token);
	// payload kita taruh minimal id + email + name
	return payload || null;
}

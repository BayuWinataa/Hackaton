'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
	const router = useRouter();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [err, setErr] = useState(null);

	const onSubmit = async (e) => {
		e.preventDefault();
		setErr(null);
		setLoading(true);
		try {
			const res = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ name, email, password }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Register gagal');

			// demo: auto-login
			document.cookie = `token=${data.token}; path=/; max-age=86400`;
			router.replace('/dashboard');
		} catch (e) {
			setErr(e.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<h1 className="text-xl font-semibold mb-1">Daftar</h1>
			<p className="text-sm text-slate-500 mb-6">Buat akun baru untuk akses dashboard.</p>

			<form onSubmit={onSubmit} className="space-y-3">
				<div>
					<label className="text-sm font-medium">Nama</label>
					<input className="mt-1 w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-blue-200" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" required />
				</div>
				<div>
					<label className="text-sm font-medium">Email</label>
					<input type="email" className="mt-1 w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-blue-200" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
				</div>
				<div>
					<label className="text-sm font-medium">Password</label>
					<input type="password" className="mt-1 w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-blue-200" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
				</div>

				{err && <p className="text-sm text-red-600">{err}</p>}

				<button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-600 text-white py-2 hover:bg-blue-700 disabled:bg-blue-300">
					{loading ? 'Memproses...' : 'Buat Akun'}
				</button>
			</form>

			<div className="mt-4 text-sm">
				Sudah punya akun?{' '}
				<a className="text-blue-600 hover:underline" href="/login">
					Masuk
				</a>
			</div>
		</>
	);
}

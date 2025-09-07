'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
	const router = useRouter();
	const search = useSearchParams();
	const next = search.get('next') || '/dashboard';

	const [form, setForm] = useState({ email: '', password: '' });
	const [loading, setLoading] = useState(false);
	const [err, setErr] = useState('');

	const submit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setErr('');
		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Login gagal');
			router.replace(next);
		} catch (e) {
			setErr(e.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-sm mx-auto p-6">
			<h1 className="text-2xl font-bold">Masuk</h1>
			<form onSubmit={submit} className="mt-4 space-y-3">
				<input className="w-full border rounded px-3 py-2" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
				<input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
				{err && <div className="text-sm text-red-600">{err}</div>}
				<button disabled={loading} className="w-full bg-blue-600 text-white rounded py-2">
					{loading ? 'Memproses…' : 'Masuk'}
				</button>
				<p className="text-sm mt-2">
					Belum punya akun?{' '}
					<a href={`/register?next=${encodeURIComponent(next)}`} className="underline">
						Daftar
					</a>
				</p>
			</form>
		</div>
	);
}

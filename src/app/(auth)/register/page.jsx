// src/app/register/page.jsx
'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function RegisterPage() {
	const router = useRouter();
	const search = useSearchParams();
	const next = search.get('next') || '/dashboard';

	const [form, setForm] = useState({ email: '', password: '', name: '' });
	const [loading, setLoading] = useState(false);
	const [err, setErr] = useState('');

	const submit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setErr('');
		try {
			const res = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Register gagal');

			// ✅ Setelah register, minta user login dulu
			router.replace(`/login?next=${encodeURIComponent(next)}&email=${encodeURIComponent(form.email)}`);
		} catch (e) {
			setErr(e.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-sm mx-auto p-6">
			<h1 className="text-2xl font-bold">Daftar</h1>
			<form onSubmit={submit} className="mt-4 space-y-3">
				<input className="w-full border rounded px-3 py-2" placeholder="Nama (opsional)" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
				<input className="w-full border rounded px-3 py-2" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
				<input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
				{err && <div className="text-sm text-red-600">{err}</div>}
				<button disabled={loading} className="w-full bg-blue-600 text-white rounded py-2">
					{loading ? 'Memproses…' : 'Daftar'}
				</button>
				<p className="text-sm mt-2">
					Sudah punya akun?{' '}
					<a href={`/login?next=${encodeURIComponent(next)}`} className="underline">
						Masuk
					</a>
				</p>
			</form>
		</div>
	);
}

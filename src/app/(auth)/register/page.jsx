// src/app/register/page.jsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

			// ✅ setelah register, redirect ke login
			router.replace(`/login?next=${encodeURIComponent(next)}&email=${encodeURIComponent(form.email)}`);
		} catch (e) {
			setErr(e.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-muted/30 px-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader>
					<CardTitle className="text-center text-2xl font-bold">Daftar Akun</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={submit} className="space-y-4">
						<div className="space-y-1">
							<Label htmlFor="name">Nama</Label>
							<Input id="name" placeholder="Nama" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
						</div>

						<div className="space-y-1">
							<Label htmlFor="email">Email</Label>
							<Input id="email" type="email" placeholder="email@contoh.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
						</div>

						<div className="space-y-1">
							<Label htmlFor="password">Password</Label>
							<Input id="password" type="password" placeholder="********" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
						</div>

						{err && (
							<Alert variant="destructive">
								<AlertDescription>{err}</AlertDescription>
							</Alert>
						)}

						<Button type="submit" className="w-full" disabled={loading}>
							{loading ? 'Memproses…' : 'Daftar'}
						</Button>

						<p className="text-center text-sm text-muted-foreground">
							Sudah punya akun?{' '}
							<a href={`/login?next=${encodeURIComponent(next)}`} className="underline underline-offset-4 hover:text-primary">
								Masuk
							</a>
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

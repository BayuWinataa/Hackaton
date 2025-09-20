// src/app/(auth)/login/page.jsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
	const router = useRouter();
	const search = useSearchParams();
	const next = search.get('next') || '/dashboard';

	const [form, setForm] = useState({ email: '', password: '' });
	const [loading, setLoading] = useState(false);
	const [err, setErr] = useState('');
	const [showPw, setShowPw] = useState(false);

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
			setErr(e.message || 'Terjadi kesalahan');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full flex items-center justify-center ">
			<div className="w-full max-w-md">
				<Card className="border-border/60 shadow-lg ">
					<CardHeader className="space-y-1">
						<CardTitle className="text-center text-2xl font-semibold tracking-tight">Selamat datang </CardTitle>
					</CardHeader>

					<CardContent>
						<form onSubmit={submit} className="space-y-4" noValidate>
							{/* Email */}
							<div className="space-y-1.5">
								<Label htmlFor="email">Email</Label>
								<div className="relative">
									<Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
									<Input
										id="email"
										type="email"
										inputMode="email"
										autoComplete="email"
										placeholder="example@mail.com"
										className="pl-9"
										value={form.email}
										onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
										aria-invalid={!!err}
									/>
								</div>
							</div>

							{/* Password */}
							<div className="space-y-1.5">
								<Label htmlFor="password">Password</Label>
								<div className="relative">
									<Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
									<Input
										id="password"
										type={showPw ? 'text' : 'password'}
										autoComplete="current-password"
										placeholder="********"
										className="pl-9 pr-10"
										value={form.password}
										onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
										aria-invalid={!!err}
										aria-describedby={err ? 'form-error' : undefined}
									/>
									<Button type="button" variant="ghost" size="icon" className="absolute right-1.5 top-1/2 -translate-y-1/2" onClick={() => setShowPw((s) => !s)} aria-label={showPw ? 'Sembunyikan password' : 'Tampilkan password'}>
										{showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
									</Button>
								</div>
							</div>

							{/* Error */}
							{err && (
								<Alert id="form-error" variant="destructive" className="text-sm">
									<AlertDescription className="leading-relaxed">{err}</AlertDescription>
								</Alert>
							)}

							{/* Submit */}
							<Button type="submit" className="group w-full" disabled={loading}>
								{loading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin " />
										Memproses…
									</>
								) : (
									<>
										Masuk
										<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
									</>
								)}
							</Button>

							{/* Divider + Links */}
							<div className="space-y-3 pt-1">
								<Separator />
								<div className="text-center text-sm text-muted-foreground">
									Belum punya akun?{' '}
									<Link href={`/register?next=${encodeURIComponent(next)}`} className="font-medium text-primary underline underline-offset-4 hover:opacity-90">
										Daftar
									</Link>
								</div>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

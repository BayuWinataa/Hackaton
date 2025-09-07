// src/app/page.jsx
'use client';

import Link from 'next/link';
import { Sparkles, MessageSquare, ShoppingCart, Rocket, Shield, Wand2, Bot, FileUp, CheckCircle2, ArrowRight, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

/** Landing page minimalis + smooth pastel + fokus ke keunggulan AI */
export default function LandingPage() {
	return (
		<div className="relative min-h-screen overflow-x-clip bg-gradient-to-b from-slate-50 via-white to-white">
			<Decor />

			{/* HERO */}
			<section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
				<div className="mx-auto max-w-5xl text-center">
					<div className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur">
						<Sparkles className="h-3.5 w-3.5 text-blue-600" />
						ShopMate AI — Belanja dibantu AI, cepat & akurat
					</div>

					<h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-slate-900">
						Belanja <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">lebih cerdas</span> bersama AI
					</h1>

					<p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 md:text-lg">
						Jelajahi produk, minta rekomendasi personal, bandingkan instan, dan checkout tanpa ribet. Kini hadir <strong>Invoice IQ</strong>: upload invoice & tanyakan apa saja—AI jawab instan.
					</p>

					<div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
						<Button asChild size="lg" className="font-semibold">
							<Link href="/products">
								Jelajahi Produk <ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
						<Button asChild size="lg" variant="outline" className="font-semibold">
							<Link href="/chat">
								<MessageSquare className="mr-2 h-4 w-4" />
								Chat dengan AI
							</Link>
						</Button>
					</div>

					{/* Preview strip */}
					<div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<HeroCard icon={<ShoppingCart className="h-5 w-5" />} title="Keranjang Pintar" desc="Tambah produk, simpan otomatis, dan guard login sebelum checkout (opsional)." />
						<HeroCard icon={<Wand2 className="h-5 w-5" />} title="Rekomendasi AI" desc="Tanya via chat & dapatkan saran personal sesuai preferensi." />
						<HeroCard icon={<Rocket className="h-5 w-5" />} title="Checkout & Riwayat" desc="Selesaikan pesanan, arsipkan riwayat, siap terhubung DB." />
					</div>
				</div>
			</section>

			<Separator className="opacity-50" />

			{/* KEUNGGULAN AI */}
			<section className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
				<div className="mx-auto max-w-4xl text-center">
					<Badge variant="secondary" className="mb-2">
						KEUNGGULAN AI
					</Badge>
					<h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Kenapa AI kami beda?</h2>
					<p className="mt-2 text-slate-600">Bukan sekadar chatbot — AI kami paham konteks belanja & kebiasaanmu.</p>
				</div>

				<div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
					<Adv icon={<Bot className="h-5 w-5" />} title="Personalized by context" desc="Jawaban menyesuaikan preferensi, budget, & kategori yang sering kamu lihat." />
					<Adv icon={<Gauge className="h-5 w-5" />} title="Cepat & relevan" desc="Rekomendasi ringkas, fokus ke value nyata: performa, garansi, harga terbaik." />
					<Adv icon={<Wand2 className="h-5 w-5" />} title="Instan compare" desc="Bandingkan 2 produk dalam dialog debat AI yang jelas plus-minusnya." />
					<Adv icon={<MessageSquare className="h-5 w-5" />} title="Explainable" desc="AI menyebutkan alasan di balik saran—lebih transparan & mudah dipercaya." />
					<Adv icon={<Shield className="h-5 w-5" />} title="Privacy-first" desc="Data belanja & invoice diproses aman, bisa disimpan lokal/DB pilihanmu." />
					<Adv icon={<Rocket className="h-5 w-5" />} title="Selaras dengan alur belanja" desc="Terhubung ke katalog, keranjang, checkout, & riwayat — pengalaman mulus." />
				</div>
			</section>

			{/* FITUR INTI */}
			<section className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
				<div className="mx-auto max-w-4xl text-center">
					<Badge variant="secondary" className="mb-2">
						FITUR
					</Badge>
					<h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Semua dalam satu tempat</h2>
					<p className="mt-2 text-slate-600">Modern UI, performa cepat, siap dihubungkan ke DB nyata (SQLite/MySQL/Supabase).</p>
				</div>

				<div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
					<Feature icon={<Bot className="h-5 w-5" />} title="Chat AI Rekomendasi" desc="Tanya spesifikasi, minta alternatif, atau rekomendasi by budget." />
					<Feature icon={<ShoppingCart className="h-5 w-5" />} title="Cart + Guard Login" desc="Atur kebijakan tambah/cart/checkout hanya untuk user login." />
					<Feature icon={<Shield className="h-5 w-5" />} title="Session & Auth" desc="Register, login, redirect aman, proteksi dashboard." />
					<Feature icon={<Rocket className="h-5 w-5" />} title="Checkout & Riwayat" desc="Selesaikan pesanan dan arsipkan ke dashboard user." />
					<Feature icon={<Wand2 className="h-5 w-5" />} title="Debat Produk AI" desc="Pilih 2 produk, AI membuat analisa side-by-side." />
					<Feature icon={<MessageSquare className="h-5 w-5" />} title="Q&A di Detail Produk" desc="Dari halaman produk, langsung tanya AI tentang item itu." />
				</div>
			</section>

			{/* INVOICE IQ */}
			<section className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-14">
				<div className="mx-auto max-w-5xl rounded-3xl border bg-white/70 p-6 shadow-sm backdrop-blur md:p-9">
					<div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
						<div className="max-w-2xl">
							<div className="inline-flex items-center gap-2 rounded-full bg-purple-600/10 px-3 py-1 text-xs font-semibold text-purple-700 ring-1 ring-purple-600/20">
								<FileUp className="h-3.5 w-3.5" />
								Fitur baru
							</div>
							<h3 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
								<span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Invoice IQ</span> — Upload & Tanya Apa Saja
							</h3>
							<p className="mt-2 text-slate-600">
								Unggah <strong>gambar/PDF invoice</strong>, tanya total/PPN/item/tanggal atau bandingkan antar invoice. AI mengekstrak dan merangkum info kunci untukmu.
							</p>

							<ul className="mt-4 grid gap-2 text-sm text-slate-700">
								<Li>OCR invoice (gambar/PDF)</Li>
								<Li>Q&A kontekstual (harga, pajak, item, tanggal)</Li>
								<Li>Jejak audit + simpan ke database</Li>
							</ul>

							<div className="mt-5 flex flex-wrap items-center gap-3">
								<Button asChild>
									<Link href="/invoices">Coba Invoice IQ</Link>
								</Button>
								<Button asChild variant="outline">
									<Link href="/dashboard">Lihat di Dashboard</Link>
								</Button>
							</div>
						</div>

						{/* Mock preview */}
						<Card className="w-full max-w-md bg-gradient-to-br from-indigo-50 to-purple-50">
							<CardContent className="p-4">
								<div className="rounded-xl border bg-white p-4 text-xs text-slate-700">
									<div className="mb-2 flex items-center justify-between">
										<span className="font-semibold">invoice_2309.pdf</span>
										<span className="rounded bg-slate-100 px-2 py-0.5">72 KB</span>
									</div>
									<div className="rounded-lg border bg-slate-50 p-3">
										<p className="font-medium">AI Insight</p>
										<p className="mt-1 text-slate-600">
											Total: <strong>Rp 1.950.000</strong> (termasuk PPN). Item terbesar: <strong>Headphone Pro</strong> (Rp 1.500.000). Pembayaran: <strong>QRIS</strong>. Jatuh tempo: <strong>7 hari</strong>.
										</p>
									</div>
									<div className="mt-3 flex items-center justify-between">
										<span className="text-slate-500">Butuh detail lain?</span>
										<Link href="/invoices" className="text-indigo-600 hover:underline inline-flex items-center">
											Tanyakan ke AI <ArrowRight className="ml-1 h-3.5 w-3.5" />
										</Link>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			<Separator className="opacity-50" />

			{/* ALUR */}
			<section className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
				<div className="mx-auto max-w-4xl text-center">
					<Badge variant="secondary" className="mb-2">
						ALUR
					</Badge>
					<h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Cara kerja yang simpel ✨</h2>
				</div>

				<div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
					<Step num="01" title="Temukan & Pilih" desc="Jelajahi produk, gunakan filter/sort, klik kartu untuk detail." />
					<Step num="02" title="Chat & Bandingkan" desc="Tanya AI, atau debatkan 2 produk untuk putusan cepat." />
					<Step num="03" title="Checkout & Arsip" desc="Selesaikan pesanan, simpan invoice, kelola di dashboard." />
				</div>

				<div className="mt-10 flex items-center justify-center gap-3">
					<Button asChild className="font-semibold">
						<Link href="/products">Mulai Belanja</Link>
					</Button>
					<Button asChild variant="outline" className="font-semibold">
						<Link href="/login">Masuk / Daftar</Link>
					</Button>
				</div>
			</section>

			<Separator className="opacity-50" />

			{/* CTA */}
			<section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="mx-auto max-w-4xl rounded-3xl border bg-white/70 p-8 text-center shadow-sm backdrop-blur">
					<h3 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
						Siap belanja dengan <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ShopMate AI</span>?
					</h3>
					<p className="mx-auto mt-2 max-w-xl text-slate-600">Coba sekarang dan rasakan belanja yang cepat, akurat, dan menyenangkan. AI yang paham kebutuhanmu.</p>
					<div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
						<Button asChild size="lg" className="font-semibold">
							<Link href="/products">
								Lihat Katalog <ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
						<Button asChild size="lg" variant="outline" className="font-semibold">
							<Link href="/invoices">Coba Invoice IQ</Link>
						</Button>
					</div>
					<p className="mt-3 text-xs text-slate-500">Proteksi data • Session aman • Siap integrasi DB (SQLite/MySQL/Supabase)</p>
				</div>
			</section>
		</div>
	);
}

/* ---------- tiny components ---------- */

function HeroCard({ icon, title, desc }) {
	return (
		<Card className="border-transparent bg-white/70 shadow-sm ring-1 ring-black/5 backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-md">
			<CardContent className="p-5">
				<div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/10 text-blue-700 ring-1 ring-blue-600/20">{icon}</div>
				<h3 className="mt-3 text-base font-semibold">{title}</h3>
				<p className="mt-1 text-sm text-slate-600">{desc}</p>
			</CardContent>
		</Card>
	);
}
function Feature({ icon, title, desc }) {
	return (
		<div className="rounded-2xl border bg-white/70 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur transition-all hover:shadow-md">
			<div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">{icon}</div>
			<h3 className="mt-3 text-base font-semibold">{title}</h3>
			<p className="mt-1 text-sm text-slate-600">{desc}</p>
		</div>
	);
}
function Adv({ icon, title, desc }) {
	return (
		<div className="rounded-2xl border bg-white/70 p-5 ring-1 ring-black/5 backdrop-blur">
			<div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">{icon}</div>
			<h3 className="mt-3 text-base font-semibold">{title}</h3>
			<p className="mt-1 text-sm text-slate-600">{desc}</p>
		</div>
	);
}
function Step({ num, title, desc }) {
	return (
		<div className="rounded-2xl border bg-white/70 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
			<div className="text-xs font-bold tracking-widest text-slate-500">{num}</div>
			<h4 className="mt-1 text-lg font-semibold">{title}</h4>
			<p className="mt-1 text-sm text-slate-600">{desc}</p>
		</div>
	);
}
function Li({ children }) {
	return (
		<li className="inline-flex items-center gap-2">
			<CheckCircle2 className="h-4 w-4 text-green-600" /> {children}
		</li>
	);
}

/* ---------- decorative background ---------- */
function Decor() {
	return (
		<>
			<div
				aria-hidden
				className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[1200px] -translate-x-1/2 rounded-full blur-3xl opacity-30"
				style={{ background: 'radial-gradient(closest-side, rgba(59,130,246,.28), transparent 60%), radial-gradient(closest-side, rgba(99,102,241,.28), transparent 60%)' }}
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute top-56 right-[-20%] h-[420px] w-[420px] rounded-full blur-3xl opacity-25"
				style={{ background: 'radial-gradient(closest-side, rgba(147,51,234,.25), transparent 60%), radial-gradient(closest-side, rgba(59,130,246,.22), transparent 60%)' }}
			/>
		</>
	);
}

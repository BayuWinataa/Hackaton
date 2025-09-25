// src/app/page.jsx
'use client';

import Link from 'next/link';
import { Sparkles, MessageSquare, ShoppingCart, Rocket, Shield, Wand2, Bot, CheckCircle2, ArrowRight, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

/**
 * Landing page: refined copy (Bahasa), no image/PDF upload wording,
 * smoother pastel look, improved a11y & consistent spacing.
 */
export default function LandingPage() {
	return (
		<div className="relative min-h-screen overflow-x-clip bg-gradient-to-b from-slate-50 via-white to-white text-slate-900">
			<Decor />

			{/* HERO */}
			<section aria-labelledby="hero-title" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
				<div className="mx-auto max-w-5xl text-center">
					<div className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur supports-[backdrop-filter]:backdrop-blur">
						<Sparkles className="h-3.5 w-3.5 text-blue-600" aria-hidden />
						ShopMate AI — belanja dibantu AI, cepat & akurat
					</div>

					<h1 id="hero-title" className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
						Belanja <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">lebih cerdas</span> bersama AI
					</h1>

					<p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 md:text-lg">
						Jelajahi katalog, minta rekomendasi personal dan bandingkan produk secara instan, . Kini hadir <strong>Invoice IQ</strong>: tanya apa pun tentang invoice AI menjawab seketika.
					</p>

					<div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
						<Button asChild size="lg" className="font-semibold focus-visible:ring-2 focus-visible:ring-blue-600">
							<Link href="/products" aria-label="Jelajahi Produk">
								Jelajahi Produk <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
							</Link>
						</Button>
						<Button asChild size="lg" variant="outline" className="font-semibold focus-visible:ring-2 focus-visible:ring-slate-400">
							<Link href="/chat" aria-label="Chat dengan AI">
								<MessageSquare className="mr-2 h-4 w-4" aria-hidden />
								Chat dengan AI
							</Link>
						</Button>
					</div>
				</div>
			</section>

			<Separator className="opacity-50" />

			{/* KEUNGGULAN AI */}
			<section aria-labelledby="adv-title" className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
				<div className="mx-auto max-w-4xl text-center">
					<Badge variant="secondary" className="mb-2">
						KEUNGGULAN AI
					</Badge>
					<h2 id="adv-title" className="text-3xl md:text-4xl font-bold tracking-tight">
						Kenapa AI kami berbeda?
					</h2>
					<p className="mt-2 text-slate-600">Bukan sekadar chatbot AI, kami paham konteks belanja & kebiasaanmu.</p>
				</div>

				<div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
					<Adv icon={<Bot className="h-5 w-5" aria-hidden />} title="Personalized by context" desc="Jawaban menyesuaikan preferensi, budget, & kategori yang sering kamu lihat." />
					<Adv icon={<Gauge className="h-5 w-5" aria-hidden />} title="Cepat & relevan" desc="Rekomendasi ringkas, fokus ke value nyata: performa, garansi, harga terbaik." />
					<Adv icon={<Wand2 className="h-5 w-5" aria-hidden />} title="Instan compare" desc="Bandingkan dua produk dalam dialog debat AI yang jelas plus-minusnya." />
					<Adv icon={<MessageSquare className="h-5 w-5" aria-hidden />} title="Explainable" desc="AI menyebutkan alasan di balik saran transparan & mudah dipercaya." />
					<Adv icon={<Shield className="h-5 w-5" aria-hidden />} title="AI yang Aman" desc="AI memproses data belanja & invoice secara terlindungi." />
					<Adv icon={<Rocket className="h-5 w-5" aria-hidden />} title="Menyatu dengan alur belanja" desc="Terhubung ke katalog, keranjang, checkout, & riwayat belanja." />
				</div>
			</section>

			{/* INVOICE IQ  */}
			<section aria-labelledby="invoice-iq" className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-14">
				<div className="mx-auto max-w-5xl rounded-3xl border bg-white/70 p-6 shadow-sm backdrop-blur supports-[backdrop-filter]:backdrop-blur md:p-9">
					<div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
						<div className="max-w-2xl">
							<div className="inline-flex items-center gap-2 rounded-full bg-purple-600/10 px-3 py-1 text-xs font-semibold text-purple-700 ring-1 ring-purple-600/20">
								{/* decorative dot */}
								<span className="h-1.5 w-1.5 rounded-full bg-purple-700" aria-hidden />
								Fitur baru
							</div>
							<h3 id="invoice-iq" className="mt-3 text-2xl md:text-3xl font-bold tracking-tight">
								<span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Invoice IQ</span> — Tanyai Invoice, Jawab Instan
							</h3>
							<p className="mt-2 text-slate-600">Ingin mendapatkan insight dari pembelian anda, atau ingin sekedar meminta rekomendasi dari barang yang telah anda pesan sebelumnya?.</p>

							<ul className="mt-4 grid gap-2 text-sm text-slate-700">
								<Li>Chatbot AI membaca detail pemesanan yang sudah anda beli</Li>
								<Li>Bisa ditanya ulang soal item, harga, atau tanggal pesanan</Li>
								<Li>Minta rekomendasi barang dari pemesanan anda sebelumnya</Li>
							</ul>

							<div className="mt-5 flex flex-wrap items-center gap-3">
								<Button asChild className="focus-visible:ring-2 focus-visible:ring-purple-600">
									<Link href="/dashboard/orders">Coba Invoice IQ</Link>
								</Button>
							</div>
						</div>

						{/* Mock preview (no file upload wording) */}
						<Card className="w-full max-w-md bg-gradient-to-br from-indigo-50 to-purple-50">
							<CardContent className="p-4">
								<div className="rounded-xl border bg-white p-4 text-xs text-slate-700">
									<div className="mb-2 flex items-center justify-between">
										<span className="font-semibold">INV-2309</span>
										<span className="rounded bg-slate-100 px-2 py-0.5">Tersimpan</span>
									</div>
									<div className="rounded-lg border bg-slate-50 p-3">
										<p className="font-medium">AI Insight</p>
										<p className="mt-1 text-slate-600">
											Total: <strong>Rp 1.950.000</strong>. Item terbesar: <strong>Headphone Pro</strong> (Rp 1.500.000). Metode: <strong>QRIS</strong>.
										</p>
									</div>
									<div className="mt-3 flex justify-end text-sm font-medium  ">
										Tanya AI <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			<Separator className="opacity-50" />

			{/* ALUR */}
			<section aria-labelledby="flow-title" className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
				<div className="mx-auto max-w-4xl text-center">
					<Badge variant="secondary" className="mb-2">
						ALUR
					</Badge>
					<h2 id="flow-title" className="text-3xl md:text-4xl font-bold tracking-tight">
						Cara kerja yang simpel ✨
					</h2>
				</div>

				<div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
					<Step num="01" title="Temukan & Pilih" desc="Cari produk dengan mudah, gunakan filter atau sort, lalu lihat detail spesifikasinya." />
					<Step num="02" title="Chat & Bandingkan" desc="Tanya AI untuk rekomendasi, atau bandingkan dua produk secara instan." />
					<Step num="03" title="Checkout" desc="Selesaikan pesanan dengan proses yang cepat dan aman." />
					<Step num="04" title="Invoice IQ" desc="Dapatkan insight cerdas dari riwayat pembelianmu." />
				</div>
			</section>

			<Separator className="opacity-50" />

			{/* CTA */}
			<section aria-labelledby="cta-title" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="mx-auto max-w-4xl rounded-3xl border bg-white/70 p-8 text-center shadow-sm backdrop-blur supports-[backdrop-filter]:backdrop-blur">
					<h3 id="cta-title" className="text-2xl md:text-3xl font-bold tracking-tight">
						Siap belanja dengan <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ShopMate AI</span>?
					</h3>
					<p className="mx-auto mt-2 max-w-xl text-slate-600">Coba sekarang dan rasakan belanja yang cepat, akurat, dan menyenangkan. AI yang paham kebutuhanmu.</p>
					<div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
						<Button asChild size="lg" className="font-semibold focus-visible:ring-2 focus-visible:ring-blue-600">
							<Link href="/products">
								Lihat Katalog <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
							</Link>
						</Button>
					</div>
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
			<CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden /> {children}
		</li>
	);
}

/* ---------- decorative background ---------- */
function Decor() {
	return (
		<>
			<div
				aria-hidden
				className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[1200px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
				style={{
					background: 'radial-gradient(closest-side, rgba(59,130,246,.28), transparent 60%), radial-gradient(closest-side, rgba(99,102,241,.28), transparent 60%)',
				}}
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute top-56 right-[-20%] h-[420px] w-[420px] rounded-full opacity-25 blur-3xl"
				style={{
					background: 'radial-gradient(closest-side, rgba(147,51,234,.25), transparent 60%), radial-gradient(closest-side, rgba(59,130,246,.22), transparent 60%)',
				}}
			/>
		</>
	);
}

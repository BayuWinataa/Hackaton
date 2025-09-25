'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useDeferredValue, useMemo, useState } from 'react';
import products from '@/../products.json';
import fallbackImg from '@/app/assets/kobo.jpg';
import { MessageSquare, Sparkles, Filter as FilterIcon, SlidersHorizontal } from 'lucide-react';

// shadcn/ui
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function Products() {
	// state
	const [query, setQuery] = useState('');
	const [category, setCategory] = useState('semua');
	const [sortBy, setSortBy] = useState('terkini');

	// bikin search smooth
	const qDeferred = useDeferredValue(query);

	// derive categories + quick filters
	const categories = useMemo(() => {
		const set = new Set((products || []).map((p) => p.kategori).filter(Boolean));
		return ['semua', ...Array.from(set)];
	}, []);

	// quick tags dari seluruh produk (maks 10 unik)
	const topTags = useMemo(() => {
		const bag = new Map();
		(products || []).forEach((p) => (p.tags || []).forEach((t) => bag.set(t, (bag.get(t) || 0) + 1)));
		return [...bag.entries()]
			.sort((a, b) => b[1] - a[1])
			.slice(0, 10)
			.map(([t]) => t);
	}, []);

	const filtered = useMemo(() => {
		const list = (products || []).filter((p) => {
			const nama = (p.nama || '').toLowerCase();
			const kat = (p.kategori || '').toLowerCase();
			const q = (qDeferred || '').toLowerCase();
			const inText = q ? nama.includes(q) || kat.includes(q) : true;
			const inCat = category === 'semua' ? true : p.kategori === category;
			return inText && inCat;
		});

		const arr = [...list];
		if (sortBy === 'termurah') arr.sort((a, b) => (a.harga || 0) - (b.harga || 0));
		if (sortBy === 'termahal') arr.sort((a, b) => (b.harga || 0) - (a.harga || 0));
		if (sortBy === 'az') arr.sort((a, b) => String(a.nama).localeCompare(String(b.nama)));
		if (sortBy === 'za') arr.sort((a, b) => String(b.nama).localeCompare(String(a.nama)));
		// "terkini" default: as-is (anggap urutan di JSON sudah cukup)
		return arr;
	}, [qDeferred, category, sortBy]);

	const formatIDR = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number.isFinite(n) ? n : 0);

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
			{/* Hero */}
			<section className="relative">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
					<div className="relative overflow-hidden rounded-3xl border bg-[radial-gradient(80%_120%_at_0%_0%,rgba(59,130,246,0.18),rgba(99,102,241,0.22)_40%,rgba(147,51,234,0.18)_80%)]">
						<div className="absolute inset-0 -z-10 blur-2xl opacity-80" />
						<div className="p-8 md:p-12 text-slate-900">
							<div className="mx-auto max-w-3xl text-center">
								<div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 ring-1 ring-black/5">
									<Sparkles className="h-5 w-5 text-indigo-600" />
								</div>
								<h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
									Belanja <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">lebih smart</span> dengan AI
								</h1>
								<p className="mt-4 text-slate-600 text-lg">Filter cepat, rekomendasi pintar, dan detail produk yang rapi. Kamu fokus pilih yang cocok, AI bantu sisanya.</p>
								<div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
									<Button asChild size="lg" className="font-semibold">
										<Link href="/chat" className="inline-flex items-center gap-2">
											<MessageSquare className="h-5 w-5" /> Tanya AI Sekarang
										</Link>
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Toolbar desktop */}
			<div className="hidden md:block border-y bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between gap-4">
						<div className="flex items-center gap-3 flex-1 max-w-3xl">
							<Input placeholder="Cari produk atau kategori…" value={query} onChange={(e) => setQuery(e.target.value)} className="h-10" />
							<Select value={category} onValueChange={setCategory}>
								<SelectTrigger className="w-[180px] h-10">
									<SelectValue placeholder="Kategori" />
								</SelectTrigger>
								<SelectContent>
									{categories.map((c) => (
										<SelectItem key={c} value={c} className="capitalize">
											{c}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Select value={sortBy} onValueChange={setSortBy}>
								<SelectTrigger className="w-[200px] h-10">
									<SelectValue placeholder="Urutkan" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="terkini">Terbaru</SelectItem>
									<SelectItem value="termurah">Harga: Termurah</SelectItem>
									<SelectItem value="termahal">Harga: Termahal</SelectItem>
									<SelectItem value="az">Nama: A–Z</SelectItem>
									<SelectItem value="za">Nama: Z–A</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="text-sm text-muted-foreground whitespace-nowrap">{filtered.length} produk</div>
					</div>
				</div>
			</div>

			{/* Quick filters tag (horizontal scroll) */}
			{topTags.length > 0 && (
				<div className="border-b">
					<div className="container mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
							<span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
								<SlidersHorizontal className="h-4 w-4" />
								Quick Tags:
							</span>
							{topTags.map((t) => (
								<button key={t} onClick={() => setQuery(t)} className="rounded-full border px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 active:scale-95 transition">
									#{t}
								</button>
							))}
						</div>
					</div>
				</div>
			)}

			{/* Toolbar mobile */}
			<div className="md:hidden border-b bg-background/80">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
					<div className="flex items-center justify-between">
						<Input placeholder="Cari produk…" value={query} onChange={(e) => setQuery(e.target.value)} className="h-9" />
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="outline" size="sm" className="ml-2 inline-flex items-center gap-2">
									<FilterIcon className="h-4 w-4" /> Filter
								</Button>
							</SheetTrigger>
							<SheetContent side="right" className="w-[320px] sm:w-[380px]">
								<SheetHeader>
									<SheetTitle>Filter & Pencarian</SheetTitle>
								</SheetHeader>
								<div className="mt-4 space-y-3">
									<div className="grid grid-cols-2 gap-3">
										<Select value={category} onValueChange={setCategory}>
											<SelectTrigger>
												<SelectValue placeholder="Kategori" />
											</SelectTrigger>
											<SelectContent>
												{categories.map((c) => (
													<SelectItem key={c} value={c}>
														{c}
													</SelectItem>
												))}
											</SelectContent>
										</Select>

										<Select value={sortBy} onValueChange={setSortBy}>
											<SelectTrigger>
												<SelectValue placeholder="Urutkan" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="terkini">Terbaru</SelectItem>
												<SelectItem value="termurah">Termurah</SelectItem>
												<SelectItem value="termahal">Termahal</SelectItem>
												<SelectItem value="az">A–Z</SelectItem>
												<SelectItem value="za">Z–A</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<FilterIcon className="h-4 w-4" />
										<span>{filtered.length} produk</span>
									</div>

									<Button asChild className="w-full">
										<Link href="/chat" className="inline-flex items-center gap-2">
											<MessageSquare className="h-4 w-4" /> Tanya rekomendasi AI
										</Link>
									</Button>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>

			{/* Product Grid */}
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
				<h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">Produk Pilihan</h2>
				<p className="mt-1 text-sm text-muted-foreground">Kurasi terbaik dari katalog kami. Gunakan filter untuk hasil yang lebih presisi.</p>
				<Separator className="my-6" />

				{filtered.length === 0 ? (
					<EmptyState />
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{filtered.map((product, idx) => {
							const img = product.gambar || product.image || fallbackImg;
							const showTags = (product.tags || []).slice(0, 2);
							

							return (
								<Link
									key={product.id}
									href={`/products/${product.id}`}
									className="group relative block overflow-hidden rounded-3xl border bg-white/60 backdrop-blur ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-12px_rgba(59,130,246,0.35)] hover:ring-blue-500/30"
									aria-label={`Lihat ${product.nama}`}
								>
									{/* glow ring */}
									<span className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100" style={{ boxShadow: 'inset 0 0 0 1px rgba(59,130,246,0.25)' }} />

									{/* Media */}
									<div className="relative aspect-[4/3] w-full overflow-hidden">
										<Image
											src={img}
											alt={product.nama}
											fill
											className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.05]"
											sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
											priority={idx < 4}
										/>
										{/* Chip kategori / new */}
										<div className="absolute left-3 top-3 flex items-center gap-2">
											{product.kategori && <span className="rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-black/10 backdrop-blur capitalize">{product.kategori}</span>}
										</div>
									</div>

									{/* Meta */}
									<div className="p-4">
										<h3 className="line-clamp-1 text-base md:text-lg font-semibold tracking-tight text-slate-900">{product.nama}</h3>

										{/* tags kecil */}
										{showTags.length > 0 && (
											<div className="mt-1 flex flex-wrap gap-1.5">
												{showTags.map((t) => (
													<Badge key={t} variant="outline" className="rounded-full px-2 py-0 text-[10px]">
														#{t}
													</Badge>
												))}
											</div>
										)}

										<div className="mt-3 flex items-center justify-between">
											<span className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-sm font-extrabold text-white shadow-sm">{formatIDR(product.harga)}</span>
										</div>
									</div>
								</Link>
							);
						})}
					</div>
				)}
			</main>
		</div>
	);
}

function EmptyState() {
	return (
		<div className="flex flex-col items-center justify-center rounded-2xl border bg-card p-10 text-center">
			<div className="rounded-full bg-blue-50 p-3">
				<Sparkles className="h-6 w-6 text-blue-600" />
			</div>
			<h3 className="mt-4 text-lg font-semibold">Belum ada hasil</h3>
			<p className="mt-1 max-w-md text-sm text-muted-foreground">Coba ubah kata kunci, kategori, atau pakai quick tags di atas. Kamu juga bisa bertanya ke AI untuk rekomendasi yang pas.</p>
			<Button asChild className="mt-4">
				<Link href="/chat" className="inline-flex items-center gap-2">
					<MessageSquare className="h-4 w-4" /> Tanya AI Sekarang
				</Link>
			</Button>
		</div>
	);
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import products from '@/../products.json';
import fallbackImg from '@/app/assets/kobo.jpg';
import { MessageSquare, Menu, Sparkles, Filter } from 'lucide-react';

// shadcn/ui components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

// Cart
import CartButton from '@/components/cart/CartButton';

export default function HomePage() {
	const [query, setQuery] = useState('');
	const [category, setCategory] = useState('semua');
	const [sortBy, setSortBy] = useState('terkini');

	const categories = useMemo(() => {
		const set = new Set((products || []).map((p) => p.kategori).filter(Boolean));
		return ['semua', ...Array.from(set)];
	}, []);

	const filtered = useMemo(() => {
		const list = (products || []).filter((p) => {
			const nama = (p.nama || '').toLowerCase();
			const kat = (p.kategori || '').toLowerCase();
			const matchQuery = query ? nama.includes(query.toLowerCase()) || kat.includes(query.toLowerCase()) : true;
			const matchCat = category === 'semua' ? true : p.kategori === category;
			return matchQuery && matchCat;
		});

		const arr = [...list];
		if (sortBy === 'termurah') arr.sort((a, b) => (a.harga || 0) - (b.harga || 0));
		if (sortBy === 'termahal') arr.sort((a, b) => (b.harga || 0) - (a.harga || 0));
		if (sortBy === 'az') arr.sort((a, b) => String(a.nama).localeCompare(String(b.nama)));
		if (sortBy === 'za') arr.sort((a, b) => String(b.nama).localeCompare(String(a.nama)));
		return arr;
	}, [query, category, sortBy]);

	const formatIDR = (n) =>
		new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			maximumFractionDigits: 0,
		}).format(Number.isFinite(n) ? n : 0);

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
			{/* Header */}
			<header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						{/* Left: Brand */}
						<div className="flex items-center gap-2">
							<Sparkles className="h-6 w-6 text-blue-600" />
							<Link href="/" className="text-xl font-extrabold tracking-tight">
								ShopMate
							</Link>
							<Badge variant="secondary" className="hidden md:inline-flex">
								AI
							</Badge>
						</div>

						{/* Right: Actions */}
						<div className="flex items-center gap-2">
							<Button asChild className="hidden sm:inline-flex">
								<Link href="/chat" className="inline-flex items-center gap-2">
									<MessageSquare className="h-4 w-4" /> Mulai Chat AI
								</Link>
							</Button>

							{/* Keranjang terhubung context */}
							<CartButton />

							{/* Mobile menu */}
							<Sheet>
								<SheetTrigger asChild>
									<Button variant="ghost" size="icon" className="md:hidden" aria-label="Buka menu">
										<Menu className="h-5 w-5" />
									</Button>
								</SheetTrigger>
								<SheetContent side="right" className="w-[320px] sm:w-[380px]">
									<SheetHeader>
										<SheetTitle>Filter & Pencarian</SheetTitle>
									</SheetHeader>
									<div className="mt-4 space-y-3">
										<Input placeholder="Cari produk..." value={query} onChange={(e) => setQuery(e.target.value)} />
										<div className="grid grid-cols-2 gap-3">
											<Select value={category} onValueChange={setCategory}>
												<SelectTrigger>
													<SelectValue placeholder="Kategori" />
												</SelectTrigger>
												<SelectContent>
													{categories.map((c) => (
														<SelectItem key={c} value={c}>
															{c[0].toUpperCase() + c.slice(1)}
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
											<Filter className="h-4 w-4" />
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
			</header>

			{/* Hero */}
			<section className="relative">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
					<div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-12 text-white shadow-lg">
						<div className="mx-auto max-w-3xl text-center">
							<h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
								Temukan Produk Impian dengan <span className="underline decoration-white/40 underline-offset-4">Bantuan AI</span>
							</h1>
							<p className="mt-4 text-white/90 text-lg">Jelajahi katalog kami, filter cepat, dan konsultasi dengan asisten AI untuk rekomendasi yang pas.</p>
							<div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
								<Button asChild size="lg" variant="secondary" className="font-semibold">
									<Link href="/chat">Mulai Chat dengan AI</Link>
								</Button>
								<Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
									Lihat Produk Unggulan
								</Button>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Toolbar (desktop sticky under header) */}
			<div className="sticky top-16 z-30 hidden md:block border-b bg-background/80 backdrop-blur">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex h-14 items-center justify-between gap-4">
						<div className="flex items-center gap-3 flex-1 max-w-2xl">
							<Input placeholder="Cari produk, kategori..." value={query} onChange={(e) => setQuery(e.target.value)} />
							<Select value={category} onValueChange={setCategory}>
								<SelectTrigger className="w-[160px]">
									<SelectValue placeholder="Kategori" />
								</SelectTrigger>
								<SelectContent>
									{categories.map((c) => (
										<SelectItem key={c} value={c}>
											{c[0].toUpperCase() + c.slice(1)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Select value={sortBy} onValueChange={setSortBy}>
								<SelectTrigger className="w-[180px]">
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
						<div className="text-sm text-muted-foreground whitespace-nowrap">{filtered.length} produk ditemukan</div>
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
						{filtered.map((product, idx) => (
							<Card key={product.id} className="group overflow-hidden hover:shadow-xl transition-all">
								<div className="relative aspect-[4/3] w-full overflow-hidden">
									<Image
										src={product.image || fallbackImg}
										alt={product.nama}
										fill
										className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
										sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
										priority={idx < 4}
									/>
								</div>
								<CardHeader className="pb-2">
									<CardTitle className="truncate text-base md:text-lg">{product.nama}</CardTitle>
								</CardHeader>
								<CardContent className="pt-0">
									<div className="flex items-center justify-between">
										<div className="space-y-1">
											<p className="text-sm text-muted-foreground">{product.kategori}</p>
											<p className="text-xl font-bold text-blue-600">{formatIDR(product.harga)}</p>
										</div>
										<div className="flex items-center gap-2">
											<Badge variant="outline">Baru</Badge>
											<Button asChild variant="secondary" size="sm">
												<Link href={`/products/${product.id}`}>Detail</Link>
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</main>

			{/* Footer */}
			<footer className="border-t py-8">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
					<p>© {new Date().getFullYear()} ShopMate AI — Dibuat untuk Hackathon.</p>
					<p className="mt-1">Ditenagai oleh rekomendasi AI untuk pengalaman belanja yang lebih cerdas.</p>
				</div>
			</footer>
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
			<p className="mt-1 max-w-md text-sm text-muted-foreground">Coba ubah kata kunci atau kategori. Kamu juga bisa bertanya ke asisten AI untuk rekomendasi yang lebih tepat.</p>
			<Button asChild className="mt-4">
				<Link href="/chat" className="inline-flex items-center gap-2">
					<MessageSquare className="h-4 w-4" /> Tanya AI Sekarang
				</Link>
			</Button>
		</div>
	);
}

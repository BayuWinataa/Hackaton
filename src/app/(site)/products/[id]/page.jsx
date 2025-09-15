// app/products/[id]/page.jsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import products from '@/../products.json';
import gambar from '@/app/assets/kobo.jpg';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { MessageSquare, CheckCircle2, Shield, Truck, RotateCcw } from 'lucide-react';

// tombol client untuk add-to-cart
import AddToCartButton from '@/components/cart/AddToCartButton';

// ---- Helpers
const formatIDR = (n) =>
	new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		maximumFractionDigits: 0,
	}).format(Number.isFinite(n) ? n : 0);

// ---- SSG (opsional tapi disarankan)
export async function generateStaticParams() {
	return products.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }) {
	const item = products.find((p) => String(p.id) === String(params.id));
	if (!item) return { title: 'Produk tidak ditemukan · ShopMate' };
	return {
		title: `${item.nama} · ShopMate`,
		description: item.deskripsi?.slice(0, 160) || item.longDeskripsi?.slice(0, 160) || `Beli ${item.nama} di ShopMate`,
		openGraph: {
			title: `${item.nama} · ShopMate`,
			description: item.deskripsi?.slice(0, 200) || item.longDeskripsi?.slice(0, 200) || `Beli ${item.nama} di ShopMate`,
		},
	};
}

// ---- Page (SERVER COMPONENT, tanpa 'use client')
export default function ProductDetail({ params }) {
	const { id } = params;
	const product = products.find((p) => String(p.id) === String(id));
	if (!product) return notFound();

	const related = products.filter((p) => p.id !== product.id && p.kategori === product.kategori).slice(0, 4);

	// pastikan objek minimal untuk cart
	const cartProduct = {
		id: product.id,
		nama: product.nama,
		harga: Number(product.harga) || 0,
		image: product.gambar || product.image || null,
	};

	const imgSrc = product.gambar || product.image || gambar;

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
			{/* Breadcrumb (sticky) */}
			<header className="w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container mx-auto h-14 px-4 sm:px-6 lg:px-8 flex items-center">
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link href="/">Beranda</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link href="/products">Produk</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage className="truncate max-w-[50vw]">{product.nama}</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</header>

			{/* Main */}
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Heading */}
				<div className="mb-6">
					<div className="flex items-center gap-2">
						{product.kategori && (
							<Badge variant="secondary" className="capitalize">
								{product.kategori}
							</Badge>
						)}
						{Array.isArray(product.tags) && product.tags.includes('baru') && <Badge variant="outline">Baru</Badge>}
					</div>
					<h1 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">{product.nama}</h1>
				</div>

				{/* Layout konten */}
				<div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8">
					{/* Galeri / Media */}
					<section className="space-y-4">
						<Card className="overflow-hidden border-0 ring-1 ring-black/5">
							<div className="relative aspect-[4/3] w-full">
								<Image src={imgSrc} alt={product.nama} fill className="object-cover object-center" priority />
							</div>
						</Card>

						{/* Deskripsi Panjang */}
						{product.longDeskripsi && (
							<Card className="border-0 ring-1 ring-black/5">
								<CardContent className="p-5">
									<h3 className="text-base font-semibold text-slate-900">Detail Produk</h3>
									<Separator className="my-4" />
									<div className="prose prose-slate max-w-none">
										<p className="leading-relaxed whitespace-pre-line">{product.longDeskripsi}</p>
									</div>
								</CardContent>
							</Card>
						)}
					</section>

					{/* Panel Pembelian (sticky) */}
					<aside className="lg:pl-2">
						<div className="lg:sticky lg:top-20 space-y-4">
							<Card className="border-0 ring-1 ring-black/5">
								<CardContent className="p-5">
									<div className="flex items-start justify-between gap-3">
										<div>
											<div className="text-xs uppercase tracking-wide text-slate-500">Harga</div>
											<div className="text-3xl font-extrabold text-blue-600">{formatIDR(product.harga)}</div>
										</div>
									</div>

									<div className="mt-5 grid gap-3">
										{/* Tombol Add to Cart (client) */}
										<AddToCartButton product={cartProduct} className="w-full" />

										<Button asChild variant="outline" className="w-full inline-flex items-center gap-2">
											<Link href={`/chat?ask=${encodeURIComponent(`Tolong jelaskan tentang produk ${product.nama}`)}`}>
												<MessageSquare className="h-4 w-4" />
												Tanya AI tentang produk ini
											</Link>
										</Button>
									</div>

									{/* Deskripsi singkat */}
									{product.deskripsi && <div className="mt-6 text-sm text-slate-700 leading-relaxed">{product.deskripsi}</div>}
								</CardContent>
							</Card>

							{/* Info tambahan opsional */}
							{(product.catatan || product.brand) && (
								<Card className="border-0 ring-1 ring-black/5">
									<CardContent className="p-5 text-sm text-slate-600">
										{product.brand && (
											<p>
												<span className="font-medium text-slate-900">Brand:</span> {product.brand}
											</p>
										)}
										{product.catatan && (
											<p className="mt-2">
												<span className="font-medium text-slate-900">Catatan:</span> {product.catatan}
											</p>
										)}
									</CardContent>
								</Card>
							)}
						</div>
					</aside>
				</div>

				{/* Terkait */}
				{related.length > 0 && (
					<>
						<Separator className="my-10" />
						<section>
							<h2 className="text-lg md:text-xl font-semibold">Produk Terkait</h2>
							<p className="text-sm text-muted-foreground">Barang serupa yang mungkin kamu suka.</p>

							<div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
								{related.map((p) => {
									const rImg = p.gambar || p.image || gambar;
									return (
										<Link key={p.id} href={`/products/${p.id}`} className="group rounded-2xl overflow-hidden border bg-white/60 backdrop-blur ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-md">
											<div className="relative aspect-[4/3] w-full overflow-hidden">
												<Image src={rImg} alt={p.nama} fill className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
											</div>
											<div className="p-3">
												<div className="truncate text-sm font-medium text-slate-900">{p.nama}</div>
												<div className="text-xs font-semibold text-blue-600">{formatIDR(p.harga)}</div>
											</div>
										</Link>
									);
								})}
							</div>
						</section>
					</>
				)}
			</main>
		</div>
	);
}

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
import { MessageSquare } from 'lucide-react';

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
		description: item.deskripsi?.slice(0, 160) || `Beli ${item.nama} di ShopMate`,
		openGraph: {
			title: `${item.nama} · ShopMate`,
			description: item.deskripsi?.slice(0, 200) || `Beli ${item.nama} di ShopMate`,
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
		image: product.image || null,
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Breadcrumb */}
			<header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center">
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
									<Link href="/">Produk</Link>
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
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Gambar */}
					<Card className="overflow-hidden">
						<div className="relative aspect-[4/3] w-full">
							<Image src={product.image || gambar} alt={product.nama} fill className="object-cover object-center" priority />
						</div>
					</Card>

					{/* Detail */}
					<div>
						<div className="flex items-center gap-2">
							{product.kategori && <Badge variant="secondary">{product.kategori}</Badge>}
							<Badge variant="outline">ID: {product.id}</Badge>
						</div>

						<h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight">{product.nama}</h1>
						<p className="mt-2 text-2xl md:text-3xl font-extrabold text-blue-600">{formatIDR(product.harga)}</p>

						<Separator className="my-6" />

						<div className="prose prose-sm dark:prose-invert max-w-none">
							<p>{product.deskripsi || 'Deskripsi belum tersedia. Tanyakan asisten AI untuk rekomendasi dan detail spesifikasi.'}</p>
							{Array.isArray(product.spesifikasi) && product.spesifikasi.length > 0 && (
								<ul>
									{product.spesifikasi.map((s, i) => (
										<li key={i}>{s}</li>
									))}
								</ul>
							)}
						</div>

						<div className="mt-6 flex flex-col sm:flex-row gap-3">
							{/* Tombol Add to Cart (client) */}
							<AddToCartButton product={cartProduct} className="inline-flex" />

							<Button asChild variant="secondary" className="inline-flex items-center gap-2">
								<Link href={`/chat?ref=product-${product.id}`}>
									<MessageSquare className="h-4 w-4" /> Tanya AI tentang produk ini
								</Link>
							</Button>
						</div>

						{/* Info tambahan */}
						<Card className="mt-8">
							<CardContent className="py-6 text-sm text-muted-foreground">
								<ul className="list-disc pl-5 space-y-1">
									<li>Garansi resmi 1 tahun*</li>
									<li>Gratis ongkir wilayah tertentu</li>
									<li>Pengembalian 7 hari jika barang cacat</li>
								</ul>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Terkait */}
				{related.length > 0 && (
					<>
						<Separator className="my-10" />
						<section>
							<h2 className="text-lg md:text-xl font-semibold">Produk Terkait</h2>
							<p className="text-sm text-muted-foreground">Barang serupa yang mungkin kamu suka.</p>
							<div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
								{related.map((p) => (
									<Link key={p.id} href={`/products/${p.id}`} className="group">
										<div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden border">
											<Image src={p.image || gambar} alt={p.nama} fill className="object-cover group-hover:scale-[1.03] transition" />
										</div>
										<div className="mt-2 text-sm font-medium truncate">{p.nama}</div>
										<div className="text-xs text-muted-foreground">{formatIDR(p.harga)}</div>
									</Link>
								))}
							</div>
						</section>
					</>
				)}
			</main>
		</div>
	);
}

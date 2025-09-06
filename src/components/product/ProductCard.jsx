'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import gambar from '@/app/assets/kobo.jpg';

const formatIDR = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function ProductCard({ product }) {
	return (
		<Card className="group overflow-hidden hover:shadow-xl transition-all">
			<div className="relative aspect-[4/3] w-full overflow-hidden">
				<Image src={gambar} alt={product.nama} fill className="object-cover group-hover:scale-[1.03] transition-transform" />
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
	);
}

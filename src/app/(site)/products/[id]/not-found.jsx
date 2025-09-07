import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
			<h1 className="text-2xl md:text-3xl font-bold">Produk tidak ditemukan</h1>
			<p className="mt-2 text-muted-foreground">Produk yang kamu cari mungkin sudah tidak tersedia.</p>
			<div className="mt-6">
				<Button asChild>
					<Link href="/">Kembali ke Beranda</Link>
				</Button>
			</div>
		</div>
	);
}

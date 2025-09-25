'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCart } from './CartProvider';

export default function AddToCartButton({ product }) {
	const router = useRouter();
	const pathname = usePathname();
	const search = useSearchParams();
	const { addItem, setOpen } = useCart();

	const [authChecked, setAuthChecked] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [checking, setChecking] = useState(true);

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const res = await fetch('/api/auth/me', { cache: 'no-store' });
				if (mounted) {
					setIsLoggedIn(res.ok);
					setAuthChecked(true);
				}
			} catch {
				if (mounted) {
					setIsLoggedIn(false);
					setAuthChecked(true);
				}
			} finally {
				if (mounted) setChecking(false);
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);

	const handleClick = () => {
		const nextUrl = pathname + (search?.toString() ? `?${search.toString()}` : '');

		if (!isLoggedIn) {
			router.push(`/login?next=${encodeURIComponent(nextUrl)}`);
			return;
		}

		// Sudah login → tambahkan ke cart + buka sidebar
		addItem({
			id: product.id,
			nama: product.nama,
			harga: Number(product.harga) || 0,
			image: product.image || product.gambar || null,
			qty: 1,
		});
		setOpen(true);
	};

	return (
		<Button className={checking ? 'cursor-not-allowed ' : ''} disabled={checking} onClick={handleClick}>
			Tambah ke Keranjang
		</Button>
	);
}

// src/components/cart/CartRouteGuard.jsx
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from './CartProvider';

export default function CartRouteGuard() {
	const pathname = usePathname();
	const { setOpen } = useCart();

	useEffect(() => {
		if (!pathname) return;
		if (pathname.startsWith('/cart')) {
			setOpen(false);
		}
	}, [pathname, setOpen]);

	return null;
}

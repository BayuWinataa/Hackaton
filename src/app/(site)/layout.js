'use client';

import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import CartSheet from '@/components/cart/CartSheet';
import CartRouteGuard from '@/components/cart/CartRouteGuard';
import { usePathname } from 'next/navigation';

export default function SiteLayout({ children }) {
	const pathname = usePathname();

	const hideFooter = pathname === '/chat';

	return (
		<>
			<Header />
			{children}
			{/* Komponen global */}
			<CartSheet />
			<CartRouteGuard />
			{!hideFooter && <Footer />}
		</>
	);
}

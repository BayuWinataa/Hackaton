'use client';

import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import CartSheet from '@/components/cart/CartSheet';
import CartRouteGuard from '@/components/cart/CartRouteGuard';

export default function SiteLayout({ children }) {
	return (
		<>
			<Header />
			{children}
			{/* Dipasang hanya untuk (site), jadi (auth) tidak kebawa */}
			<CartSheet />
			<CartRouteGuard />
			{/* <Footer /> */}
		</>
	);
}

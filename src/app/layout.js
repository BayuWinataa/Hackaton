// src/app/layout.jsx
import './globals.css';
import CartProvider from '@/components/cart/CartProvider';
import CartSheet from '@/components/cart/CartSheet';
import CartRouteGuard from '@/components/cart/CartRouteGuard';

export const metadata = {
	title: 'ShopMate',
	description: 'Belanja cerdas dengan bantuan AI',
};

export default function RootLayout({ children }) {
	return (
		<html lang="id">
			<body>
				<CartProvider>
					{children}
					<CartSheet />
					<CartRouteGuard />
				</CartProvider>
			</body>
		</html>
	);
}

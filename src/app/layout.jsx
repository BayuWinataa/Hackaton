import './globals.css';
import CartProvider from '@/components/cart/CartProvider';
import { Poppins } from 'next/font/google';

export const metadata = {
	title: 'ShopMate',
	description: 'Belanja cerdas dengan bantuan AI',
};

const poppins = Poppins({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700'],
});


export default function RootLayout({ children }) {
	return (
		<html lang="id">
			<body className={poppins.className}>
				{/* Provider global saja di root */}
				<CartProvider>{children}</CartProvider>
			</body>
		</html>
	);
}

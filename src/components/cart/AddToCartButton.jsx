'use client';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from './CartProvider';

export default function AddToCartButton({ product, qty = 1, className }) {
	const { addItem, setOpen } = useCart();
	return (
		<Button
			className={className}
			onClick={() => {
				addItem(product, qty);
				setOpen(true);
			}}
		>
			<ShoppingCart className="h-4 w-4 mr-2" /> Tambah ke Keranjang
		</Button>
	);
}

'use client';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from './CartProvider';

export default function CartButton() {
	const { totalQty, setOpen } = useCart();
	return (
		<Button variant="outline" className="relative" aria-label="Buka keranjang" onClick={() => setOpen(true)}>
			<ShoppingCart className="h-5 w-5" />
			{totalQty > 0 && <span className="absolute -top-2 -right-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">{totalQty}</span>}
		</Button>
	);
}

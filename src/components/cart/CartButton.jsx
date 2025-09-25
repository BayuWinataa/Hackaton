'use client';
import { ShoppingCart } from 'lucide-react';
// import { Button } from '@/components/ui/button';
import { useCart } from './CartProvider';

export default function CartButton() {
	const { totalQty, setOpen } = useCart();
	return (
		<div>
			<ShoppingCart size={40} onClick={() => setOpen(true)} className="border px-2 py-1 rounded-lg hover:bg-accent transition" />
			{totalQty > 0 && <span className="absolute -top-2 -right-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">{totalQty}</span>}
		</div>
	);
}

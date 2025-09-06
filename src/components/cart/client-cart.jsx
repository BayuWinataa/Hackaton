// src/app/cart/client-cart.jsx
'use client';

import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const formatIDR = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number.isFinite(n) ? n : 0);

export default function ClientCartPage() {
	const { items, updateQty, removeItem, clear, totalPrice } = useCart();

	if (!items.length) {
		return (
			<div className="mt-6 text-sm text-muted-foreground">
				Keranjang kosong.{' '}
				<Link href="/" className="underline">
					Belanja sekarang
				</Link>
				.
			</div>
		);
	}

	return (
		<div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
			{/* List item */}
			<div className="lg:col-span-2 space-y-4">
				{items.map((it) => (
					<div key={it.id} className="rounded-lg border p-4">
						<div className="flex items-start justify-between gap-3">
							<div>
								<div className="text-sm font-medium">{it.nama}</div>
								<div className="text-xs text-muted-foreground">{formatIDR(it.harga)}</div>
							</div>
							<button className="text-xs text-muted-foreground hover:underline" onClick={() => removeItem(it.id)}>
								Hapus
							</button>
						</div>

						<div className="mt-3 flex items-center gap-3">
							<span className="text-xs">Qty</span>
							<Input type="number" min={1} value={it.qty} onChange={(e) => updateQty(it.id, Number(e.target.value || 1))} className="h-8 w-20" />
							<div className="ml-auto text-sm font-semibold">{formatIDR((it.harga || 0) * (it.qty || 1))}</div>
						</div>
					</div>
				))}
			</div>

			{/* Ringkasan */}
			<div className="lg:col-span-1">
				<div className="rounded-lg border p-4">
					<div className="flex items-center justify-between text-sm">
						<span>Subtotal</span>
						<span className="font-semibold">{formatIDR(totalPrice)}</span>
					</div>
					<Separator className="my-4" />
					<div className="flex gap-2">
						<Button className="flex-1">Lanjut Checkout</Button>
						<Button variant="outline" onClick={clear}>
							Kosongkan
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

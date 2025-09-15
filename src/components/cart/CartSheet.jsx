// src/components/cart/CartSheet.jsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from './CartProvider';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const formatIDR = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number.isFinite(n) ? n : 0);

export default function CartSheet() {
	const { items, removeItem, updateQty, totalPrice, open, setOpen, clear } = useCart();
	const router = useRouter();

	const handleCheckout = (e) => {
		e.preventDefault();
		// 1) tutup sheet
		setOpen(false);
		// 2) navigasi ke /cart
		router.push('/cart');
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetContent side="right" className="w-[360px] sm:w-[420px]">
				<SheetHeader>
					<SheetTitle>Keranjang</SheetTitle>
				</SheetHeader>

				<div className="mt-4 space-y-4 mx-4">
					{items.length === 0 ? (
						<p className="text-sm text-muted-foreground">Keranjang masih kosong.</p>
					) : (
						items.map((it) => (
							<div key={it.id} className="flex gap-3">
								<div className="relative h-16 w-16 overflow-hidden rounded border bg-muted">{it.image ? <Image src={it.image} alt={it.nama} fill className="object-cover" /> : <div className="h-full w-full" />}</div>

								<div className="flex-1">
									<div className="flex items-start justify-between gap-2">
										<div>
											<div className="text-sm font-medium leading-tight line-clamp-2">{it.nama}</div>
											<div className="text-xs text-muted-foreground mt-0.5">{formatIDR(it.harga)}</div>
										</div>
										<button className="text-xs text-muted-foreground hover:underline" onClick={() => removeItem(it.id)}>
											Hapus
										</button>
									</div>

									<div className="mt-2 flex items-center gap-2">
										<span className="text-xs">Qty</span>
										<Input type="number" min={1} value={it.qty} onChange={(e) => updateQty(it.id, Number(e.target.value || 1))} className="h-8 w-16" />
										<div className="ml-auto text-sm font-semibold">{formatIDR((it.harga || 0) * (it.qty || 1))}</div>
									</div>
								</div>
							</div>
						))
					)}
				</div>

				<Separator className="my-4" />

				<div className="flex items-center justify-between text-sm mx-4 ">
					<span className="text-muted-foreground">Subtotal</span>
					<span className="font-semibold">{formatIDR(totalPrice)}</span>
				</div>

				<SheetFooter className="mt-4 gap-2">
					<Button variant="outline" onClick={clear} disabled={!items.length}>
						Kosongkan
					</Button>

					{/* Cara A: pakai handler supaya sheet tertutup lebih dulu */}
					<Button onClick={handleCheckout} disabled={!items.length}>
						Checkout
					</Button>

					{/* Cara B (alternatif): Link + onClick untuk tutup sheet
          <Button asChild disabled={!items.length}>
            <Link href="/cart" onClick={() => setOpen(false)}>
              Checkout
            </Link>
          </Button>
          */}
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}

// src/app/cart/client-cart.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/CartProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const formatIDR = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number.isFinite(n) ? n : 0);

export default function ClientCartPage() {
	const { items, updateQty, removeItem, clear, totalPrice } = useCart();
	const router = useRouter();

	// checkout modal state
	const [open, setOpen] = useState(false);
	const [placing, setPlacing] = useState(false);

	// very basic form
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [address, setAddress] = useState('');
	const [note, setNote] = useState('');
	const [payment, setPayment] = useState('qris'); 
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

	const handlePlaceOrder = async (e) => {
		e?.preventDefault?.();
		if (!name.trim() || !phone.trim() || !address.trim()) {
			alert('Nama, nomor HP, dan alamat wajib diisi.');
			return;
		}

		try {
			setPlacing(true);

			// rakit order “ala-ala”
			const order = {
				id: `ORD-${Date.now()}`, // id unik sederhana
				createdAt: new Date().toISOString(), // timestamp
				customer: { name, phone, address, note },
				payment, // metode bayar
				items: items.map((it) => ({
					id: it.id,
					nama: it.nama,
					harga: it.harga,
					qty: it.qty,
					subtotal: (it.harga || 0) * (it.qty || 1),
				})),
				subtotal: totalPrice,
				shipping: 0,
				total: totalPrice,
				status: 'CONFIRMED', // atau PENDING, PAID, dll
			};

			// simpan ke localStorage (append)
			const raw = typeof window !== 'undefined' ? localStorage.getItem('orders') : null;
			const prev = raw ? JSON.parse(raw) : [];
			localStorage.setItem('orders', JSON.stringify([order, ...prev]));

			// kosongkan keranjang
			clear();

			// tutup modal dan pergi ke dashboard/orders
			setOpen(false);
			router.push('/dashboard/orders?success=1');
		} catch (err) {
			console.error(err);
			alert('Gagal membuat pesanan. Coba lagi.');
		} finally {
			setPlacing(false);
		}
	};

	return (
		<>
			<div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
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
							<Button className="flex-1" onClick={() => setOpen(true)}>
								Lanjut Checkout
							</Button>
							<Button variant="outline" onClick={clear}>
								Kosongkan
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Modal Checkout */}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>Checkout</DialogTitle>
					</DialogHeader>

					<form onSubmit={handlePlaceOrder} className="space-y-4">
						<div className="grid grid-cols-1 gap-3">
							<div className="grid gap-1.5">
								<Label htmlFor="name">Nama Penerima</Label>
								<Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" />
							</div>

							<div className="grid gap-1.5">
								<Label htmlFor="phone">No. HP</Label>
								<Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xxxx" />
							</div>

							<div className="grid gap-1.5">
								<Label htmlFor="address">Alamat</Label>
								<Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Jalan, Kelurahan, Kecamatan, Kota, Kode Pos" />
							</div>

							<div className="grid gap-1.5">
								<Label htmlFor="note">Catatan (opsional)</Label>
								<Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Mis: Titip di satpam" />
							</div>

							<div className="grid gap-1.5">
								<Label>Metode Pembayaran</Label>
								<div className="flex flex-wrap gap-2">
									<button type="button" onClick={() => setPayment('qris')} className={`rounded-lg border px-3 py-2 text-sm ${payment === 'qris' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200'}`}>
										QRIS
									</button>
									<button type="button" onClick={() => setPayment('transfer')} className={`rounded-lg border px-3 py-2 text-sm ${payment === 'transfer' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200'}`}>
										Transfer
									</button>
									<button type="button" onClick={() => setPayment('cod')} className={`rounded-lg border px-3 py-2 text-sm ${payment === 'cod' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200'}`}>
										COD
									</button>
								</div>
							</div>

							<div className="rounded-lg border p-3 text-sm">
								<div className="flex items-center justify-between">
									<span>Total</span>
									<span className="font-bold">{formatIDR(totalPrice)}</span>
								</div>
							</div>
						</div>

						<DialogFooter className="gap-2 sm:gap-0">
							<Button type="button" variant="outline" onClick={() => setOpen(false)}>
								Batal
							</Button>
							<Button type="submit" disabled={placing}>
								{placing ? 'Memproses…' : 'Buat Pesanan'}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}

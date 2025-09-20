'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageSquare, Send } from 'lucide-react';
import Link from 'next/link';
import products from '@/../products.json';

// ================= Helpers =================
const formatIDR = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number.isFinite(Number(n)) ? Number(n) : 0);

const formatDate = (d) => {
	if (!d) return '-';
	const dt = new Date(d);
	if (isNaN(dt.getTime())) return '-';
	return dt.toLocaleString('id-ID', {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	});
};

const productIndex = new Map((products ?? []).map((p) => [p.id, p]));

function Row({ label, value }) {
	if (value == null || value === '' || value === '—') return null;
	return (
		<div className="grid grid-cols-3 gap-3 text-sm">
			<div className="text-slate-500">{label}</div>
			<div className="col-span-2">{value}</div>
		</div>
	);
}

function ItemsTable({ items }) {
	if (!Array.isArray(items) || items.length === 0) {
		return <div className="text-sm text-slate-500">Tidak ada item.</div>;
	}
	return (
		<div className="overflow-x-auto">
			<table className="w-full text-sm">
				<thead className="text-left text-slate-500">
					<tr>
						<th className="py-2 pr-3">Produk</th>
						<th className="py-2 pr-3">Qty</th>
						<th className="py-2 pr-3">Harga</th>
						<th className="py-2 pr-3">Subtotal</th>
						<th className="py-2">Link</th>
					</tr>
				</thead>
				<tbody>
					{items.map((it, idx) => {
						const prod = productIndex.get(it.productId);
						const name = it.name ?? prod?.nama ?? `#${it.productId ?? '—'}`;
						const qty = Number(it.quantity ?? it.qty ?? 1);
						const price = Number(it.price ?? prod?.harga ?? 0);
						const subtotal = Number(it.subtotal ?? price * qty);
						return (
							<tr key={idx} className="border-t">
								<td className="py-2 pr-3">{name}</td>
								<td className="py-2 pr-3">{qty}</td>
								<td className="py-2 pr-3">{formatIDR(price)}</td>
								<td className="py-2 pr-3">{formatIDR(subtotal)}</td>
								<td className="py-2">
									{prod ? (
										<Link href={`/products/${prod.id}`} target="_blank" className="text-blue-600 hover:underline">
											Lihat
										</Link>
									) : (
										<span className="text-slate-400">—</span>
									)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

function Totals({ order }) {
	const items = Array.isArray(order.items) ? order.items : Array.isArray(order.lines) ? order.lines : [];
	const computedSubtotal = useMemo(() => {
		return items.reduce((acc, it) => {
			const qty = Number(it.quantity ?? it.qty ?? 1);
			const price = Number(it.price ?? productIndex.get(it.productId)?.harga ?? 0);
			const sub = Number(it.subtotal ?? price * qty);
			return acc + (Number.isFinite(sub) ? sub : 0);
		}, 0);
	}, [items]);

	const shipping = Number(order.shippingCost ?? order.shipping_fee ?? 0);
	const discount = Number(order.discount ?? order.discountTotal ?? order.voucherDiscount ?? 0);
	const tax = Number(order.tax ?? order.ppn ?? 0);
	const total = Number(order.total) ?? Number(order.grandTotal) ?? Number(order.amount) ?? computedSubtotal + shipping + tax - (Number.isFinite(discount) ? discount : 0);

	return (
		<div className="grid gap-2 text-sm">
			<Row label="Subtotal" value={formatIDR(order.subtotal ?? computedSubtotal)} />
			<Row label="Diskon" value={discount ? formatIDR(discount) : null} />
			<Row label="Pajak" value={tax ? formatIDR(tax) : null} />
			<Row label="Ongkir" value={shipping ? formatIDR(shipping) : null} />
			<div className="h-px bg-slate-200 my-1" />
			<div className="flex items-center justify-between font-semibold">
				<span>Total</span>
				<span>{formatIDR(total)}</span>
			</div>
		</div>
	);
}

// ================= Main =================
export default function OrdersClient() {
	const [orders, setOrders] = useState([]);
	const [openChat, setOpenChat] = useState(false);
	const [chatInput, setChatInput] = useState('');
	const [chatMsgs, setChatMsgs] = useState([]);
	const [isAsking, setIsAsking] = useState(false);
	const [catalogSuggestions, setCatalogSuggestions] = useState([]);
	const chatEndRef = useRef(null);

	// Modal detail order
	const [openDetail, setOpenDetail] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState(null);

	// Load orders & chat dari localStorage
	useEffect(() => {
		try {
			const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
			setOrders(Array.isArray(savedOrders) ? savedOrders : []);
		} catch (error) {
			console.error('Failed to load orders from localStorage', error);
		}
		try {
			const savedMessages = JSON.parse(localStorage.getItem('orders_ai_messages') || '[]');
			setChatMsgs(Array.isArray(savedMessages) ? savedMessages : []);
		} catch (error) {
			console.error('Failed to load chat messages from localStorage', error);
		}
	}, []);

	// Simpan chat ke localStorage
	useEffect(() => {
		localStorage.setItem('orders_ai_messages', JSON.stringify(chatMsgs));
	}, [chatMsgs]);

	// Auto-scroll chat
	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [chatMsgs]);

	// ====== Chat helpers ======
	const contextString = `Riwayat Order Anda:\n${JSON.stringify(orders, null, 2)}`;

	function extractSuggestionIdsFromReply(text) {
		try {
			const match = text.match(/```json\s*([\s\S]*?)\s*```/i);
			if (!match) return [];
			const obj = JSON.parse(match[1]);
			const ids = Array.isArray(obj?.suggestions) ? obj.suggestions : [];
			return ids.filter((x, i) => Number.isFinite(x) && ids.indexOf(x) === i).slice(0, 12);
		} catch {
			return [];
		}
	}

	function mapIdsToCatalogProducts(ids) {
		return ids.map((id) => productIndex.get(id)).filter(Boolean);
	}

	async function handleSubmit(e) {
		e.preventDefault();
		const text = chatInput.trim();
		if (!text) return;

		const userMsg = { role: 'user', content: text, ts: new Date().toISOString() };
		const next = [...chatMsgs, userMsg];
		setChatMsgs(next);
		setChatInput('');
		setIsAsking(true);

		try {
			const res = await fetch('/api/orders-ai', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: next, context: contextString }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Failed to fetch AI response.');

			const assistantMsg = { role: 'assistant', content: data.reply, ts: new Date().toISOString() };
			setChatMsgs((p) => [...p, assistantMsg]);

			const ids = extractSuggestionIdsFromReply(data.reply);
			const validProducts = mapIdsToCatalogProducts(ids);
			setCatalogSuggestions(validProducts);
		} catch (err) {
			setChatMsgs((p) => [...p, { role: 'assistant', content: `Error: ${err.message}`, ts: new Date().toISOString() }]);
			setCatalogSuggestions([]);
		} finally {
			setIsAsking(false);
		}
	}

	// ================= Render =================
	return (
		<>
			<div className="flex items-center justify-between gap-2">
				<div className="text-sm text-muted-foreground">
					Total orders: <span className="font-medium">{orders.length}</span>
				</div>
				<Button variant="outline" size="sm" className="gap-2" onClick={() => setOpenChat(true)}>
					<MessageSquare className="h-4 w-4" /> Tanya AI soal pesanan
				</Button>
			</div>

			{/* ===== LIST ORDERS (ringkas; klik untuk buka modal detail) ===== */}
			<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{orders.length === 0 ? (
					<div className="text-sm text-muted-foreground">Belum ada pesanan.</div>
				) : (
					orders.map((o) => {
						const id = o.id ?? o.orderId ?? `temp-${Math.random()}`;
						const status = o.status ?? o.orderStatus ?? 'unknown';
						const paymentStatus = o.paymentStatus ?? o.payment_status ?? o.payment?.status;
						const items = Array.isArray(o.items) ? o.items : Array.isArray(o.lines) ? o.lines : [];

						const badgeVariant = String(status).toLowerCase().includes('cancel') ? 'destructive' : String(status).toLowerCase().includes('pending') ? 'secondary' : 'default';

						const openDetailModal = () => {
							setSelectedOrder(o);
							setOpenDetail(true);
						};

						return (
							<button key={id} onClick={openDetailModal} className="rounded-lg border p-4 text-left hover:bg-slate-50 transition-colors">
								<div className="mb-2 flex items-start justify-between gap-3">
									<div>
										<div className="text-sm font-semibold">#{id}</div>
										<div className="text-xs text-slate-500">{formatDate(o.createdAt ?? o.created_at ?? o.date)}</div>
									</div>
									<div className="text-right">
										<Badge variant={badgeVariant} className="text-[10px]">
											{String(status).toUpperCase()}
										</Badge>
										{paymentStatus && <div className="mt-1 text-xs text-slate-500">Pembayaran: {String(paymentStatus).toUpperCase()}</div>}
									</div>
								</div>

								{/* Ringkasan item singkat */}
								<div className="space-y-1 text-sm">
									{items.slice(0, 2).map((it, idx) => {
										const prod = productIndex.get(it.productId);
										const name = it.name ?? prod?.nama ?? `#${it.productId ?? '—'}`;
										const qty = Number(it.quantity ?? it.qty ?? 1);
										const price = Number(it.price ?? prod?.harga ?? 0);
										return (
											<div key={idx} className="flex justify-between">
												<span className="truncate">
													{name} × {qty}
												</span>
												<span>{formatIDR(price * qty)}</span>
											</div>
										);
									})}
									{items.length > 2 && <div className="text-xs text-slate-500">+{items.length - 2} item lainnya</div>}
								</div>

								{/* Total ringkas */}
								<div className="mt-3 border-t pt-2 text-sm font-semibold flex justify-between">
									<span>Total</span>
									<span>{formatIDR(o.total ?? o.grandTotal ?? o.amount ?? 0)}</span>
								</div>
							</button>
						);
					})
				)}
			</div>

			{/* ===== MODAL DETAIL ORDER (hanya data penting dari JSON yang tersedia) ===== */}
			{/* ===== MODAL DETAIL ORDER ===== */}
			<Dialog open={openDetail} onOpenChange={setOpenDetail}>
				<DialogContent className="flex h-[85vh] max-w-3xl flex-col gap-3 overflow-hidden p-0">
					<DialogHeader className="px-5 pt-5">
						<DialogTitle className="text-base font-semibold">Detail Order {selectedOrder ? `#${selectedOrder.id ?? selectedOrder.orderId ?? ''}` : ''}</DialogTitle>
					</DialogHeader>

					<div className="min-h-0 flex-1">
						<ScrollArea className="h-full px-5 pb-2">
							{selectedOrder && (
								<div className="space-y-4">
									{/* Header */}
									<div className="rounded-lg border p-3">
										<div className="flex items-start justify-between">
											<div>
												<div className="text-sm font-semibold">#{selectedOrder.id ?? selectedOrder.orderId ?? '—'}</div>
												<div className="text-xs text-slate-500">{formatDate(selectedOrder.createdAt ?? selectedOrder.created_at ?? selectedOrder.date)}</div>
											</div>
											<div className="text-right">
												{(() => {
													const s = selectedOrder.status ?? selectedOrder.orderStatus ?? 'unknown';
													const v = String(s).toLowerCase().includes('cancel') ? 'destructive' : String(s).toLowerCase().includes('pending') ? 'secondary' : 'default';
													return (
														<Badge variant={v} className="text-[10px]">
															{String(s).toUpperCase()}
														</Badge>
													);
												})()}
											</div>
										</div>
									</div>

									{/* 🆕 Ringkasan Barang & Tanggal */}
									<div className="rounded-lg border p-3">
										<div className="text-sm font-semibold mb-2">Ringkasan Order</div>
										<Row label="Tanggal Order" value={formatDate(selectedOrder.createdAt ?? selectedOrder.date)} />
										<div className="mt-2 space-y-1 text-sm">
											{(Array.isArray(selectedOrder.items) ? selectedOrder.items : selectedOrder.lines || []).map((it, idx) => {
												const prod = productIndex.get(it.productId);
												const name = it.name ?? prod?.nama ?? `#${it.productId ?? '—'}`;
												const qty = Number(it.quantity ?? it.qty ?? 1);
												return (
													<div key={idx} className="flex justify-between">
														<span>{name}</span>
														<span className="text-slate-500">× {qty}</span>
													</div>
												);
											})}
										</div>
									</div>

									{/* Pembeli & Pengiriman */}
									{/* ... (bagian lain tetap sama seperti sebelumnya) ... */}

									{/* Item detail (tabel) */}
									<div className="rounded-lg border p-3">
										<div className="text-sm font-semibold mb-2">Item Detail</div>
										<ItemsTable items={Array.isArray(selectedOrder.items) ? selectedOrder.items : selectedOrder.lines || []} />
									</div>

									{/* Ringkasan pembayaran */}
									<div className="rounded-lg border p-3">
										<div className="text-sm font-semibold mb-2">Ringkasan Pembayaran</div>
										<Totals order={selectedOrder} />
									</div>

									{/* ...lanjutan modal tetap sama... */}
								</div>
							)}
							<ScrollBar orientation="vertical" />
						</ScrollArea>
					</div>

					<DialogFooter className="border-t bg-white/80 px-5 py-3 backdrop-blur">
						<Button variant="outline" onClick={() => setOpenDetail(false)}>
							Tutup
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* ===== POPUP CHAT KHUSUS ORDERS (tetap ada) ===== */}
			<Dialog open={openChat} onOpenChange={setOpenChat} modal={false}>
				<DialogContent className="flex h-[80vh] max-w-3xl flex-col gap-3 overflow-hidden p-0">
					<DialogHeader className="px-5 pt-5">
						<DialogTitle className="text-base font-semibold">Asisten AI (Orders)</DialogTitle>
					</DialogHeader>

					<div className="min-h-0 flex-1">
						<ScrollArea className="h-full px-5 pb-2">
							<div className="space-y-4">
								{chatMsgs.map((m, i) => (
									<div key={`${m.role}-${i}`} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
										<div className={`${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'} max-w-2xl rounded-2xl px-4 py-2 shadow-sm`}>
											<div className="prose prose-invert max-w-none whitespace-pre-wrap">{m.content}</div>
										</div>
									</div>
								))}

								{isAsking && (
									<div className="flex justify-start">
										<div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-slate-600">
											<Loader2 className="h-4 w-4 animate-spin" /> AI is thinking...
										</div>
									</div>
								)}

								{/* Saran dari katalog */}
								{catalogSuggestions.length > 0 && (
									<div className="rounded-lg border p-3">
										<div className="text-sm font-semibold mb-2">Saran Produk</div>
										<ul className="space-y-1 text-sm">
											{catalogSuggestions.map((p) => (
												<li key={p.id} className="flex items-center justify-between">
													<Link href={`/products/${p.id}`} target="_blank" className="truncate">
														{p.nama}
													</Link>
													<span className="text-slate-600">{formatIDR(p.harga)}</span>
												</li>
											))}
										</ul>
									</div>
								)}

								<div ref={chatEndRef} />
							</div>
							<ScrollBar orientation="vertical" />
						</ScrollArea>
					</div>

					<DialogFooter className="border-t bg-white/80 px-5 py-3 backdrop-blur">
						<form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
							<input
								value={chatInput}
								onChange={(e) => setChatInput(e.target.value)}
								placeholder="Tanya AI tentang pesanan"
								className="flex-1 rounded-xl border p-3 text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
							/>
							<button type="submit" disabled={isAsking} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-blue-300">
								{isAsking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
							</button>
						</form>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

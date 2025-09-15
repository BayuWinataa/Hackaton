'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Loader2, MessageSquare, Send } from 'lucide-react';
import Link from 'next/link'; // Import Link untuk navigasi ke halaman produk
import products from '@/../products.json'; // ← katalog untuk validasi

const formatIDR = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number.isFinite(n) ? n : 0);

export default function OrdersClient() {
	const [orders, setOrders] = useState([]);
	const [openChat, setOpenChat] = useState(false);
	const [chatInput, setChatInput] = useState('');
	const [chatMsgs, setChatMsgs] = useState([]);
	const [isAsking, setIsAsking] = useState(false);
	const [catalogSuggestions, setCatalogSuggestions] = useState([]);
	const chatEndRef = useRef(null);

	// Load messages from localStorage
	useEffect(() => {
		// Load saved orders from localStorage
		try {
			const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
			setOrders(savedOrders);
		} catch (error) {
			console.error('Failed to load orders from localStorage', error);
		}

		// Load saved messages from localStorage (chat history)
		try {
			const savedMessages = JSON.parse(localStorage.getItem('orders_ai_messages') || '[]');
			setChatMsgs(savedMessages);
		} catch (error) {
			console.error('Failed to load chat messages from localStorage', error);
		}
	}, []);

	// Save messages to localStorage whenever chat updates
	useEffect(() => {
		localStorage.setItem('orders_ai_messages', JSON.stringify(chatMsgs));
	}, [chatMsgs]);

	// Auto-scroll to the latest chat message
	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [chatMsgs]);

	const contextString = `Riwayat Order Anda:\n${JSON.stringify(orders, null, 2)}`;

	// Parse JSON and extract valid product IDs
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
		const byId = new Map(products.map((p) => [p.id, p]));
		return ids.map((id) => byId.get(id)).filter(Boolean);
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

			{/* List orders */}
			<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{orders.length === 0 ? (
					<div className="text-sm text-muted-foreground">Belum ada pesanan.</div>
				) : (
					orders.map((o) => (
						<div key={o.id} className="rounded-lg border p-4">
							<div className="text-sm font-semibold">#{o.id}</div>
							<div className="text-sm text-slate-500">{formatIDR(o.total)}</div>
						</div>
					))
				)}
			</div>

			{/* ===== POPUP CHAT KHUSUS ORDERS ===== */}
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
													<Link href={`/products/${p.id}`} target='blank' className="truncate">
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

// app/(site)/dashboard/DashboardClient.jsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Loader2, Send, MessageSquare } from 'lucide-react';

const formatIDR = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number.isFinite(n) ? n : 0);

function timeAgo(ts) {
	if (!ts) return '—';
	const diff = Date.now() - new Date(ts).getTime();
	const m = Math.floor(diff / 60000);
	if (m < 1) return 'baru saja';
	if (m < 60) return `${m}m ago`;
	const h = Math.floor(m / 60);
	if (h < 24) return `${h}h ago`;
	const d = Math.floor(h / 24);
	return `${d}d ago`;
}

export default function DashboardClient() {
	const [orders, setOrders] = useState([]);
	const [messagesGlobal, setMessagesGlobal] = useState([]);
	const [lastChatAt, setLastChatAt] = useState(null);

	useEffect(() => {
		try {
			setOrders(JSON.parse(localStorage.getItem('orders') || '[]') || []);
		} catch {}
		try {
			setMessagesGlobal(JSON.parse(localStorage.getItem('chat_messages') || '[]') || []);
		} catch {}
		try {
			setLastChatAt(localStorage.getItem('last_chat_at') || null);
		} catch {}
	}, []);

	const stats = useMemo(() => {
		const totalOrders = orders.length;
		const spent = orders.reduce((s, o) => s + (o.total || 0), 0);
		const invoices = orders.length;
		const unpaid = orders.filter((o) => (o.status || '').toUpperCase() !== 'PAID').length;
		return { totalOrders, spent, invoices, unpaid, lastChat: lastChatAt || null };
	}, [orders, lastChatAt]);

	const recentOrders = useMemo(() => orders.slice(0, 3), [orders]);
	const recentChats = useMemo(() => {
		const users = messagesGlobal
			.filter((m) => m?.role === 'user')
			.slice(-3)
			.reverse();
		return users;
	}, [messagesGlobal]);

	// ====== MODAL "Tanya AI" (model baru) ======
	const [isAskOpen, setIsAskOpen] = useState(false);
	const [askInput, setAskInput] = useState('');
	const [askMessages, setAskMessages] = useState([]); // disimpan terpisah dari chat global
	const [isAsking, setIsAsking] = useState(false);
	const askEndRef = useRef(null);

	// load riwayat “Tanya AI” dashboard
	useEffect(() => {
		try {
			setAskMessages(JSON.parse(localStorage.getItem('dash_ai_messages') || '[]') || []);
		} catch {}
	}, []);

	// persist riwayat “Tanya AI”
	useEffect(() => {
		localStorage.setItem('dash_ai_messages', JSON.stringify(askMessages));
	}, [askMessages]);

	// auto scroll modal
	useEffect(() => {
		askEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [askMessages, isAsking, isAskOpen]);

	// compile konteks pesanan untuk dikirim ke API
	const contextString = useMemo(() => {
		if (!orders.length) return 'Riwayat Pesanan: (kosong).';
		// ringkas 5 order terakhir
		const slice = orders.slice(0, 5).map((o) => ({
			id: o.id,
			createdAt: o.createdAt,
			total: o.total,
			status: o.status,
			items: (o.items || []).map((it) => ({ nama: it.nama, qty: it.qty, harga: it.harga })),
		}));
		return `Riwayat Pesanan (terbaru dulu, max 5):\n${JSON.stringify(slice, null, 2)}`;
	}, [orders]);

	async function handleAskSubmit(e) {
		e.preventDefault();
		const text = askInput.trim();
		if (!text) return;

		const userMsg = { role: 'user', content: text };
		const next = [...askMessages, userMsg];
		setAskMessages(next);
		setAskInput('');
		setIsAsking(true);

		try {
			const res = await fetch('/api/dash-ai', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: next, context: contextString }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Gagal meminta jawaban AI');
			setAskMessages((p) => [...p, { role: 'assistant', content: data.reply }]);
			// catat last chat global biar widget "Last Chat" hidup
			localStorage.setItem('last_chat_at', new Date().toISOString());
		} catch (err) {
			setAskMessages((p) => [...p, { role: 'assistant', content: `Error: ${err.message}` }]);
		} finally {
			setIsAsking(false);
		}
	}

	return (
		<>
			{/* Stats */}
			<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<Card>
					<CardContent className="p-4">
						<div className="text-sm text-slate-500">Total Orders</div>
						<div className="mt-1 text-2xl font-bold">{stats.totalOrders}</div>
						<div className="text-xs text-slate-500">Tersimpan </div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="text-sm text-slate-500">Spent</div>
						<div className="mt-1 text-2xl font-bold">{formatIDR(stats.spent)}</div>
						<div className="text-xs text-slate-500">Subtotal seluruh order</div>
					</CardContent>
				</Card>
			</div>

			{/* Recent section */}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<Card>
					<CardContent className="p-4">
						<div className="mb-3 text-sm font-semibold">Recent Orders</div>
						{recentOrders.length === 0 ? (
							<div className="text-sm text-muted-foreground">Belum ada pesanan.</div>
						) : (
							<ul className="space-y-2 text-sm">
								{recentOrders.map((o) => (
									<li key={o.id} className="flex items-center justify-between rounded-lg border px-3 py-2">
										<span className="truncate">
											{o.id} • {o.items?.[0]?.nama ?? 'Order'}
											{o.items && o.items.length > 1 ? ` +${o.items.length - 1} item` : ''}
										</span>
										<span className="text-slate-600">{formatIDR(o.total || 0)}</span>
									</li>
								))}
							</ul>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="mb-3 text-sm font-semibold">Recent Chats</div>
						{recentChats.length === 0 ? (
							<div className="text-sm text-muted-foreground">Belum ada chat.</div>
						) : (
							<ul className="space-y-2 text-sm">
								{recentChats.map((m, i) => (
									<li key={i} className="rounded-lg border px-3 py-2">
										“{m.content?.slice(0, 80) ?? ''}
										{m.content && m.content.length > 80 ? '…' : ''}”<span className="text-slate-500"> — {timeAgo(stats.lastChat)}</span>
									</li>
								))}
							</ul>
						)}
					</CardContent>
				</Card>
			</div>

			{/* ===== Modal Tanya AI (style mirip compare) ===== */}
			<Dialog open={isAskOpen} onOpenChange={setIsAskOpen} modal={false}>
				<DialogContent className="flex h-[85vh] max-w-4xl flex-col gap-3 overflow-hidden p-0">
					<DialogHeader className="px-5 pt-5">
						<DialogTitle className="text-base font-semibold">Asisten AI Dashboard</DialogTitle>
					</DialogHeader>

					<div className="min-h-0 flex-1">
						<ScrollArea className="h-full px-5 pb-2">
							<div className="space-y-4">
								{askMessages.map((m, i) => (
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

								<div ref={askEndRef} />
							</div>
							<ScrollBar orientation="vertical" />
						</ScrollArea>
					</div>

					<DialogFooter className="border-t bg-white/80 px-5 py-3 backdrop-blur">
						<form onSubmit={handleAskSubmit} className="flex w-full items-center gap-2">
							<input
								value={askInput}
								onChange={(e) => setAskInput(e.target.value)}
								placeholder="Tanya apa saja: ringkas pesanan, saran upgrade, status, dll."
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

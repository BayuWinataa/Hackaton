// 'use client';

// import React, { useEffect, useRef, useState } from 'react';

// // Versi JSX murni (tanpa TypeScript). Chat UI mirip ChatGPT.
// // Gunakan TailwindCSS untuk styling.

// function ChatGPTLikeChat() {
// 	const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hai! Aku asistenmu. Tanyakan apa saja 😊' }]);
// 	const [input, setInput] = useState('');
// 	const viewportRef = useRef(null);

// 	useEffect(() => {
// 		if (!viewportRef.current) return;
// 		viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
// 	}, [messages.length]);

// 	function handleSend(e) {
// 		e.preventDefault();
// 		const text = input.trim();
// 		if (!text) return;

// 		setMessages((prev) => [...prev, { role: 'user', content: text }]);
// 		setInput('');

// 		setTimeout(() => {
// 			setMessages((prev) => [...prev, { role: 'assistant', content: `Kamu berkata: ${text}` }]);
// 		}, 400);
// 	}

// 	return (
// 		<div className="h-[100dvh] bg-slate-50">

// 			{/* Content area */}
// 			<main className="mx-auto h-[calc(100dvh-4rem)] max-w-5xl px-4 py-4">
// 				<div className="grid h-full min-h-0 grid-cols-1 gap-4 md:grid-cols-[260px_1fr]">
// 					{/* Sidebar */}
// 					<aside className="hidden min-h-0 md:flex">
// 						<div className="flex w-full flex-col rounded-2xl border bg-white p-3 shadow-sm">
// 							<div className="mb-2 text-sm font-semibold">Percakapan</div>
// 							<div className="min-h-0 flex-1 overflow-y-auto pr-1">
// 								<ul className="space-y-2 text-sm text-slate-600">
// 									<li className="truncate rounded-lg border px-3 py-2 hover:bg-slate-50">Sesi 1</li>
// 									<li className="truncate rounded-lg border px-3 py-2 hover:bg-slate-50">Sesi 2</li>
// 									<li className="truncate rounded-lg border px-3 py-2 hover:bg-slate-50">Sesi 3</li>
// 								</ul>
// 							</div>
// 							<button className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-black">Obrolan Baru</button>
// 						</div>
// 					</aside>

// 					{/* Chat pane */}
// 					<section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-slate-200">
// 						{/* Messages viewport */}
// 						<div ref={viewportRef} className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-6">
// 							<div className="mx-auto flex max-w-2xl flex-col gap-4">
// 								{messages.map((m, i) => (
// 									<MessageBubble key={i} role={m.role} content={m.content} />
// 								))}
// 							</div>
// 						</div>

// 						{/* Composer */}
// 						<div className="border-t border-slate-200 p-3">
// 							<form onSubmit={handleSend} className="mx-auto flex max-w-2xl items-end gap-2">
// 								<Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ketik pesan Anda..." className="flex-1" />
// 								<button type="submit" className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-white hover:bg-blue-700">
// 									Kirim
// 								</button>
// 							</form>
// 							<p className="mx-auto mt-2 max-w-2xl px-1 text-center text-xs text-slate-500">Chat ini dapat menghasilkan kesalahan. Verifikasi info penting.</p>
// 						</div>
// 					</section>
// 				</div>
// 			</main>
// 		</div>
// 	);
// }

// function MessageBubble({ role, content }) {
// 	const isUser = role === 'user';
// 	return (
// 		<div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
// 			<div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${isUser ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'}`}>{isUser ? 'U' : 'AI'}</div>
// 			<div className={`max-w-[85%] sm:max-w-[80%] md:max-w-[75%] ${isUser ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'} rounded-2xl px-4 py-2 shadow-sm`}>
// 				<div className="prose prose-invert max-w-none break-words whitespace-pre-wrap leading-relaxed prose-p:my-2 prose-ul:my-2 prose-ol:my-2">{content}</div>
// 			</div>
// 		</div>
// 	);
// }

// function Textarea({ value, onChange, placeholder, className }) {
// 	const ref = useRef(null);

// 	useEffect(() => {
// 		const el = ref.current;
// 		if (!el) return;
// 		el.style.height = '0px';
// 		el.style.height = Math.min(el.scrollHeight, 180) + 'px';
// 	}, [value]);

// 	return (
// 		<textarea
// 			ref={ref}
// 			rows={1}
// 			value={value}
// 			onChange={onChange}
// 			placeholder={placeholder}
// 			className={`max-h-44 min-h-[2.5rem] w-full resize-none rounded-xl border px-3 py-2 text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 ${className ?? ''}`}
// 		/>
// 	);
// }

// export default ChatGPTLikeChat;












'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

import { Scale, Sparkles, Send, Loader2, ArrowRight, ListFilter } from 'lucide-react';

import gambar from '@/app/assets/kobo.jpg';
import products from '@/../products.json';

export default function ChatPage() {
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [recommendedProducts, setRecommendedProducts] = useState([]);
	const [comparisonList, setComparisonList] = useState([]);
	const [isComparing, setIsComparing] = useState(false);
	const [comparisonResult, setComparisonResult] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [comparedPair, setComparedPair] = useState([]);
	const [followupInput, setFollowupInput] = useState('');
	const [followupThread, setFollowupThread] = useState([]);
	const [isFollowupLoading, setIsFollowupLoading] = useState(false);
	const chatEndRef = useRef(null);
	const modalEndRef = useRef(null);
	const searchParams = useSearchParams();
	const hasBootstrappedAsk = useRef(false);

	useEffect(() => {
		try {
			const saved = localStorage.getItem('chat_messages');
			if (saved) setMessages(JSON.parse(saved));
		} catch {}
	}, []);

	useEffect(() => {
		if (hasBootstrappedAsk.current) return;

		const initialAsk = searchParams?.get('ask');
		if (initialAsk && messages.length === 0) {
			hasBootstrappedAsk.current = true;

			const userMessage = { role: 'user', content: initialAsk };
			setMessages([userMessage]);
			setIsLoading(true);

			(async () => {
				try {
					const res = await fetch('/api/chat', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ messages: [userMessage] }),
					});
					const data = await res.json();
					if (!res.ok) throw new Error(data.error || 'Unknown error');
					setMessages((p) => [...p, { role: 'assistant', content: data.reply, meta: { ids: data.ids || [] } }]);
				} catch (e) {
					setMessages((p) => [...p, { role: 'assistant', content: `Error: ${e.message}` }]);
				} finally {
					setIsLoading(false);
				}
			})();
		}
	}, [searchParams, messages.length]);

	useEffect(() => {
		if (messages.length === 0) return;
		localStorage.setItem('chat_messages', JSON.stringify(messages));
		const last = messages[messages.length - 1];
		if (last?.role !== 'assistant') return;
		let productIds = Array.isArray(last?.meta?.ids) ? last.meta.ids.filter((x) => Number.isFinite(x)) : [];
		if (!productIds.length && typeof last.content === 'string') {
			const matches = Array.from(last.content.matchAll(/\[ID:(\d+)\]/g));
			productIds = matches.map((m) => parseInt(m[1], 10)).filter((n) => Number.isFinite(n));
		}

		// 3) Deduplicate sambil mempertahankan urutan
		const seen = new Set();
		productIds = productIds.filter((id) => (seen.has(id) ? false : (seen.add(id), true)));

		// 4) Map ke produk; jika tidak ada ID → kosongkan rekomendasi
		if (productIds.length) {
			const found = productIds.map((id) => products.find((p) => p.id === id)).filter(Boolean);
			setRecommendedProducts(found);
		} else {
			setRecommendedProducts([]);
		}
	}, [messages, products]);

	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages, isLoading]);

	useEffect(() => {
		if (!isModalOpen) return;
		const t = setTimeout(() => {
			modalEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
		}, 50);
		return () => clearTimeout(t);
	}, [isModalOpen, isComparing, comparisonResult, followupThread]);

	const isSelectedForCompare = (p) => comparisonList.some((x) => x.id === p.id);

	const toggleCompare = (product) => {
		setComparisonList((prev) => {
			const exist = prev.find((p) => p.id === product.id);
			if (exist) return prev.filter((p) => p.id !== product.id);
			if (prev.length < 2) return [...prev, product];
			return prev;
		});
	};

	const handleStartComparison = async () => {
		if (comparisonList.length !== 2) return;
		setComparedPair([comparisonList[0], comparisonList[1]]);
		setIsComparing(true);
		setComparisonResult('');
		setFollowupThread([]);
		setIsModalOpen(true);

		try {
			const res = await fetch('/api/compare', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					productA: comparisonList[0],
					productB: comparisonList[1],
					userPersona: 'Pengguna yang mencari nilai terbaik untuk uang.',
				}),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Gagal membandingkan');
			setComparisonResult(data.reply);
		} catch (e) {
			setComparisonResult(`Terjadi kesalahan: ${e.message}`);
		} finally {
			setIsComparing(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!input.trim()) return;
		const user = { role: 'user', content: input };
		const next = [...messages, user];
		setMessages(next);
		setInput('');
		setIsLoading(true);
		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: next }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Unknown error');
			setMessages((p) => [...p, { role: 'assistant', content: data.reply, meta: { ids: data.ids || [] } }]);
		} catch (e) {
			setMessages((p) => [...p, { role: 'assistant', content: `Error: ${e.message}` }]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleFollowupSubmit = async (e) => {
		e.preventDefault();
		const q = followupInput.trim();
		if (!q || comparedPair.length !== 2) return;

		const newThread = [...followupThread, { role: 'user', content: q }];
		setFollowupThread(newThread);
		setFollowupInput('');
		setIsFollowupLoading(true);

		const context =
			`KONTEKS PERBANDINGAN (WAJIB):\n` +
			`Produk A: ${JSON.stringify(comparedPair[0])}\n` +
			`Produk B: ${JSON.stringify(comparedPair[1])}\n` +
			`Ringkasan AI:\n${comparisonResult}\n` +
			`Jawab hanya terkait kedua produk. Jika tidak tahu, jujur + sarankan cara cek.`;

		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: newThread, context }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Gagal jawaban lanjutan');
			setFollowupThread((p) => [...p, { role: 'assistant', content: data.reply }]);
		} catch (e) {
			setFollowupThread((p) => [...p, { role: 'assistant', content: `Error: ${e.message}` }]);
		} finally {
			setIsFollowupLoading(false);
		}
	};

	const formatIDR = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number.isFinite(n) ? n : 0);

	return (
		<div className="h-[calc(100vh-4rem)] w-full bg-gradient-to-br from-slate-50 to-slate-100">
			<div className="container mx-auto h-full w-full">
				<div className="sticky top-0 z-10 mb-3 rounded-xl border bg-white/80 backdrop-blur">
					<div className="flex items-center justify-between gap-3 ">
						{/* <div className="text-sm font-semibold text-slate-700">AI Shop Assistant</div> */}
						{/* MOBILE: buka rekomendasi */}
						<div className="md:hidden">
							<Sheet>
								<SheetTrigger asChild>
									<Button variant="outline" size="sm" className="gap-2">
										<ListFilter className="h-4 w-4" />
										Rekomendasi
									</Button>
								</SheetTrigger>
								<SheetContent side="left" className="w-[90vw] sm:w-[420px]">
									<SheetHeader>
										<SheetTitle>Produk Rekomendasi</SheetTitle>
									</SheetHeader>
									<div className="mt-3">
										<RecList items={recommendedProducts} formatIDR={formatIDR} isSelectedForCompare={isSelectedForCompare} toggleCompare={toggleCompare} />
										<div className="mt-3">
											<DebateBar count={comparisonList.length} disabled={comparisonList.length !== 2 || isComparing} isComparing={isComparing} onClick={handleStartComparison} />
										</div>
									</div>
								</SheetContent>
							</Sheet>
						</div>
					</div>
				</div>

				{/* 2 kolom: kiri rekomendasi, kanan chat */}
				<div className="grid h-[calc(100%-4.5rem)] min-h-0 grid-cols-1 gap-4 md:grid-cols-[1fr_1.6fr]">
					{/* LEFT: rekomendasi (desktop) */}
					<aside className="hidden min-h-0 flex-col gap-4 md:flex">
						<div className="rounded-2xl border bg-white/80 p-4 ring-1 ring-slate-200">
							<div className="mb-3">
								<h2 className="text-sm font-semibold">Produk Rekomendasi</h2>
								<p className="text-xs text-slate-500">Dari jawaban AI-mu</p>
							</div>
							<ScrollArea className="h-[calc(100vh-16rem)] pr-1">
								<RecList items={recommendedProducts} formatIDR={formatIDR} isSelectedForCompare={isSelectedForCompare} toggleCompare={toggleCompare} />
								<ScrollBar orientation="vertical" />
							</ScrollArea>
							<div className="mt-3">
								<DebateBar count={comparisonList.length} disabled={comparisonList.length !== 2 || isComparing} isComparing={isComparing} onClick={handleStartComparison} />
							</div>
						</div>
					</aside>

					{/* RIGHT: chat */}
					<section className="min-h-0 overflow-hidden rounded-2xl border bg-white ring-1 ring-slate-200">
						{/* messages */}
						<ScrollArea className="h-[calc(100%-72px)] px-4 sm:px-6 py-4">
							<div className="space-y-4">
								{messages.map((msg, i) => (
									<div key={`${msg.role}-${i}`} className={`flex overflow-y-auto  ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
										<div className={`${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'} max-w-2xl rounded-2xl px-4 py-2 shadow-sm`}>
											<div className="prose prose-invert ">
												<ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
											</div>
										</div>
									</div>
								))}

								{isLoading && (
									<div className="flex justify-start">
										<div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-slate-600">
											<Loader2 className="h-4 w-4 animate-spin" /> AI is thinking...
										</div>
									</div>
								)}

								{messages.length === 0 && !isLoading && <EmptyState title="Mulai percakapan" description="Minta rekomendasi, saran budget, atau tempel spesifikasi—AI bantu merangkum." icon={<ArrowRight className="h-4 w-4" />} />}

								<div ref={chatEndRef} />
							</div>
						<ScrollBar orientation="vertical" />
						</ScrollArea>

						{/* composer */}
						<div className="border-t border-slate-200 p-3">
							<form onSubmit={handleSubmit} className="flex gap-2">
								<input
									value={input}
									onChange={(e) => setInput(e.target.value)}
									placeholder="Ketik pesan Anda..."
									className="flex-1 rounded-xl border p-3 text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
									disabled={isLoading}	
								/>
								<button type="submit" disabled={isLoading} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-blue-300">
									<Send className="h-4 w-4" />
								</button>
							</form>
						</div>
					</section>
				</div>
			</div>

			{/* MODAL hasil debat + follow-up */}
			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen} modal={false}>
				<DialogContent className="flex h-[85vh] max-w-4xl flex-col gap-3 p-0 overflow-hidden">
					<DialogHeader className="px-5 pt-5">
						<DialogTitle className="text-base font-semibold">Debat Produk</DialogTitle>

						{comparedPair.length === 2 && (
							<div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
								<span className="rounded-full bg-blue-50 px-2.5 py-1 font-medium text-blue-700 ring-1 ring-blue-200">A: {comparedPair[0].nama}</span>
								<span className="rounded-full bg-purple-50 px-2.5 py-1 font-medium text-purple-700 ring-1 ring-purple-200">B: {comparedPair[1].nama}</span>
							</div>
						)}
					</DialogHeader>

					{/* body scrollable */}
					<div className="min-h-0 flex-1">
						<ScrollArea className="h-full px-5 pb-2">
							{isComparing ? (
								<div className="grid h-full place-items-center text-slate-600">
									<div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2">
										<Loader2 className="h-4 w-4 animate-spin" /> AI sedang menganalisis...
									</div>
								</div>
							) : (
								<div className="prose max-w-none">
									<ReactMarkdown remarkPlugins={[remarkGfm]}>{comparisonResult || '_Belum ada ringkasan._'}</ReactMarkdown>
								</div>
							)}

							{followupThread.length > 0 && (
								<div className="mt-4 space-y-3 border-t pt-3">
									{followupThread.map((m, idx) => (
										<div key={`${m.role}-${idx}`} className={`${m.role === 'user' ? 'bg-blue-50' : 'bg-slate-50'} rounded-xl p-3`}>
											<div className="prose max-w-none">
												<ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
											</div>
										</div>
									))}
								</div>
							)}

							{/* anchor untuk autoscroll modal */}
							<div ref={modalEndRef} className="h-2" />
							<ScrollBar orientation="vertical" />
						</ScrollArea>
					</div>

					{/* footer sticky */}
					<DialogFooter className="border-t bg-white/80 px-5 py-3 backdrop-blur">
						<form onSubmit={handleFollowupSubmit} className="flex w-full items-center gap-2">
							<input
								value={followupInput}
								onChange={(e) => setFollowupInput(e.target.value)}
								placeholder="Tanya detail lanjutan tentang dua produk ini..."
								className="flex-1 rounded-xl border p-3 text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
							/>
							<button type="submit" disabled={isFollowupLoading} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-blue-300">
								{isFollowupLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
								<span className="sr-only">Kirim</span>
							</button>
						</form>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

/* ===== komponen kecil ===== */

function RecList({ items, formatIDR, isSelectedForCompare, toggleCompare }) {
	if (!items || items.length === 0) {
		return <EmptyState title="Belum ada rekomendasi" description="Saat AI memberi saran, produk muncul di sini." />;
	}

	return (
		<div className="space-y-3">
			{items.map((product, idx) => (
				<div key={`${product.id}-${product.nama}-${idx}`} className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 transition-all hover:border-slate-300 hover:shadow-sm">
					<Image src={product.gambar} alt={product.nama} width={64} height={64} className="h-16 w-16 rounded-lg object-cover" />
					<div className="min-w-0 flex-1">
						<p className="truncate font-medium">{product.nama}</p>
						<p className="font-semibold text-blue-600">{formatIDR(product.harga)}</p>
					</div>

					<div className="flex items-center gap-2">
						<button
							onClick={() => toggleCompare(product)}
							className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
								isSelectedForCompare(product) ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
							}`}
							aria-label={isSelectedForCompare(product) ? 'Hapus dari perbandingan' : 'Tambah ke perbandingan'}
						>
							<Scale className="h-4 w-4" />
							{isSelectedForCompare(product) ? 'Dipilih' : 'Bandingkan'}
						</button>

						<Link href={`/products/${product.id}`} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50" aria-label={`Detail ${product.nama}`}>
							Detail <ArrowRight className="h-4 w-4" />
						</Link>
					</div>
				</div>
			))}
		</div>
	);
}

function DebateBar({ count, disabled, isComparing, onClick }) {
	return (
		<Button onClick={onClick} disabled={disabled} className="inline-flex w-full items-center justify-center gap-2 rounded-xl">
			{isComparing ? (
				<>
					<Loader2 className="h-4 w-4 animate-spin" /> AI Sedang Berdebat...
				</>
			) : (
				<>
					<Sparkles className="h-4 w-4" /> Debatkan {count}/2 Produk
				</>
			)}
		</Button>
	);
}

function EmptyState({ title, description, icon }) {
	return (
		<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-slate-50 px-4 py-10 text-center text-slate-600">
			<div className="mb-2">{icon ?? <Loader2 className="h-5 w-5" />}</div>
			<p className="font-medium">{title}</p>
			<p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
		</div>
	);
}

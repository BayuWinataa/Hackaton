'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
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

function ChatPageContent() {
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
		if (!chatEndRef.current) return;
		chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
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
			<div className="container mx-auto h-full w-full px-2 sm:px-4 lg:px-6">
				<div className="sticky top-0 z-10 mb-2 sm:mb-3 rounded-xl border bg-white/80 backdrop-blur">
					<div className="flex items-center justify-between gap-3 p-2 sm:p-3">
						{/* MOBILE: buka rekomendasi */}
						<div className="md:hidden">
							<Sheet>
								<SheetTrigger asChild>
									<Button variant="outline" size="sm" className="gap-2 text-xs sm:text-sm">
										<ListFilter className="h-3 w-3 sm:h-4 sm:w-4" />
										<span className="hidden xs:inline">Rekomendasi</span>
										<span className="xs:hidden">Rec</span>
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
				<div className="flex flex-col md:grid h-[calc(100%-3.5rem)] sm:h-[calc(100%-4.5rem)] min-h-0 gap-2 sm:gap-4 md:grid-cols-[320px_1fr] lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr]">
					{/* LEFT: rekomendasi (desktop) */}
					<aside className="hidden min-h-0 flex-col gap-4 md:flex order-1 md:order-none">
						<div className="flex flex-col h-full rounded-2xl border bg-white/80 ring-1 ring-slate-200 overflow-hidden">
							<div className="flex-shrink-0 p-4 border-b border-slate-200">
								<h2 className="text-sm font-semibold">Produk Rekomendasi</h2>
								<p className="text-xs text-slate-500">Dari jawaban AI-mu</p>
							</div>
							<div className="flex-1 min-h-0 p-4">
								<ScrollArea className="h-full pr-2">
									<RecList items={recommendedProducts} formatIDR={formatIDR} isSelectedForCompare={isSelectedForCompare} toggleCompare={toggleCompare} />
									<ScrollBar orientation="vertical" />
								</ScrollArea>
							</div>
							<div className="flex-shrink-0 p-4 border-t border-slate-200 bg-slate-50/50">
								<DebateBar count={comparisonList.length} disabled={comparisonList.length !== 2 || isComparing} isComparing={isComparing} onClick={handleStartComparison} />
							</div>
						</div>
					</aside>

					{/* RIGHT: chat */}
					<section className="flex min-h-0 flex-col overflow-hidden rounded-xl sm:rounded-2xl border bg-white shadow-sm ring-1 ring-slate-200">
						{/* Messages viewport - following reference pattern */}
						<div ref={chatEndRef} className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-6">
							<div className="mx-auto flex max-w-4xl flex-col gap-3 sm:gap-4">
								{messages.map((msg, i) => (
									<MessageBubble key={`${msg.role}-${i}`} role={msg.role} content={msg.content} />
								))}

								{isLoading && (
									<div className="flex justify-start">
										<div className="inline-flex items-center gap-2 rounded-lg sm:rounded-xl bg-slate-100 px-3 sm:px-4 py-2 sm:py-3 text-slate-600">
											<Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
											<span className="text-xs sm:text-sm">AI is thinking...</span>
										</div>
									</div>
								)}

								{messages.length === 0 && !isLoading && (
									<div className="flex h-full items-center justify-center">
										<EmptyState title="Mulai percakapan" description="Minta rekomendasi, saran budget, atau tempel spesifikasi—AI bantu merangkum." icon={<ArrowRight className="h-4 w-4" />} />
									</div>
								)}
							</div>
						</div>

						{/* Composer - following reference pattern */}
						<div className="border-t border-slate-200 p-3 sm:p-4">
							<form onSubmit={handleSubmit} className="mx-auto flex max-w-4xl items-end gap-2 sm:gap-3">
								<input
									value={input}
									onChange={(e) => setInput(e.target.value)}
									placeholder="Ketik pesan Anda..."
									className="flex-1 min-h-[2.5rem] rounded-lg sm:rounded-xl border border-slate-300 px-3 py-2 sm:py-3 text-sm sm:text-base text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 placeholder:text-slate-500"
									disabled={isLoading}
								/>
								<button
									type="submit"
									disabled={isLoading}
									className="inline-flex h-10 sm:h-12 items-center justify-center rounded-lg sm:rounded-xl bg-blue-600 px-4 sm:px-5 text-white transition-colors hover:bg-blue-700 disabled:bg-blue-300"
								>
									<Send className="h-4 w-4 sm:mr-2" />
									<span className="hidden sm:inline text-sm font-medium">Send</span>
								</button>
							</form>
						</div>
					</section>
				</div>
			</div>

			{/* MODAL hasil debat + follow-up */}
			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen} modal={false}>
				<DialogContent className="flex h-[85vh] max-w-[95vw] sm:max-w-4xl flex-col gap-2 sm:gap-3 p-0 overflow-hidden mx-2 sm:mx-auto">
					<DialogHeader className="px-3 sm:px-5 pt-3 sm:pt-5">
						<DialogTitle className="text-sm sm:text-base font-semibold">Debat Produk</DialogTitle>

						{comparedPair.length === 2 && (
							<div className="mt-2 flex flex-wrap items-center gap-1 sm:gap-2 text-xs">
								<span className="rounded-full bg-blue-50 px-2 sm:px-2.5 py-0.5 sm:py-1 font-medium text-blue-700 ring-1 ring-blue-200 text-xs">A: {comparedPair[0].nama}</span>
								<span className="rounded-full bg-purple-50 px-2 sm:px-2.5 py-0.5 sm:py-1 font-medium text-purple-700 ring-1 ring-purple-200 text-xs">B: {comparedPair[1].nama}</span>
							</div>
						)}
					</DialogHeader>

					{/* body scrollable */}
					<div className="min-h-0 flex-1">
						<ScrollArea className="h-full px-3 sm:px-5 pb-2">
							{isComparing ? (
								<div className="grid h-full place-items-center text-slate-600">
									<div className="inline-flex items-center gap-2 rounded-lg sm:rounded-xl bg-slate-100 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm">
										<Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" /> AI sedang menganalisis...
									</div>
								</div>
							) : (
								<div className="prose prose-sm sm:prose max-w-none [&>*]:my-1 sm:[&>*]:my-2 [&_p]:leading-relaxed text-sm sm:text-base">
									<ReactMarkdown remarkPlugins={[remarkGfm]}>{comparisonResult || '_Belum ada ringkasan._'}</ReactMarkdown>
								</div>
							)}

							{followupThread.length > 0 && (
								<div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 border-t pt-2 sm:pt-3">
									{followupThread.map((m, idx) => (
										<div key={`${m.role}-${idx}`} className={`${m.role === 'user' ? 'bg-blue-50' : 'bg-slate-50'} rounded-lg sm:rounded-xl p-2 sm:p-3`}>
											<div className="prose prose-sm sm:prose max-w-none [&>*]:my-1 sm:[&>*]:my-2 [&_p]:leading-relaxed text-sm sm:text-base">
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
					<DialogFooter className="border-t bg-white/80 px-3 sm:px-5 py-2 sm:py-3 backdrop-blur">
						<form onSubmit={handleFollowupSubmit} className="flex w-full items-center gap-1.5 sm:gap-2">
							<input
								value={followupInput}
								onChange={(e) => setFollowupInput(e.target.value)}
								placeholder="Tanya detail lanjutan tentang dua produk ini..."
								className="flex-1 rounded-lg sm:rounded-xl border p-2 sm:p-3 text-sm sm:text-base text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
							/>
							<button
								type="submit"
								disabled={isFollowupLoading}
								className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-blue-600 px-3 sm:px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-blue-300 min-w-[44px] justify-center"
							>
								{isFollowupLoading ? <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" /> : <Send className="h-3 w-3 sm:h-4 sm:w-4" />}
								<span className="sr-only">Kirim</span>
							</button>
						</form>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);

	// MessageBubble component inside the main component - removed avatars
	function MessageBubble({ role, content }) {
		const isUser = role === 'user';
		return (
			<div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
				<div className={`max-w-[85%] sm:max-w-[80%] md:max-w-[75%] ${isUser ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'} rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm`}>
					<div className="prose prose-invert prose-sm sm:prose max-w-none break-words whitespace-pre-wrap leading-relaxed [&>*]:my-1 sm:[&>*]:my-2 [&_p]:leading-relaxed [&_pre]:text-xs sm:[&_pre]:text-sm [&_pre]:overflow-x-auto [&_code]:text-xs sm:[&_code]:text-sm">
						<ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
					</div>
				</div>
			</div>
		);
	}
}

/* ===== komponen kecil ===== */

function RecList({ items, formatIDR, isSelectedForCompare, toggleCompare }) {
	if (!items || items.length === 0) {
		return <EmptyState title="Belum ada rekomendasi" description="Saat AI memberi saran, produk muncul di sini." />;
	}

	return (
		<div className="space-y-3">
			{items.map((product, idx) => (
				<div key={`${product.id}-${product.nama}-${idx}`} className="group flex flex-col w-full rounded-lg sm:rounded-xl border border-slate-200 p-3 transition-all hover:border-slate-300 hover:shadow-sm">
					{/* Bagian atas: Gambar dan info produk */}
					<div className="flex items-center gap-3 mb-3">
						<Image src={product.gambar} alt={product.nama} width={64} height={64} className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-md sm:rounded-lg object-cover flex-shrink-0" />
						<div className="min-w-0 flex-1">
							<p className="font-medium text-sm sm:text-base leading-tight mb-1">{product.nama}</p>
							<p className="font-semibold text-blue-600 text-sm sm:text-base">{formatIDR(product.harga)}</p>
						</div>
					</div>

					{/* Bagian bawah: Tombol aksi */}
					<div className="flex gap-2 pt-2 border-t border-slate-100">
						<button
							onClick={() => toggleCompare(product)}
							className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
								isSelectedForCompare(product) ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
							}`}
							aria-label={isSelectedForCompare(product) ? 'Hapus dari perbandingan' : 'Tambah ke perbandingan'}
						>
							<Scale className="h-4 w-4 flex-shrink-0" />
							<span>{isSelectedForCompare(product) ? 'Dipilih' : 'Bandingkan'}</span>
						</button>

						<Link
							href={`/products/${product.id}`}
							className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
							aria-label={`Detail ${product.nama}`}
						>
							<span>Detail</span>
							<ArrowRight className="h-4 w-4 flex-shrink-0" />
						</Link>
					</div>
				</div>
			))}
		</div>
	);
}

function DebateBar({ count, disabled, isComparing, onClick }) {
	return (
		<Button onClick={onClick} disabled={disabled} className="inline-flex w-full items-center justify-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl text-xs sm:text-sm py-2 sm:py-2.5">
			{isComparing ? (
				<>
					<Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
					<span className="hidden sm:inline">AI Sedang Berdebat...</span>
					<span className="sm:hidden">Berdebat...</span>
				</>
			) : (
				<>
					<Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
					<span className="hidden sm:inline">Debatkan {count}/2 Produk</span>
					<span className="sm:hidden">Debat {count}/2</span>
				</>
			)}
		</Button>
	);
}

function EmptyState({ title, description, icon }) {
	return (
		<div className="flex flex-col items-center justify-center rounded-lg sm:rounded-2xl border border-dashed bg-slate-50 px-3 sm:px-4 py-6 sm:py-10 text-center text-slate-600">
			<div className="mb-2">{icon ?? <Loader2 className="h-4 w-4 sm:h-5 sm:w-5" />}</div>
			<p className="font-medium text-sm sm:text-base">{title}</p>
			<p className="mt-1 max-w-sm text-xs sm:text-sm text-slate-500">{description}</p>
		</div>
	);
}

// Loading component for Suspense boundary
function ChatPageLoading() {
	return (
		<div className="h-[calc(100vh-4rem)] w-full bg-gradient-to-br from-slate-50 to-slate-100">
			<div className="container mx-auto h-full w-full flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
					<p className="text-slate-600">Loading chat...</p>
				</div>
			</div>
		</div>
	);
}

// Main export with Suspense boundary
export default function ChatPage() {
	return (
		<Suspense fallback={<ChatPageLoading />}>
			<ChatPageContent />
		</Suspense>
	);
}

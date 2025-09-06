'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Scale, Sparkles, Send, Loader2, Check, X, ArrowRight, MessageSquare } from 'lucide-react';
import gambar from '@/app/assets/kobo.jpg';
import products from '@/../products.json';

export default function ChatPage() {
    // Chat state
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Product state
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // AI Debate state
    const [comparisonList, setComparisonList] = useState([]);
    const [isComparing, setIsComparing] = useState(false);
    const [comparisonResult, setComparisonResult] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // NEW: simpan pasangan produk yang dibandingkan
    const [comparedPair, setComparedPair] = useState([]);

    // NEW: thread & input follow-up khusus modal
    const [followupInput, setFollowupInput] = useState('');
    const [followupThread, setFollowupThread] = useState([]); // { role: 'user' | 'assistant', content: string }
    const [isFollowupLoading, setIsFollowupLoading] = useState(false);

    // Load chat from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem('chat_messages');
            if (saved) setMessages(JSON.parse(saved));
        } catch (err) {
            console.error('Failed to load messages from localStorage', err);
        }
    }, []);

    // Persist chat & parse product IDs from assistant reply
useEffect(() => {
    if (messages.length > 0) {
        localStorage.setItem('chat_messages', JSON.stringify(messages));
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
            const ids = lastMessage.content.match(/\[ID:(\d+)\]/g) || [];
            if (ids.length > 0) {
                const productIds = ids.map((idString) => parseInt(idString.match(/\d+/)[0]));
                const foundProducts = productIds.map((id) => products.find((p) => p.id === id)).filter(Boolean);
                setRecommendedProducts(foundProducts);
            } else {
                // fallback: kalau AI tidak kasih ID sama sekali, tampilkan semua produk
                setRecommendedProducts(products);
            }
        }
    }
}, [messages]);
 -

    // Auto-select first product when recommendations appear
    useEffect(() => {
        if (!selectedProduct && recommendedProducts.length > 0) {
            setSelectedProduct(recommendedProducts[0]);
        }
    }, [recommendedProducts, selectedProduct]);

    const isSelectedForCompare = (p) => comparisonList.some((x) => x.id === p.id);

    const toggleCompare = (product) => {
        setComparisonList((prev) => {
            const exists = prev.find((p) => p.id === product.id);
            if (exists) return prev.filter((p) => p.id !== product.id);
            if (prev.length < 2) return [...prev, product];
            return prev; // ignore if already 2 selected
        });
    };

    const handleStartComparison = async () => {
        if (comparisonList.length !== 2) return;

        setComparedPair([comparisonList[0], comparisonList[1]]); // NEW
        setIsComparing(true);
        setComparisonResult('');
        setFollowupThread([]); // NEW
        setIsModalOpen(true);

        try {
            const response = await fetch('/api/compare', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productA: comparisonList[0],
                    productB: comparisonList[1],
                    userPersona: 'Pengguna yang mencari nilai terbaik untuk uang.',
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Gagal mendapatkan perbandingan dari AI.');
            setComparisonResult(data.reply);
        } catch (error) {
            setComparisonResult(`Terjadi kesalahan: ${error.message}`);
        } finally {
            setIsComparing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'An unknown error occurred');
            }
            const data = await response.json();
            setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
        } catch (err) {
            console.error('Failed to get response from AI', err);
            setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${err.message}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    // NEW: follow-up Q&A di dalam dialog
    const handleFollowupSubmit = async (e) => {
        e.preventDefault();
        const q = followupInput.trim();
        if (!q || comparedPair.length !== 2) return;

        const newThread = [...followupThread, { role: 'user', content: q }];
        setFollowupThread(newThread);
        setFollowupInput('');
        setIsFollowupLoading(true);

        // context: kasih dua produk + ringkasan hasil debat
        const context =
            `KONTEKS PERBANDINGAN (WAJIB DIPAKAI):\n` +
            `Produk A: ${JSON.stringify(comparedPair[0])}\n` +
            `Produk B: ${JSON.stringify(comparedPair[1])}\n` +
            `Ringkasan AI sebelumnya:\n${comparisonResult}\n` +
            `Instruksi: Jawab pertanyaan user hanya terkait dua produk ini. ` +
            `Jika info tidak tersedia, bilang jujur lalu sarankan cara cek (tanpa mengarang). ` +
            `Gunakan Markdown rapi dan bullet points bila perlu.`;

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newThread, context }), // <— kirim context
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Gagal mendapatkan jawaban lanjutan.');
            setFollowupThread((prev) => [...prev, { role: 'assistant', content: data.reply }]);
        } catch (err) {
            setFollowupThread((prev) => [...prev, { role: 'assistant', content: `Error: ${err.message}` }]);
        } finally {
            setIsFollowupLoading(false);
        }
    };

    // Memoized empty states
    const hasRecommendations = recommendedProducts.length > 0;

    return (
        <div className="h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800">
            <div className="mx-auto h-full max-w-7xl grid grid-rows-[auto_1fr]">
                {/* Header */}
                <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-slate-200">
                    <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
                        <div className="h-9 w-9 grid place-items-center rounded-xl bg-slate-900 text-white shadow-sm">
                            <MessageSquare className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-lg font-semibold tracking-tight">AI Shop Assistant</h1>
                            <p className="text-xs text-slate-500">Cari, bandingkan, dan debatkan produk dengan AI</p>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="grid h-full grid-cols-1 md:grid-cols-2">
                    {/* LEFT: Products */}
                    <section className="hidden md:flex h-full flex-col gap-6 p-6">
                        {/* Product Detail */}
                        <div className="bg-white/90 rounded-2xl shadow-sm ring-1 ring-slate-200 p-6">
                            <h2 className="text-xl font-bold mb-4">Detail Produk</h2>
                            {selectedProduct ? (
                                <div className="space-y-4">
                                    <Image src={gambar} alt={selectedProduct.nama} width={800} height={480} priority className="w-full h-64 object-cover rounded-xl" />
                                    <div>
                                        <h3 className="text-lg font-semibold tracking-tight">{selectedProduct.nama}</h3>
                                        <p className="text-blue-600 font-semibold text-lg my-1">Rp {selectedProduct.harga.toLocaleString('id-ID')}</p>
                                        <p className="text-slate-600 leading-relaxed">{selectedProduct.deskripsi}</p>
                                    </div>
                                </div>
                            ) : (
                                <EmptyState title="Belum ada produk terpilih" description="Pilih produk dari rekomendasi di bawah." />
                            )}
                        </div>

                        {/* Recommendations */}
                        <div className="flex-1 overflow-y-auto bg-white/90 rounded-2xl shadow-sm ring-1 ring-slate-200 p-6">
                            <h2 className="text-lg font-semibold mb-4">Produk Rekomendasi</h2>
                            {hasRecommendations ? (
                                <div className="space-y-3">
                                    {recommendedProducts.map((product) => (
                                        <button
                                            key={product.id}
                                            onClick={() => setSelectedProduct(product)}
                                            className={`group w-full text-left p-3 rounded-xl border transition-all flex items-center gap-4 hover:shadow-sm ${
                                                selectedProduct?.id === product.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                            aria-label={`Pilih produk ${product.nama}`}
                                        >
                                            <Image src={gambar} alt={product.nama} width={80} height={80} className="h-20 w-20 object-cover rounded-lg" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{product.nama}</p>
                                                <p className="text-blue-600 font-semibold">Rp {product.harga.toLocaleString('id-ID')}</p>
                                            </div>
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleCompare(product);
                                                }}
                                                className={`shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                                                    isSelectedForCompare(product) ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                                }`}
                                                role="button"
                                                aria-label={isSelectedForCompare(product) ? 'Hapus dari perbandingan' : 'Tambah ke perbandingan'}
                                            >
                                                <Scale className="h-4 w-4" />
                                                {isSelectedForCompare(product) ? 'Dipilih' : 'Bandingkan'}
                                            </span>
                                        </button>
                                    ))}

                                    {comparisonList.length > 0 && (
                                        <button
                                            onClick={handleStartComparison}
                                            disabled={comparisonList.length !== 2 || isComparing}
                                            className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white disabled:bg-green-300 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
                                        >
                                            {isComparing ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" /> AI Sedang Berdebat...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="h-4 w-4" /> Debatkan {comparisonList.length}/2 Produk
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <EmptyState title="Belum ada rekomendasi" description="AI akan merekomendasikan produk di sini..." />
                            )}
                        </div>
                    </section>

                    {/* RIGHT: Chat */}
                    <section className="flex h-full flex-col bg-white md:border-l md:border-slate-200">
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'} max-w-lg px-4 py-2 rounded-2xl shadow-sm`}>
                                        <div className="prose prose-invert max-w-none">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 text-slate-600">
                                        <Loader2 className="h-4 w-4 animate-spin" /> AI is thinking...
                                    </div>
                                </div>
                            )}

                            {messages.length === 0 && !isLoading && <EmptyState title="Mulai percakapan" description="Tanya apa saja: minta rekomendasi, bandingkan produk, atau paste spesifikasi." icon={<ArrowRight className="h-4 w-4" />} />}
                        </div>

                        {/* Composer */}
                        <div className="p-4 border-t border-slate-200">
                            <form onSubmit={handleSubmit} className="flex gap-2">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ketik pesan Anda..."
                                    className="flex-1 p-3 border rounded-xl text-slate-900 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                                    disabled={isLoading}
                                    aria-label="Ketik pesan"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                                    aria-label="Kirim pesan"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </form>
                        </div>
                    </section>
                </main>
            </div>

            {/* Comparison Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} modal={false}>
                <DialogContent className="max-w-4xl h-[85vh] flex flex-col gap-3">
                    <DialogHeader>
                        <DialogTitle>Hasil Debat Produk AI</DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto pr-1 space-y-4">
                        {isComparing ? (
                            <div className="h-full grid place-items-center text-slate-600">
                                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100">
                                    <Loader2 className="h-4 w-4 animate-spin" /> AI sedang menganalisis...
                                </div>
                            </div>
                        ) : (
                            <div className="prose max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{comparisonResult}</ReactMarkdown>
                            </div>
                        )}

                        {/* NEW: thread follow-up di dalam dialog */}
                        {followupThread.length > 0 && (
                            <div className="space-y-3 border-t pt-3">
                                {followupThread.map((m, idx) => (
                                    <div key={idx} className={`${m.role === 'user' ? 'bg-blue-50' : 'bg-slate-50'} rounded-xl p-3`}>
                                        <div className="prose max-w-none">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <DialogFooter className="flex flex-col gap-2">
                        {/* NEW: input follow-up */}
                        <form onSubmit={handleFollowupSubmit} className="w-full flex items-center gap-2">
                            <input
                                value={followupInput}
                                onChange={(e) => setFollowupInput(e.target.value)}
                                placeholder="Tanya detail lanjutan tentang dua produk ini..."
                                className="flex-1 p-3 border rounded-xl text-slate-900 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                                aria-label="Pertanyaan lanjutan"
                            />
                            <button type="submit" disabled={isFollowupLoading} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 transition-colors">
                                {isFollowupLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                <span className="sr-only">Kirim pertanyaan lanjutan</span>
                            </button>
                        </form>

                        {/* <button onClick={() => setIsModalOpen(false)} className="inline-flex self-end items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200" aria-label="Tutup hasil debat">
                            <X className="h-4 w-4" /> Tutup
                        </button> */}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

/** --------------------- Utility UI ---------------------- */
function EmptyState({ title, description, icon }) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-10 px-4 border border-dashed rounded-2xl bg-slate-50 text-slate-600">
            <div className="mb-2">{icon ?? <Loader2 className="h-5 w-5" />}</div>
            <p className="font-medium">{title}</p>
            <p className="text-sm text-slate-500 mt-1 max-w-sm">{description}</p>
        </div>
    );
}

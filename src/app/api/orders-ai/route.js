// app/api/orders-ai/route.js
import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import products from '@/../products.json'; // ← katalog resmi

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
	try {
		const { messages = [], context = '' } = await req.json();

		// Siapkan katalog yang diperbolehkan (id + nama saja untuk ringkas)
		const allowedCatalog = products.map((p) => ({ id: p.id, nama: p.nama }));

		const system = `
Anda adalah asisten AI untuk pertanyaan terkait pesanan/order pengguna.

ATURAN SANGAT PENTING (WAJIB DIIKUTI):
- Rekomendasi produk HANYA boleh berasal dari "ALLOWED_CATALOG" yang diberikan.
- JANGAN menyarankan produk di luar katalog, meskipun relevan.
- Jika tidak ada yang cocok, katakan dengan jujur "Tidak ada rekomendasi dari katalog."
- Tulis jawaban utama dalam Markdown ringkas.
- Jangan sertakan properti lain di JSON. Pastikan ID valid (ada di katalog).
- Berikan link ke produk jika ada (misal: /products/{id}).
- Gunakan bahasa Indonesia yang santai dan ramah.
- Jawab hanya berdasarkan informasi yang diberikan, jangan menebak.
    `.trim();

		const model = 'llama-3.1-8b-instant';

		const chain = [
			{ role: 'system', content: system },
			{ role: 'user', content: `ALLOWED_CATALOG:\n${JSON.stringify(allowedCatalog, null, 2)}` },
			{ role: 'user', content: `KONTEKS ORDER PENGGUNA:\n${context}` },
			...messages.map((m) => ({ role: m.role, content: m.content })),
		];

		const chat = await groq.chat.completions.create({
			model,
			messages: chain,
			temperature: 0.4,
			max_tokens: 1000,
		});

		const reply = chat?.choices?.[0]?.message?.content || 'Maaf, tidak dapat menjawab saat ini.';
		return NextResponse.json({ reply });
	} catch (err) {
		console.error('orders-ai error:', err);
		return NextResponse.json({ error: `Orders AI Error: ${err.message}` }, { status: 500 });
	}
}

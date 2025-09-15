// app/api/dash-ai/route.js
import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
	try {
		const { messages = [], context = '' } = await req.json();

		const system = `
Anda adalah asisten belanja personal yang super ringkas dan to the point.
Gunakan konteks "Riwayat Pesanan" untuk memberi jawaban yang relevan: rekomendasi, status, saran produk lanjutan, dan ringkasan pembelian.
Format: gunakan Markdown sederhana (heading pendek, bullet bila perlu), hindari paragraf panjang.
Jika data tidak ada di konteks, katakan jujur dan beri langkah praktis.
    `.trim();

		const model = 'meta-llama/llama-4-scout-17b-16e-instruct'; 

		const chain = [{ role: 'system', content: system }, { role: 'user', content: `=== KONTEKS ===\n${context}\n=== AKHIR KONTEXT ===` }, ...messages.map((m) => ({ role: m.role, content: m.content }))];

		const chat = await groq.chat.completions.create({
			model,
			messages: chain,
			temperature: 0.6,
			max_tokens: 1200,
		});

		const reply = chat.choices?.[0]?.message?.content || 'Maaf, saya tidak bisa menjawab saat ini.';
		return NextResponse.json({ reply });
	} catch (err) {
		console.error('dash-ai error:', err);
		return NextResponse.json({ error: `Dash AI Error: ${err.message}` }, { status: 500 });
	}
}

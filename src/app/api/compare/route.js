// File: app/api/compare/route.js
import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
	try {
		const { productA, productB, userPersona } = await req.json();

		const systemMessage = `Anda adalah seorang reviewer produk yang sangat objektif dan ahli.
        Tugas Anda adalah membuat perbandingan dalam format 'debat' antara dua produk yang data JSON-nya diberikan.
        Fokus pada perbandingan yang relevan dengan persona pengguna.
        
        ATURAN FORMAT BALASAN (SANGAT PENTING):
        1.  Gunakan format Markdown yang rapi (headings, bold, bullet points).
        2.  Mulai dengan judul perbandingan, contoh: ": [Nama Produk A] vs [Nama Produk B]**".
        3.  Buat bagian "Keunggulan Utama" untuk masing-masing produk.
        4.  Buat bagian "Potensi Kelemahan" untuk masing-masing produk.
        5.  Akhiri dengan bagian "Kesimpulan & Rekomendasi" yang secara jelas merekomendasikan satu produk untuk persona pengguna yang diberikan, beserta alasannya.
        
        Persona Pengguna saat ini adalah: "${userPersona}"`;

		const chatCompletion = await groq.chat.completions.create({
			model: 'meta-llama/llama-4-maverick-17b-128e-instruct',
			messages: [
				{ role: 'system', content: systemMessage },
				{
					role: 'user',
					content: `Berikut adalah data untuk kedua produk:
                    Produk A: ${JSON.stringify(productA)}
                    Produk B: ${JSON.stringify(productB)}
                    
                    Sekarang, mulailah debatnya.`,
				},
			],
			temperature: 0.7,
			max_tokens: 2048,
		});

		const aiResponse = chatCompletion.choices[0].message.content || '';

		// Kirim balasan dalam satu paket JSON
		return NextResponse.json({ reply: aiResponse });
	} catch (error) {
		console.error('Error in comparison API:', error);
		return NextResponse.json({ error: `Comparison API Error: ${error.message}` }, { status: 500 });
	}
}

// File: app/api/chat/route.js
import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';
import products from '@/../products.json';

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY,
});

// --- Utils: sisipkan [ID:x] otomatis jika AI lupa ---
const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Menyisipkan token [ID:x] setelah nama produk yang terdeteksi,
 * hanya pada bagian teks di luar code fence ```.
 * Tidak akan menimpa jika sudah ada [ID:...] di dekatnya.
 */
function injectIdsIfMissing(text, catalog) {
	if (/\[ID:(\d+)\]/.test(text)) return text; // sudah ada ID

	const parts = text.split(/```/); // pisah code fences
	for (let i = 0; i < parts.length; i += 2) {
		let chunk = parts[i];
		for (const p of catalog) {
			const nameRe = new RegExp(`\\b${escapeRegExp(p.nama)}\\b(?![^\\[]*\\[ID:)`);
			if (nameRe.test(chunk)) {
				chunk = chunk.replace(nameRe, `${p.nama} [ID:${p.id}]`);
			}
		}
		parts[i] = chunk;
	}
	return parts.join('```');
}

export async function POST(req) {
	try {
		const { messages, context } = await req.json();

		const productInfo = JSON.stringify(
			products.map((p) => ({
				id: p.id,
				nama: p.nama,
				harga: p.harga,
				kategori: p.kategori,
				deskripsi: p.deskripsi,
				tags: p.tags,
			}))
		);

		const systemMessage = {
			role: 'system',
			content: `Anda adalah "ShopMate AI", asisten belanja ahli yang sangat ramah.
Tugas Anda adalah membantu pengguna menemukan produk terbaik dari katalog yang tersedia.
Berikut adalah seluruh katalog produk Anda dalam format JSON:
${productInfo}

${context ? `KONTEXT TAMBAHAN:\n${context}\n` : ''}

ATURAN INTERAKSI:
1. Selalu analisis permintaan pengguna untuk memahami niat mereka (misal: mencari hadiah, butuh untuk olahraga, dll).
2. JANGAN PERNAH merekomendasikan produk yang tidak ada di dalam daftar JSON di atas.
3. Jika produk yang dicari tidak ada, katakan dengan jujur dan tawarkan alternatif lain dari katalog.
4. Jika pengguna meminta rekomendasi untuk orang lain, ajukan pertanyaan singkat untuk memahami preferensi orang tersebut.
5. Jika pengguna menanyakan di luar konteks belanja, jawab dengan sopan namun arahkan kembali ke topik belanja.
6. Gunakan bahasa yang ramah dan santai, seolah-olah berbicara dengan teman dekat.

ATURAN FORMAT BALASAN (SANGAT PENTING):
1. Seluruh balasan HARUS menggunakan format Markdown.
2. Saat merekomendasikan produk, GUNAKAN DAFTAR BERPOIN (boleh gunakan '•' atau markdown list).
3. Saat merekomendasikan sebuah produk, sebutkan NAMA produknya dengan jelas.
4. Usahakan memberikan **minimal 3–5 produk** jika relevan, bukan hanya 1–2, agar pengguna punya lebih banyak pilihan.

Contoh balasan yang SEMPURNA:
"Tentu, untuk teman Anda yang suka fotografi, saya punya beberapa pilihan menarik:

• Kamera Mirrorless Alpha Z  – Kamera canggih yang sempurna untuk memulai vlogging dan fotografi.
• Drone Quadcopter Mini SkyView  – Cocok untuk mengambil gambar dari sudut pandang yang unik dan sinematik."
`,
		};

		const chatCompletion = await groq.chat.completions.create({
			messages: [systemMessage, ...messages],
			model: 'meta-llama/llama-4-maverick-17b-128e-instruct',
			temperature: 0.7,
			max_tokens: 1024,
		});

		const aiResponse = chatCompletion.choices[0].message.content || '';

		// Fallback: auto-sisipkan [ID:x] berdasarkan nama produk, jika AI lupa
		const catalog = products.map((p) => ({ id: p.id, nama: p.nama }));
		const finalReply = injectIdsIfMissing(aiResponse, catalog);

		return NextResponse.json({ reply: finalReply });
	} catch (error) {
		console.error('Error calling Groq API:', error);
		return NextResponse.json({ error: `Groq API Error: ${error.message}` }, { status: 500 });
	}
}

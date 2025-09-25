import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	const file = path.join(process.cwd(), 'products.json');
	const raw = fs.readFileSync(file, 'utf-8');
	const items = JSON.parse(raw);

	for (const p of items) {
		const name = String(p.nama || p.name || 'Produk');
		const price = Number(p.harga ?? p.price ?? 0) || 0;
		const image = p.gambar || p.image || null;
		const category = p.kategori || p.category || null;
		const description = p.deskripsi || p.description || null;
		const shortDescription = p.shortDescription || (description ? String(description).slice(0, 140) : null);

		await prisma.product.create({
			data: {
				// kalau ingin pakai id dari JSON (int) dan hindari konflik, hapus baris ini agar pakai autoincrement()
				name,
				price,
				image,
				category,
				description,
				shortDescription,
				stock: Number(p.stock ?? 0),
				// tagsJson: p.tags ? JSON.stringify(p.tags) : null,
			},
		});
	}

	console.log('Seeding selesai ✅');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

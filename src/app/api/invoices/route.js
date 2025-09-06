import { NextResponse } from 'next/server';

export async function GET() {
	// ganti ke DB kamu nanti; ini dummy
	const data = [
		{ id: 1, merchant: 'Toko A', invoiceDate: '2025-09-01', total: 125000 },
		{ id: 2, merchant: 'Toko B', invoiceDate: '2025-09-03', total: 89000 },
	];
	return NextResponse.json({ data });
}

'use client';

import { useEffect, useState } from 'react';

export default function DashboardPage() {
	const [invoices, setInvoices] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		(async () => {
			setLoading(true);
			try {
				const res = await fetch('/api/invoices', { cache: 'no-store' });
				if (res.ok) {
					const json = await res.json();
					setInvoices(json.data || []);
				}
			} catch {}
			setLoading(false);
		})();
	}, []);

	const totalBelanja = invoices.reduce((sum, x) => sum + (x.total || 0), 0);
	const merchants = new Set(invoices.map((x) => x.merchant).filter(Boolean));

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<div className="bg-white rounded-xl p-4 ring-1 ring-slate-200">
					<div className="text-sm text-slate-500">Total Invoice</div>
					<div className="text-2xl font-semibold">{invoices.length}</div>
				</div>
				<div className="bg-white rounded-xl p-4 ring-1 ring-slate-200">
					<div className="text-sm text-slate-500">Total Belanja</div>
					<div className="text-2xl font-semibold">Rp {totalBelanja.toLocaleString('id-ID')}</div>
				</div>
				<div className="bg-white rounded-xl p-4 ring-1 ring-slate-200">
					<div className="text-sm text-slate-500">Toko Unik</div>
					<div className="text-2xl font-semibold">{merchants.size}</div>
				</div>
			</div>

			<div className="bg-white rounded-xl ring-1 ring-slate-200 overflow-hidden">
				<div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
					<h2 className="text-base font-semibold">Latest Invoices</h2>
					<a href="/" className="text-sm text-blue-600 hover:underline">
						Kembali ke App
					</a>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full text-sm">
						<thead className="bg-slate-50">
							<tr className="text-left text-slate-600">
								<th className="px-4 py-2">ID</th>
								<th className="px-4 py-2">Toko</th>
								<th className="px-4 py-2">Tanggal</th>
								<th className="px-4 py-2">Total</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr>
									<td className="px-4 py-4" colSpan="4">
										Loading...
									</td>
								</tr>
							) : invoices.length === 0 ? (
								<tr>
									<td className="px-4 py-4" colSpan="4">
										Belum ada data.
									</td>
								</tr>
							) : (
								invoices.map((inv) => (
									<tr key={inv.id} className="border-t">
										<td className="px-4 py-2">{inv.id}</td>
										<td className="px-4 py-2">{inv.merchant || '-'}</td>
										<td className="px-4 py-2">{inv.invoiceDate ? new Date(inv.invoiceDate).toISOString().slice(0, 10) : '-'}</td>
										<td className="px-4 py-2">{inv.total != null ? `Rp ${Number(inv.total).toLocaleString('id-ID')}` : '-'}</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

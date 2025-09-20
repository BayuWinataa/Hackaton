import Link from 'next/link';

export default function Footer() {
	return (
		<footer className="border-t bg-gradient-to-b from-white to-slate-50 py-12 mt-20">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-10 md:grid-cols-4 text-center md:text-left">
					{/* Brand */}
					<div>
						<h3 className="text-lg font-bold text-slate-900">ShopMate AI</h3>
						<p className="mt-2 text-sm text-slate-600 max-w-xs mx-auto md:mx-0">Belanja lebih cerdas bersama AI. Rekomendasi instan, perbandingan produk, dan insight dari invoice dalam satu tempat.</p>
					</div>

					{/* Produk */}
					<div>
						<h4 className="text-sm font-semibold text-slate-900">Produk</h4>
						<ul className="mt-3 space-y-2 text-sm text-slate-600">
							<li>
								<Link href="/products" className="hover:text-slate-900 transition-colors">
									Katalog
								</Link>
							</li>
							<li>
								<Link href="/chat" className="hover:text-slate-900 transition-colors">
									Chat AI
								</Link>
							</li>
							<li>
								<Link href="/dashboard/orders" className="hover:text-slate-900 transition-colors">
									Invoice IQ
								</Link>
							</li>
							<li>
								<Link href="/dashboard" className="hover:text-slate-900 transition-colors">
									Dashboard
								</Link>
							</li>
						</ul>
					</div>

					{/* Perusahaan */}
					<div>
						<h4 className="text-sm font-semibold text-slate-900">Perusahaan</h4>
						<ul className="mt-3 space-y-2 text-sm text-slate-600">
							<li>
								<Link href="#" className="hover:text-slate-900 transition-colors">
									Tentang Kami
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-slate-900 transition-colors">
									Kontak
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-slate-900 transition-colors">
									Karir
								</Link>
							</li>
						</ul>
					</div>

					{/* Legal */}
					<div>
						<h4 className="text-sm font-semibold text-slate-900">Legal</h4>
						<ul className="mt-3 space-y-2 text-sm text-slate-600">
							<li>
								<Link href="#" className="hover:text-slate-900 transition-colors">
									Kebijakan Privasi
								</Link>
							</li>
							<li>
								<Link href="#" className="hover:text-slate-900 transition-colors">
									Syarat & Ketentuan
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default function DashboardLayout({ children }) {
	return (
		<div className="min-h-screen bg-slate-50">
			<header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
				<div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
					<h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
					<nav className="text-sm flex gap-4">
						<a className="text-slate-600 hover:text-slate-900" href="/dashboard">
							Home
						</a>
						<a className="text-slate-600 hover:text-slate-900" href="/">
							App
						</a>
					</nav>
				</div>
			</header>
			<main className="max-w-7xl mx-auto p-4">{children}</main>
		</div>
	);
}

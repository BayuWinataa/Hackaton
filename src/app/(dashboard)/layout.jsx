// app/(site)/dashboard/layout.jsx
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import SidebarNav from '@/components/dashboard/SidebarNav';

export const metadata = { title: 'Dashboard' };

export default function DashboardLayout({ children }) {
	return (
		<div className="min-h-[calc(100vh-4rem)] bg-slate-50">
			{/* Topbar */}
			<header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
				<div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
					<div className="flex items-center gap-3">
						{/* Sidebar trigger (mobile) */}
						<div className="md:hidden">
							<Sheet>
								<SheetTrigger asChild>
									<Button variant="ghost" size="icon" aria-label="Buka menu">
										<Menu className="h-5 w-5" />
									</Button>
								</SheetTrigger>
								<SheetContent side="left" className="w-[85vw] sm:w-[380px] p-0">
									<SheetHeader className="px-5 pt-5">
										<SheetTitle>Menu Dashboard</SheetTitle>
									</SheetHeader>
									<div className="mt-3">
										<SidebarNav mobile />
									</div>
								</SheetContent>
							</Sheet>
						</div>

						<Link href="/" className="text-sm font-semibold text-slate-700 hover:underline">
							← Kembali ke Home
						</Link>
					</div>
				</div>
			</header>

			{/* Body: Sidebar + Content */}
			<div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[260px_1fr] lg:gap-6 lg:px-8">
				{/* Sidebar (desktop) */}
				<aside className="hidden lg:block">
					<div className="sticky top-[4.5rem] rounded-2xl border bg-white p-4 ring-1 ring-slate-200">
						<SidebarNav />
						<Separator className="my-4" />
						<form action="/api/auth/logout" method="POST" className="px-1">
							<Button type="submit" variant="destructive" className="w-full">
								Logout
							</Button>
						</form>
					</div>
				</aside>

				{/* Content */}
				<main className="min-h-[60vh] rounded-2xl border bg-white p-5 ring-1 ring-slate-200">{children}</main>
			</div>
		</div>
	);
}

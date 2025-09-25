// app/(site)/dashboard/layout.jsx
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Home, User, LogOut, Circle } from 'lucide-react';
import SidebarNav from '@/components/dashboard/SidebarNav';

export const metadata = { title: 'Dashboard' };

export default function DashboardLayout({ children }) {
	return (
		<div className="h-[calc(100vh-4rem)] flex bg-white">
			{/* Sidebar Desktop */}
			<aside className="hidden lg:flex w-64 flex-col border-r border-slate-100">
				{/* Sidebar Header */}
				<div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
					<Link href="/" className="group flex items-center gap-2 text-sm font-medium text-slate-900 hover:text-slate-600 transition-colors">
						<Home className="h-4 w-4 group-hover:scale-95 transition-transform" />
						Home
					</Link>
				</div>

				{/* Navigation */}
				<div className="flex-1 px-3 py-4">
					<SidebarNav />
				</div>

				{/* Sidebar Footer */}
				<div className="border-t border-slate-100 p-4">
					<form action="/api/auth/logout" method="POST">
						<Button type="submit" variant="ghost" size="sm" className="w-full justify-start text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors">
							<LogOut className="h-4 w-4 mr-2" />
							Sign Out
						</Button>
					</form>
				</div>
			</aside>

			{/* Main Content Area */}
			<div className="flex-1 flex flex-col min-w-0">
				{/* Top Navigation */}
				<header className="border-b border-slate-100 flex items-center justify-between px-6">
					{/* Mobile Menu */}
					<div className="lg:hidden">
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="ghost" size="icon" className="hover:bg-slate-50">
									<Menu className="h-5 w-5" />
								</Button>
							</SheetTrigger>
							<SheetContent side="left" className="w-64 p-0">
								{/* Mobile Sidebar Header */}
								<div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
									<Link href="/" className="flex items-center gap-2 text-sm font-medium text-slate-900">
										<Home className="h-4 w-4" />
										Home
									</Link>
								</div>

								{/* Mobile Navigation */}
								<div className="flex-1 px-3 py-4">
									<SidebarNav mobile />
								</div>

								{/* Mobile Footer */}
								<div className="border-t border-slate-100 p-4">
									<div className="flex items-center gap-3 mb-4 px-2">
										<div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center">
											<User className="h-4 w-4 text-white" />
										</div>
										<div className="flex-1">
											<p className="text-sm font-medium text-slate-900">Admin</p>
											<p className="text-xs text-slate-500">Online</p>
										</div>
									</div>
									<form action="/api/auth/logout" method="POST">
										<Button type="submit" variant="ghost" size="sm" className="w-full justify-start text-slate-600 hover:text-red-600 hover:bg-red-50">
											<LogOut className="h-4 w-4 mr-2" />
											Sign Out
										</Button>
									</form>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</header>

				{/* Page Content */}
				<main className="flex-1 overflow-auto">
					<div className="h-full p-6">
						<div className="h-full max-w-none">{children}</div>
					</div>
				</main>
			</div>
		</div>
	);
}

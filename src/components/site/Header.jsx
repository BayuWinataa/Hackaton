'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import CartButton from '@/components/cart/CartButton';

// util kecil untuk styling active link
function NavLink({ href, children }) {
	const pathname = usePathname();
	const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
	return (
		<Link href={href} aria-current={isActive ? 'page' : undefined} className={['relative rounded-md px-3 py-2 text-sm transition-colors', isActive ? 'text-foreground font-semibold' : 'text-foreground/70 hover:text-foreground'].join(' ')}>
			<span className={['pointer-events-none absolute inset-x-2 -bottom-[2px] h-[2px] rounded-full transition-opacity', isActive ? 'opacity-100 bg-foreground/70' : 'opacity-0'].join(' ')} />
			{children}
		</Link>
	);
}

export default function Header() {
	return (
		<header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
			<div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between gap-3">
					{/* Brand */}
					<div className="flex min-w-0 items-center gap-2">
						<Link href="/" className="group inline-flex items-center gap-2">
							<span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600/10 text-blue-700 ring-1 ring-blue-600/20 transition group-hover:bg-blue-600/15">
								<Sparkles className="h-5 w-5" />
							</span>
							<span className="truncate text-xl font-extrabold tracking-tight">ShopMate</span>
							<span className="hidden rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-600/10 md:inline-block">AI</span>
						</Link>
					</div>

					{/* Desktop nav */}
					<nav className="hidden items-center gap-1 md:flex">
						<NavLink href="/">Home</NavLink>
						<NavLink href="/products">Produk</NavLink>
						<NavLink href="/chat">Chat AI</NavLink>
					</nav>

					{/* Actions (cart + profile + mobile menu) */}
					<div className="flex items-center gap-3">
						<div className="scale-110">
							<CartButton />
						</div>

						{/* Profile Icon lebih besar */}

						<Link href="/dashboard" className="border px-2 py-1 rounded-lg hover:bg-accent transition">
							<User size={32} />
						</Link>

						{/* Mobile menu */}
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="ghost" size="icon" className="md:hidden" aria-label="Buka menu">
									<Menu className="h-6 w-6" />
								</Button>
							</SheetTrigger>
							<SheetContent side="right" className="w-[320px] sm:w-[380px]">
								<SheetHeader>
									<SheetTitle>Menu</SheetTitle>
								</SheetHeader>

								<div className="mt-4 grid gap-1">
									<NavItem href="/">Beranda</NavItem>
									<NavItem href="/products">Produk</NavItem>
									<NavItem href="/chat">Chat AI</NavItem>
									<NavItem href="/dashboard">Dashboard</NavItem>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>
		</header>
	);
}

// item link untuk menu mobile (mengikuti highlight sederhana)
function NavItem({ href, children }) {
	const pathname = usePathname();
	const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
	return (
		<Link href={href} className={['rounded-lg px-3 py-2 text-sm transition-colors', isActive ? 'bg-accent text-foreground' : 'text-foreground/80 hover:bg-accent'].join(' ')} aria-current={isActive ? 'page' : undefined}>
			{children}
		</Link>
	);
}

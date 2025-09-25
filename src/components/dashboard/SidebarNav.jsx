// components/dashboard/SidebarNav.jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Receipt, MessageSquare, Settings, User } from 'lucide-react';

const LINKS = [
	{ href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
	{ href: '/dashboard/orders', label: 'Orders', icon: ShoppingBag },
	// { href: '/dashboard/invoices', label: 'Invoices', icon: Receipt },
	// { href: '/dashboard/chat-history', label: 'Chat History', icon: MessageSquare },
	// { href: '/dashboard/profile', label: 'Profile', icon: User },
	// { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function SidebarNav({ mobile = false }) {
	const pathname = usePathname();

	return (
		<nav className={mobile ? 'px-4 py-3' : ''}>
			<ul className="space-y-1">
				{LINKS.map(({ href, label, icon: Icon }) => {
					const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
					return (
						<li key={href}>
							<Link
								href={href}
								className={['flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors', active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'].join(' ')}
								aria-current={active ? 'page' : undefined}
							>
								<Icon className="h-4 w-4" />
								<span className="truncate">{label}</span>
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}

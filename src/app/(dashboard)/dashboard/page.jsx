import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { Separator } from '@/components/ui/separator';
import DashboardClient from '@/components/dashboard/DashboardClient';

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
	const user = await getSessionUser();
	if (!user) {
		redirect('/login?next=/dashboard');
	}

	return (
		<div className="space-y-3">
			<h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				Selamat datang, <span className="font-semibold">{user.name || user.email}</span>.
			</p>
			<Separator />

			<DashboardClient />
		</div>
	);
}

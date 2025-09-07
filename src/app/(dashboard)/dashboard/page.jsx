// app/(site)/dashboard/page.jsx
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login?next=/dashboard');
  }

  return (
    <div className="space-y-6">
      {/* Header dalam content */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Selamat datang, <span className="font-semibold">{user.name || user.email}</span>.
        </p>
      </div>

      <Separator />

      {/* Example stats / quick glance */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-slate-500">Total Orders</div>
            <div className="mt-1 text-2xl font-bold">12</div>
            <div className="text-xs text-slate-500">+3 this month</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-slate-500">Spent</div>
            <div className="mt-1 text-2xl font-bold">Rp 4.250.000</div>
            <div className="text-xs text-slate-500">+Rp 750k this month</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-slate-500">Invoices</div>
            <div className="mt-1 text-2xl font-bold">5</div>
            <div className="text-xs text-slate-500">2 unpaid</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-slate-500">Last Chat</div>
            <div className="mt-1 text-2xl font-bold">2h ago</div>
            <div className="text-xs text-slate-500">See history</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <div className="mb-3 text-sm font-semibold">Recent Orders</div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between rounded-lg border px-3 py-2">
                <span className="truncate">#INV-2301 • Headphone Pro</span>
                <span className="text-slate-600">Rp 1.500.000</span>
              </li>
              <li className="flex items-center justify-between rounded-lg border px-3 py-2">
                <span className="truncate">#INV-2299 • Smartwatch 2</span>
                <span className="text-slate-600">Rp 950.000</span>
              </li>
              <li className="flex items-center justify-between rounded-lg border px-3 py-2">
                <span className="truncate">#INV-2295 • Keyboard MX</span>
                <span className="text-slate-600">Rp 799.000</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="mb-3 text-sm font-semibold">Recent Chats</div>
            <ul className="space-y-2 text-sm">
              <li className="rounded-lg border px-3 py-2">
                “Bandingkan Headphone Pro vs AirBass 3…” — <span className="text-slate-500">2h ago</span>
              </li>
              <li className="rounded-lg border px-3 py-2">
                “Ada smartwatch  1jt nggak?” — <span className="text-slate-500">1d ago</span>
              </li>
              <li className="rounded-lg border px-3 py-2">
                “Minta rekomendasi monitor 27 inch 2K” — <span className="text-slate-500">3d ago</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

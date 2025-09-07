export const metadata = {
	title: 'Auth • ShopMate AI',
};

export default function AuthLayout({ children }) {
	return (
		<div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
			<div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200">{children}</div>
		</div>
	);
}

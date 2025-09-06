export default function AuthLayout({ children }) {
	return (
		<div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6">{children}</div>
		</div>
	);
}

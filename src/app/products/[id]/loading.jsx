export default function Loading() {
	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
				<div className="aspect-[4/3] w-full rounded-xl bg-muted" />
				<div className="space-y-4">
					<div className="h-5 w-28 rounded bg-muted" />
					<div className="h-8 w-3/4 rounded bg-muted" />
					<div className="h-7 w-48 rounded bg-muted" />
					<div className="h-32 w-full rounded bg-muted" />
					<div className="h-10 w-52 rounded bg-muted" />
				</div>
			</div>
		</div>
	);
}

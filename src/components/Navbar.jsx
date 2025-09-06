import React from 'react';

function Navbar() {
	return (
		<header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					{/* Left: Brand */}
					<div className="flex items-center gap-2">
						<Sparkles className="h-6 w-6 text-blue-600" />
						<Link href="/" className="text-xl font-extrabold tracking-tight">
							ShopMate
						</Link>
						<Badge variant="secondary" className="hidden md:inline-flex">
							AI
						</Badge>
					</div>

					{/* Center: Controls (desktop) */}
					<div className="hidden md:flex items-center gap-3 max-w-xl w-full">
						<Input placeholder="Cari produk, kategori..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-full" />
						<Select value={category} onValueChange={setCategory}>
							<SelectTrigger className="min-w-[140px]">
								<SelectValue placeholder="Kategori" />
							</SelectTrigger>
							<SelectContent>
								{categories.map((c) => (
									<SelectItem key={c} value={c}>
										{c[0].toUpperCase() + c.slice(1)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger className="min-w-[150px]">
								<SelectValue placeholder="Urutkan" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="terkini">Terbaru</SelectItem>
								<SelectItem value="termurah">Harga: Termurah</SelectItem>
								<SelectItem value="termahal">Harga: Termahal</SelectItem>
								<SelectItem value="az">Nama: A–Z</SelectItem>
								<SelectItem value="za">Nama: Z–A</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Right: Actions */}
					<div className="flex items-center gap-2">
						<Button asChild className="hidden sm:inline-flex">
							<Link href="/chat" className="inline-flex items-center gap-2">
								<MessageSquare className="h-4 w-4" /> Mulai Chat AI
							</Link>
						</Button>

						<Button variant="outline" className="relative" aria-label="Buka keranjang">
							<ShoppingCart className="h-5 w-5" />
							<span className="absolute -top-2 -right-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">{cartCount}</span>
						</Button>

						{/* Mobile menu */}
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="ghost" size="icon" className="md:hidden" aria-label="Buka menu">
									<Menu className="h-5 w-5" />
								</Button>
							</SheetTrigger>
							<SheetContent side="right" className="w-[320px] sm:w-[380px]">
								<SheetHeader>
									<SheetTitle>Filter & Pencarian</SheetTitle>
								</SheetHeader>
								<div className="mt-4 space-y-3">
									<Input placeholder="Cari produk..." value={query} onChange={(e) => setQuery(e.target.value)} />
									<div className="grid grid-cols-2 gap-3">
										<Select value={category} onValueChange={setCategory}>
											<SelectTrigger>
												<SelectValue placeholder="Kategori" />
											</SelectTrigger>
											<SelectContent>
												{categories.map((c) => (
													<SelectItem key={c} value={c}>
														{c[0].toUpperCase() + c.slice(1)}
													</SelectItem>
												))}
											</SelectContent>
										</Select>

										<Select value={sortBy} onValueChange={setSortBy}>
											<SelectTrigger>
												<SelectValue placeholder="Urutkan" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="terkini">Terbaru</SelectItem>
												<SelectItem value="termurah">Termurah</SelectItem>
												<SelectItem value="termahal">Termahal</SelectItem>
												<SelectItem value="az">A–Z</SelectItem>
												<SelectItem value="za">Z–A</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<Filter className="h-4 w-4" />
										<span>{filtered.length} produk</span>
									</div>
									<Button asChild className="w-full">
										<Link href="/chat" className="inline-flex items-center gap-2">
											<MessageSquare className="h-4 w-4" /> Tanya rekomendasi AI
										</Link>
									</Button>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>
		</header>
	);
}

export default Navbar;

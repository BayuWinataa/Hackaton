// src/components/cart/CartProvider.jsx
'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'shopmate.cart';

export default function CartProvider({ children }) {
	const [items, setItems] = useState([]); // [{id, nama, harga, image, qty}]
	const [open, setOpen] = useState(false);

	// Restore dari localStorage (client-only)
	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) setItems(JSON.parse(raw));
		} catch {
			// ignore
		}
	}, []);

	// Persist ke localStorage saat items berubah
	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
		} catch {
			// ignore
		}
	}, [items]);

	const addItem = (product, qty = 1) => {
		setItems((prev) => {
			const idx = prev.findIndex((it) => String(it.id) === String(product.id));
			if (idx >= 0) {
				const next = [...prev];
				next[idx] = { ...next[idx], qty: next[idx].qty + qty };
				return next;
			}
			return [
				...prev,
				{
					id: product.id,
					nama: product.nama,
					harga: product.harga,
					image: product.image,
					qty,
				},
			];
		});
	};

	const removeItem = (id) => setItems((prev) => prev.filter((it) => String(it.id) !== String(id)));

	const updateQty = (id, qty) => setItems((prev) => prev.map((it) => (String(it.id) === String(id) ? { ...it, qty: Math.max(1, qty) } : it)));

	const clear = () => setItems([]);

	const totals = useMemo(() => {
		const totalQty = items.reduce((s, it) => s + it.qty, 0);
		const totalPrice = items.reduce((s, it) => s + (it.qty || 0) * (it.harga || 0), 0);
		return { totalQty, totalPrice };
	}, [items]);

	const value = useMemo(
		() => ({
			items,
			addItem,
			removeItem,
			updateQty,
			clear,
			open,
			setOpen,
			...totals,
		}),
		[items, totals, open]
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
	const ctx = useContext(CartContext);
	if (!ctx) throw new Error('useCart must be used within CartProvider');
	return ctx;
};

"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-brand-900 text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <span className="text-2xl">🛞</span>
          NeumáticosYa
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-brand-100">
            Catálogo
          </Link>
          <Link href="/carrito" className="relative flex items-center gap-1 hover:text-brand-100">
            🛒 Carrito
            {totalItems > 0 && (
              <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

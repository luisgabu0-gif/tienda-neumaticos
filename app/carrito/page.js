"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "../../context/CartContext";

const formatCLP = (value) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value);

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Tu carrito está vacío</h1>
        <p className="mt-2 text-slate-500">Explora el catálogo y agrega neumáticos.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
        >
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Carrito de compras</h1>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row"
          >
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={item.image}
                alt={`${item.brand} ${item.model}`}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs font-semibold uppercase text-brand-600">{item.brand}</p>
              <p className="font-bold text-slate-900">{item.model}</p>
              <p className="text-sm text-slate-500">
                {item.width}/{item.profile} R{item.rim}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor={`qty-${item.id}`} className="text-sm text-slate-500">
                Cantidad
              </label>
              <input
                id={`qty-${item.id}`}
                type="number"
                min={1}
                max={item.stock}
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, Number(e.target.value) || 1)}
                className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-center"
              />
            </div>

            <p className="w-28 text-center font-bold text-slate-900">
              {formatCLP(item.price * item.quantity)}
            </p>

            <button
              onClick={() => removeItem(item.id)}
              className="text-sm font-medium text-red-600 hover:underline"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-4 border-t border-slate-200 pt-6">
        <p className="text-xl font-extrabold text-slate-900">
          Total: {formatCLP(totalPrice)}
        </p>
        <Link
          href="/checkout"
          className="rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
        >
          Continuar al pago
        </Link>
      </div>
    </div>
  );
}

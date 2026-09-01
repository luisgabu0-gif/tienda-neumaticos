"use client";

import TireImage from "./TireImage";
import { useCart } from "../context/CartContext";

const formatCLP = (value) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value);

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const outOfStock = product.stock === 0;

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">
      <div className="flex h-48 w-full items-center justify-center bg-slate-50 p-6">
        <TireImage color={product.color} className="h-full w-full drop-shadow-sm" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          {product.brand}
        </span>
        <h3 className="text-lg font-bold text-slate-900">{product.model}</h3>
        <p className="text-sm text-slate-500">
          Medida: {product.width}/{product.profile} R{product.rim}
        </p>
        <p className="text-sm text-slate-500">Categoría: {product.category}</p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-xl font-extrabold text-slate-900">
            {formatCLP(product.price)}
          </span>
          <span
            className={`text-xs font-semibold ${
              outOfStock ? "text-red-600" : "text-emerald-600"
            }`}
          >
            {outOfStock ? "Sin stock" : `Stock: ${product.stock}`}
          </span>
        </div>

        <button
          onClick={() => addItem(product, 1)}
          disabled={outOfStock}
          className="mt-3 w-full rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {outOfStock ? "No disponible" : "Agregar al carrito"}
        </button>
      </div>
    </div>
  );
}

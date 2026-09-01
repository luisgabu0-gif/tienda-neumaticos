"use client";

import Link from "next/link";
import { useOrders } from "../../context/OrdersContext";
import { useProducts } from "../../context/ProductsContext";

const formatCLP = (value) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value);

export default function OrdersPage() {
  const { orders, clearOrders } = useOrders();
  const { resetStock } = useProducts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Mis pedidos</h1>
        {orders.length > 0 && (
          <button
            onClick={clearOrders}
            className="text-sm font-medium text-red-600 hover:underline"
          >
            Borrar historial
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
          Aún no tienes pedidos. Cuando completes una compra simulada, aparecerá
          aquí como un ticket.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <p className="font-mono text-sm font-bold text-slate-900">{order.id}</p>
                <p className="text-xs text-slate-500">
                  {new Date(order.date).toLocaleString("es-CL")}
                </p>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Enviado a {order.customer.fullName} · {order.customer.city}
              </p>
              <ul className="mt-3 divide-y divide-slate-100 text-sm">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between py-1.5">
                    <span className="text-slate-700">
                      {item.brand} {item.model} · x{item.quantity}
                    </span>
                    <span className="font-medium text-slate-900">
                      {formatCLP(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex justify-between border-t border-slate-100 pt-2 font-bold text-slate-900">
                <span>Total</span>
                <span>{formatCLP(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 rounded-xl border border-dashed border-slate-300 p-4 text-center">
        <p className="text-sm text-slate-500">
          ¿Quieres dejar el stock del catálogo como al inicio? (solo para
          pruebas)
        </p>
        <button
          onClick={resetStock}
          className="mt-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Restablecer stock de demostración
        </button>
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="text-sm font-medium text-brand-600 hover:underline">
          ← Volver al catálogo
        </Link>
      </div>
    </div>
  );
}

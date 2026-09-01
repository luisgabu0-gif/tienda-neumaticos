"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductsContext";
import { useOrders } from "../../context/OrdersContext";

const formatCLP = (value) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(value);

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  cardName: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvv: "",
};

function validate(form) {
  const errors = {};
  if (!form.fullName.trim()) errors.fullName = "Ingresa tu nombre completo";
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Correo inválido";
  if (!/^\+?\d{7,15}$/.test(form.phone.replace(/\s/g, "")))
    errors.phone = "Teléfono inválido";
  if (!form.address.trim()) errors.address = "Ingresa una dirección";
  if (!form.city.trim()) errors.city = "Ingresa una ciudad";
  if (!/^\d{4,10}$/.test(form.postalCode)) errors.postalCode = "Código postal inválido";
  if (!form.cardName.trim()) errors.cardName = "Nombre en la tarjeta requerido";
  if (!/^\d{16}$/.test(form.cardNumber.replace(/\s/g, "")))
    errors.cardNumber = "Debe tener 16 dígitos";
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.cardExpiry))
    errors.cardExpiry = "Formato MM/AA";
  if (!/^\d{3,4}$/.test(form.cardCvv)) errors.cardCvv = "CVV inválido";
  return errors;
}

function generateOrderId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `NT-${timestamp}-${random}`;
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { hasEnoughStock, decrementStock } = useProducts();
  const { addOrder } = useOrders();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [stockError, setStockError] = useState("");
  const [ticket, setTicket] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const foundErrors = validate(form);
    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors);
      setStockError("");
      return;
    }
    if (!hasEnoughStock(items)) {
      setStockError(
        "Uno o más productos ya no tienen stock suficiente. Vuelve al carrito para ajustar las cantidades."
      );
      setErrors({});
      return;
    }

    const order = {
      id: generateOrderId(),
      date: new Date().toISOString(),
      items: items.map((item) => ({
        id: item.id,
        brand: item.brand,
        model: item.model,
        width: item.width,
        profile: item.profile,
        rim: item.rim,
        price: item.price,
        quantity: item.quantity,
      })),
      total: totalPrice,
      customer: {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
        cardLast4: form.cardNumber.replace(/\s/g, "").slice(-4),
      },
    };

    decrementStock(items);
    addOrder(order);
    clearCart();
    setTicket(order);
  }

  if (ticket) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <div className="text-center">
          <div className="text-5xl">✅</div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            ¡Pedido simulado con éxito!
          </h1>
          <p className="mt-2 text-slate-500">
            Este es un checkout ficticio para fines académicos. No se procesó
            ningún pago real.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 p-6 print:border-0">
          <div className="flex items-center justify-between border-b border-dashed border-slate-300 pb-4">
            <div>
              <p className="text-xs uppercase text-slate-500">Ticket de compra</p>
              <p className="font-mono text-sm font-bold text-slate-900">{ticket.id}</p>
            </div>
            <p className="text-sm text-slate-500">
              {new Date(ticket.date).toLocaleString("es-CL")}
            </p>
          </div>

          <div className="mt-4 space-y-1 border-b border-dashed border-slate-300 pb-4 text-sm text-slate-600">
            <p>
              <span className="font-semibold text-slate-900">Cliente:</span>{" "}
              {ticket.customer.fullName}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Envío:</span>{" "}
              {ticket.customer.address}, {ticket.customer.city} ({ticket.customer.postalCode})
            </p>
            <p>
              <span className="font-semibold text-slate-900">Contacto:</span>{" "}
              {ticket.customer.email} · {ticket.customer.phone}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Pago:</span> Tarjeta terminada
              en {ticket.customer.cardLast4}
            </p>
          </div>

          <ul className="mt-4 divide-y divide-slate-100">
            {ticket.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <p className="font-medium text-slate-900">
                    {item.brand} {item.model}
                  </p>
                  <p className="text-slate-500">
                    {item.width}/{item.profile} R{item.rim} · x{item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-slate-900">
                  {formatCLP(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between border-t border-slate-300 pt-4">
            <span className="font-bold text-slate-900">Total pagado</span>
            <span className="text-xl font-extrabold text-slate-900">
              {formatCLP(ticket.total)}
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center print:hidden">
          <button
            onClick={() => window.print()}
            className="rounded-lg border border-slate-300 px-6 py-3 text-center font-semibold text-slate-700 hover:bg-slate-50"
          >
            Imprimir ticket
          </button>
          <Link
            href="/pedidos"
            className="rounded-lg border border-slate-300 px-6 py-3 text-center font-semibold text-slate-700 hover:bg-slate-50"
          >
            Ver mis pedidos
          </Link>
          <Link
            href="/"
            className="rounded-lg bg-brand-600 px-6 py-3 text-center font-semibold text-white hover:bg-brand-700"
          >
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">No hay productos para pagar</h1>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
        >
          Ir al catálogo
        </Link>
      </div>
    );
  }

  const inputClass = (field) =>
    `w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${
      errors[field]
        ? "border-red-500 focus:border-red-500"
        : "border-slate-300 focus:border-brand-500"
    }`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Checkout simulado</h1>
      <p className="mb-6 text-sm text-slate-500">
        Este formulario es ficticio. No introduzcas datos reales de tarjetas ni
        información sensible.
      </p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <fieldset className="col-span-full grid grid-cols-1 gap-4 rounded-xl border border-slate-200 p-4 sm:grid-cols-2">
          <legend className="px-1 font-bold text-slate-900">Datos de envío</legend>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Nombre completo
            </label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className={inputClass("fullName")}
              placeholder="Juan Pérez"
            />
            {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Correo</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className={inputClass("email")}
              placeholder="correo@ejemplo.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Teléfono</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={inputClass("phone")}
              placeholder="+56912345678"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Dirección</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className={inputClass("address")}
              placeholder="Av. Siempre Viva 123"
            />
            {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Ciudad</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              className={inputClass("city")}
              placeholder="Santiago"
            />
            {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Código postal
            </label>
            <input
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              className={inputClass("postalCode")}
              placeholder="8320000"
            />
            {errors.postalCode && (
              <p className="mt-1 text-xs text-red-600">{errors.postalCode}</p>
            )}
          </div>
        </fieldset>

        <fieldset className="col-span-full grid grid-cols-1 gap-4 rounded-xl border border-slate-200 p-4 sm:grid-cols-2">
          <legend className="px-1 font-bold text-slate-900">
            Pago (simulado — no ingreses datos reales)
          </legend>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Nombre en la tarjeta
            </label>
            <input
              name="cardName"
              value={form.cardName}
              onChange={handleChange}
              className={inputClass("cardName")}
              placeholder="JUAN PEREZ"
            />
            {errors.cardName && <p className="mt-1 text-xs text-red-600">{errors.cardName}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Número de tarjeta (ficticio)
            </label>
            <input
              name="cardNumber"
              value={form.cardNumber}
              onChange={handleChange}
              className={inputClass("cardNumber")}
              placeholder="4111 1111 1111 1111"
              maxLength={19}
            />
            {errors.cardNumber && (
              <p className="mt-1 text-xs text-red-600">{errors.cardNumber}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Vencimiento (MM/AA)
            </label>
            <input
              name="cardExpiry"
              value={form.cardExpiry}
              onChange={handleChange}
              className={inputClass("cardExpiry")}
              placeholder="12/28"
              maxLength={5}
            />
            {errors.cardExpiry && (
              <p className="mt-1 text-xs text-red-600">{errors.cardExpiry}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">CVV</label>
            <input
              name="cardCvv"
              value={form.cardCvv}
              onChange={handleChange}
              className={inputClass("cardCvv")}
              placeholder="123"
              maxLength={4}
            />
            {errors.cardCvv && <p className="mt-1 text-xs text-red-600">{errors.cardCvv}</p>}
          </div>
        </fieldset>

        <div className="col-span-full flex items-center justify-between rounded-xl bg-slate-50 p-4">
          <span className="font-bold text-slate-900">Total a pagar</span>
          <span className="text-xl font-extrabold text-slate-900">
            {formatCLP(totalPrice)}
          </span>
        </div>

        {stockError && (
          <div className="col-span-full rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {stockError}{" "}
            <Link href="/carrito" className="font-semibold underline">
              Ir al carrito
            </Link>
          </div>
        )}

        <button
          type="submit"
          className="col-span-full rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
        >
          Confirmar pedido (simulado)
        </button>
      </form>
    </div>
  );
}

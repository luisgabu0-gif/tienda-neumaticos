"use client";

import { brands, widths, profiles, rims } from "../data/products";

export default function ProductFilters({ filters, setFilters }) {
  function update(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    setFilters({ brand: "", width: "", profile: "", rim: "", search: "" });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-bold text-slate-900">Buscador avanzado</h2>
        <button
          onClick={reset}
          className="text-sm font-medium text-brand-600 hover:underline"
        >
          Limpiar filtros
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <input
          type="text"
          placeholder="Buscar marca o modelo..."
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none lg:col-span-1"
        />

        <select
          value={filters.brand}
          onChange={(e) => update("brand", e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        >
          <option value="">Todas las marcas</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select
          value={filters.width}
          onChange={(e) => update("width", e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        >
          <option value="">Ancho (ej. 205)</option>
          {widths.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>

        <select
          value={filters.profile}
          onChange={(e) => update("profile", e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        >
          <option value="">Perfil (ej. 55)</option>
          {profiles.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={filters.rim}
          onChange={(e) => update("rim", e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        >
          <option value="">Rin (ej. R16)</option>
          {rims.map((r) => (
            <option key={r} value={r}>
              R{r}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

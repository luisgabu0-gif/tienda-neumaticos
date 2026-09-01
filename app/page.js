"use client";

import { useMemo, useState } from "react";
import { useProducts } from "../context/ProductsContext";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";

export default function HomePage() {
  const { products } = useProducts();
  const [filters, setFilters] = useState({
    brand: "",
    width: "",
    profile: "",
    rim: "",
    search: "",
  });

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (filters.brand && p.brand !== filters.brand) return false;
      if (filters.width && String(p.width) !== filters.width) return false;
      if (filters.profile && String(p.profile) !== filters.profile) return false;
      if (filters.rim && String(p.rim) !== filters.rim) return false;
      if (filters.search) {
        const term = filters.search.toLowerCase();
        const haystack = `${p.brand} ${p.model}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }, [products, filters]);

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl">
            Encuentra el neumático perfecto
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-brand-100">
            Amplio catálogo con las medidas exactas que necesitas: ancho,
            perfil y rin. Compra simulada, rápida y sin complicaciones.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <ProductFilters filters={filters} setFilters={setFilters} />

        <p className="my-4 text-sm text-slate-500">
          {filtered.length} {filtered.length === 1 ? "producto encontrado" : "productos encontrados"}
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
            No se encontraron neumáticos con esos filtros. Intenta ajustar tu búsqueda.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

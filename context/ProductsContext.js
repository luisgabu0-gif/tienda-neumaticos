"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { products as baseProducts } from "../data/products";

const ProductsContext = createContext(null);
const STORAGE_KEY = "tienda-neumaticos-stock";

function applyOverrides(overrides) {
  return baseProducts.map((p) =>
    overrides[p.id] !== undefined ? { ...p, stock: overrides[p.id] } : p
  );
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(baseProducts);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Lectura única de localStorage al montar (mismo caso justificado que en
    // CartContext: evita un mismatch de hidratación SSR/cliente).
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProducts(applyOverrides(JSON.parse(stored)));
      }
    } catch {
      // localStorage no disponible o datos corruptos: se ignora y se usa el stock base
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      const overrides = {};
      products.forEach((p) => {
        const base = baseProducts.find((b) => b.id === p.id);
        if (base && base.stock !== p.stock) overrides[p.id] = p.stock;
      });
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    } catch {
      // almacenamiento no disponible (modo privado, cuota excedida, etc.)
    }
  }, [products, isLoaded]);

  function hasEnoughStock(cartItems) {
    return cartItems.every((item) => {
      const current = products.find((p) => p.id === item.id);
      return current && current.stock >= item.quantity;
    });
  }

  function decrementStock(cartItems) {
    setProducts((prev) =>
      prev.map((p) => {
        const purchased = cartItems.find((i) => i.id === p.id);
        if (!purchased) return p;
        return { ...p, stock: Math.max(0, p.stock - purchased.quantity) };
      })
    );
  }

  function resetStock() {
    setProducts(baseProducts);
  }

  return (
    <ProductsContext.Provider
      value={{ products, hasEnoughStock, decrementStock, resetStock }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts debe usarse dentro de ProductsProvider");
  return ctx;
}

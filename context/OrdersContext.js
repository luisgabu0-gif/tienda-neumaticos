"use client";

import { createContext, useContext, useEffect, useState } from "react";

const OrdersContext = createContext(null);
const STORAGE_KEY = "tienda-neumaticos-orders";

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOrders(JSON.parse(stored));
      }
    } catch {
      // localStorage no disponible o datos corruptos: se ignora y se parte sin historial
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // almacenamiento no disponible (modo privado, cuota excedida, etc.)
    }
  }, [orders, isLoaded]);

  function addOrder(order) {
    setOrders((prev) => [order, ...prev]);
  }

  function clearOrders() {
    setOrders([]);
  }

  return (
    <OrdersContext.Provider value={{ orders, addOrder, clearOrders }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders debe usarse dentro de OrdersProvider");
  return ctx;
}

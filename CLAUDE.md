# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # install dependencies
npm run dev       # start dev server at http://localhost:3000 (Turbopack)
npm run build     # production build — must complete with zero errors before shipping
npm run start     # serve the production build (run build first)
npm run lint      # runs `eslint .` directly
```

There is no test suite in this project.

**Lint note**: Next.js 16 removed the `next lint` command entirely, so `lint` in `package.json` calls `eslint .` directly. `eslint.config.mjs` imports `eslint-config-next/core-web-vitals` as a native flat config — do not reintroduce `next lint` or a legacy `.eslintrc.json` / `FlatCompat` setup, both are incompatible with this Next/ESLint version pairing.

## Architecture

This is a fictional tire e-commerce demo (Next.js 16, App Router) with **no backend and no database**. All "persistence" — cart, live stock, order history — lives in the browser via three React Context providers wrapping the app in `app/layout.js` (nesting order: `ProductsProvider > OrdersProvider > CartProvider`, all in `context/`). Each context follows the same pattern: read its localStorage key once in a `useEffect` on mount (guarded with `eslint-disable-next-line react-hooks/set-state-in-effect` — a deliberate, documented exception, not an oversight), then write back to storage on every change once the initial load flag (`isLoaded`) is set. This two-step load/write split avoids clobbering storage before the initial read completes and avoids an SSR/hydration mismatch from reading `window.localStorage` during render.

- **`data/products.js`** is the static source-of-truth catalog (id, brand, model, width, profile, rim, price, stock, category, `color`). It never changes at runtime.
- **`context/ProductsContext.js`** layers live stock on top of the static catalog: it holds the working `products` array in state, persists only the *diffs* from the base stock to `localStorage` (`tienda-neumaticos-stock`), and exposes `hasEnoughStock(cartItems)` / `decrementStock(cartItems)` / `resetStock()`. Every screen that displays or sells products (`app/page.js`, checkout) reads from `useProducts()`, never from the static import directly — the static import is only the fallback/reset baseline.
- **`context/CartContext.js`** holds cart line items (`localStorage` key `tienda-neumaticos-cart`). `addItem` clamps quantity to the product's stock *at the time of adding* — cart line items are a snapshot, not live-reactive to later stock changes.
- **`context/OrdersContext.js`** holds the order/ticket history (`localStorage` key `tienda-neumaticos-orders`), append-only via `addOrder`.

**Checkout is the central business-logic path** (`app/checkout/page.js`): validate form → `hasEnoughStock(items)` (re-checked against *live* stock, so it correctly blocks a sale if stock was depleted after the item was added to the cart — e.g. by another tab) → build an order object (with a masked card number, never the full PAN) → `decrementStock(items)` → `addOrder(order)` → `clearCart()` → render a printable ticket. `app/pedidos/page.js` lists that order history and exposes `resetStock()` as a "reset demo stock" button, since this is a stock-less demo store meant to be tested repeatedly.

**Product images are procedural SVG, not raster/remote images** (`components/TireImage.js`): a wheel illustration generated from trigonometry (`Math.cos`/`Math.sin` loops for tread marks and spokes), colored via each product's `color` field. This was a deliberate choice over external image URLs or `next/image` — it guarantees every product always has a reference image with zero external dependency. The coordinates are explicitly rounded (`round()`) before being used as SVG attributes; **do not remove that rounding** — unrounded floats can differ in their last decimal digits between server and client floating-point math and trigger a hydration mismatch.

Routing is plain App Router pages, all client components (`"use client"`): `/` (catalog + client-side filtering via `useMemo` over `useProducts().products`, filters UI in `components/ProductFilters.js`), `/carrito`, `/checkout`, `/pedidos`.

Deployed on Vercel (project `mamoswaineta/tienda-neumaticos`), connected to GitHub (`luisgabu0-gif/tienda-neumaticos`) with auto-deploy on push to `main`. No environment variables are required; `.env.example` is a placeholder template only.

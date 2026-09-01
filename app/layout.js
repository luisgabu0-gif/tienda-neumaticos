import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { ProductsProvider } from "../context/ProductsContext";
import { OrdersProvider } from "../context/OrdersContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = {
  title: "NeumáticosYa | Tienda de Neumáticos",
  description:
    "Catálogo de neumáticos con buscador por medidas, carrito de compras y checkout simulado. Proyecto académico.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col bg-white text-slate-800 antialiased">
        <ProductsProvider>
          <OrdersProvider>
            <CartProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </CartProvider>
          </OrdersProvider>
        </ProductsProvider>
      </body>
    </html>
  );
}

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50 py-8 text-center text-sm text-slate-500">
      <p>
        NeumáticosYa — Proyecto académico de demostración. Todos los productos,
        precios y marcas son ficticios.
      </p>
      <p className="mt-1">© {new Date().getFullYear()} Curso de Inteligencia Artificial</p>
    </footer>
  );
}

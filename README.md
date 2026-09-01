# NeumáticosYa 🛞

Tienda de e-commerce (simulada) de neumáticos, construida con Next.js (App Router) y Tailwind CSS. Proyecto académico para un curso de Inteligencia Artificial.

## Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Estado del carrito persistido en `localStorage` (sin backend)

## Funcionalidades

- Catálogo de neumáticos con datos ficticios (`data/products.js`)
- Buscador avanzado por marca, ancho, perfil y rin
- Carrito de compras (agregar, eliminar, ajustar cantidades, total en tiempo real)
- Checkout simulado con validación de formulario (sin pasarela de pago real)

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Build de producción

```bash
npm run build
npm run start
```

## Variables de entorno

Este proyecto no requiere variables de entorno para funcionar. Si se agregan en el futuro, usar `.env.local` (ignorado por git) basándose en la plantilla `.env.example`.

## Subir a GitHub y desplegar en Vercel

1. Inicializar el repositorio Git (si no existe):

   ```bash
   git init
   git add .
   git commit -m "Proyecto inicial: tienda de neumáticos"
   ```

2. Crear un repositorio vacío en GitHub (desde github.com/new, sin README) y conectarlo:

   ```bash
   git branch -M main
   git remote add origin https://github.com/<tu-usuario>/<tu-repo>.git
   git push -u origin main
   ```

3. Desplegar en Vercel:
   - Entra a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
   - Haz clic en "Add New Project" e importa el repositorio recién creado.
   - Vercel detectará automáticamente que es un proyecto Next.js (framework preset: Next.js).
   - No es necesario configurar variables de entorno para este proyecto.
   - Haz clic en "Deploy" y espera a que finalice el build.

4. Cada nuevo `git push` a `main` generará un despliegue automático en Vercel.

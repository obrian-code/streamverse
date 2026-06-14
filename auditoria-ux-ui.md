# Auditoría UX/UI — StreamVerse

## Resumen

| Prioridad | Issue | Componente | Estado |
|-----------|-------|-----------|--------|
| ✅ Corregido | Login/Register no renderizan | AuthModule | Rutas cambiadas a `/auth/login`, `/auth/register` con redirects |
| ✅ Corregido | Infinite logout loop | AuthInterceptor | Flag `isLoggedOut` + exclusión de `auth/logout` en interceptor |
| ✅ Corregido | API URL hardcodeada | environment | Detección dinámica: `localhost:3000` en dev, `/api/v1` en prod |
| ✅ Corregido | Accesibilidad 92 (zoom, skip link) | Global | `user-scalable=yes`, skip-to-content link, jerarquía headings corregida |
| ✅ Corregido | Sin active state en nav | Sidebar/Header | `routerLinkActive` con `{ exact: true }` en todas las rutas |
| ✅ Corregido | Links sociales rotos (`/#`) | Footer | URLs reales + `aria-label` + `target="_blank"` |
| ✅ Corregido | Loading state genérico | App shell | Skeleton screens con shimmer en home y pre-bootstrap |
| ✅ Hecho | MIME types JS | nginx | Eliminado `mime.types` custom, usa el defecto de nginx:alpine |

---

## 1. Login/Register: Formularios no renderizan en `<main>` ✅ Corregido

**Problema Detectado**
El `router-outlet` está vacío en `/login` y `/register`. El `<main>` contiene solo `<router-outlet><!---->`. El componente auth no se inyecta en la vista.

**Solución Aplicada**
- Rutas cambiadas de `path: 'login'` a `path: 'auth/login'` con redirects desde `/login` → `/auth/login`.
- `app-routing.module.ts` ahora carga `AuthModule` bajo la ruta padre `auth` con rutas hijas `login` y `register`.
- Links en header, footer y auth guard actualizados a las nuevas rutas.

---

## 2. Infinite Loop de Logout (401 Storm) ✅ Corregido

**Problema Detectado**
El `AuthInterceptor` detecta un 401 y ejecuta `logout()` sin verificar si ya existe un logout en progreso. Esto produce ~100+ requests `POST /auth/logout` en segundos.

**Solución Aplicada**
- Agregado `isLoggedOut` flag en `ErrorInterceptor` para evitar reingreso al `handle401Error`.
- Excluida la ruta `auth/logout` del manejo de 401 en el interceptor.
- En `AuthService.logout()`: guard `isLoggingOut` y solo hace POST si hay `accessToken`.

---

## 3. API Calls Van Directo a Puerto 3000 ✅ Corregido

**Problema Detectado**
`app.config.ts` define `apiUrl: 'http://localhost:3000/api/v1'`. Todas las requests van directo al backend, no pasan por nginx.

**Solución Aplicada**
- `apiUrl` ahora se determina dinámicamente: `http://localhost:3000/api/v1` cuando `hostname === 'localhost'`, de lo contrario `/api/v1` (relativo, via nginx).

---

## 4. Lighthouse: Accesibilidad 92/100 ✅ Corregido

**Problemas detectados:**
- Meta viewport no permite zoom: los usuarios con baja visión no pueden hacer zoom en móvil.
- Skip to content link ausente: usuarios de teclado/lectores de pantalla deben tabular 50+ elementos antes de llegar al contenido principal.
- Contraste de color: posiblemente insuficiente en algunos textos.

**Soluciones Aplicadas**
- `maximum-scale=5, user-scalable=yes` agregado al meta viewport.
- Skip-to-content link como primer elemento del `<body>` con estilos `focus` visibles.
- `id="main-content"` agregado al elemento `<main>` en `app.component.ts`.

---

## 5. SEO Score 80 ✅ Corregido

**Problemas Probables**
- Meta description en inglés.
- Links sociales sin href (FB, TW, IG, YT apuntaban a `/#`).
- Sin `<h1>` visible en login.
- Headings sin jerarquía.

**Soluciones Aplicadas**
- Meta title y description en español.
- Social links con URLs reales, `target="_blank"`, `rel="noopener noreferrer"`, `aria-label`.
- Login/Register usan `<h1>` en vez de `<h2>`.
- Home page mantiene `<h1>` en hero banner y `<h2>` en content rows.

---

## 6. Sidebar y Header Sin Active State ✅ Corregido

**Problema Detectado**
En la navegación, no hay indicación visual de qué ruta está activa.

**Solución Aplicada**
- `routerLinkActive` con clase `bg-surface-800/80 text-white border-l-accent` en sidebar.
- `routerLinkActive` con clase `text-white bg-surface-800/50` en header.
- `[routerLinkActiveOptions]="{ exact: true }"` para la ruta home ('/').

---

## 7. Loading State Genérico ✅ Corregido

**Problema Detectado**
Loading screen mostraba solo texto "StreamVerse" con spinner CSS. Sin skeletons.

**Solución Aplicada**
- Home page: skeleton cards con shimmer mientras cargan datos (trackeo con contador de 5 requests).
- Pre-bootstrap: skeleton de héroe + fila de tarjetas con animación shimmer.
- Auth forms: mantienen `mat-spinner` durante submit (feedback inmediato al usuario).

---

## 8. MIME Types Rotos (Corregido)

**Problema Detectado**
Los archivos `.js` se servían como `application/octet-stream` porque `nginx/mime.types` estaba vacío (0 bytes). El navegador bloqueaba la ejecución de módulos ES6.

**Solución Aplicada**
- Eliminado `COPY nginx/mime.types` del Dockerfile.frontend.
- Ahora usa el `mime.types` por defecto de la imagen nginx:alpine.

# STREAMVERSE - Plataforma OTT de Streaming Tipo Pluto TV

## Rol

Actúa como un Arquitecto de Software Senior, Experto en Angular 20+, NestJS, TypeScript, PostgreSQL, Docker, Nginx, HLS Streaming, Clean Architecture, DDD y plataformas OTT de video bajo demanda y TV en vivo.

---

# Objetivo

Crear una plataforma OTT profesional llamada **StreamVerse**, inspirada visualmente en Pluto TV, Netflix, Disney+, Prime Video y GloboView.

La aplicación debe ser moderna, rápida, escalable, responsive y lista para producción.

---

# Tecnologías

## Frontend

* Angular 20+
* TypeScript
* Angular Signals
* Angular Material
* TailwindCSS
* SCSS
* RxJS
* NgRx
* Video.js
* HLS.js
* Angular Universal (SSR)
* PWA

## Backend

* NestJS
* PostgreSQL
* Redis
* JWT
* Passport
* Socket.io
* Swagger

## Streaming

* FFmpeg
* HLS
* MPEG-DASH
* Nginx RTMP

## DevOps

* Docker
* Docker Compose
* Nginx Reverse Proxy
* GitHub Actions

---

# Nombre del Proyecto

StreamVerse

---

# Estructura de Carpetas

streamverse/

├── frontend/

│ ├── src/

│ │ ├── app/

│ │ │ ├── core/

│ │ │ ├── shared/

│ │ │ ├── layout/

│ │ │ ├── features/

│ │ │ ├── store/

│ │ │ ├── routes/

│ │ │ └── config/

│ │ ├── assets/

│ │ ├── environments/

│ │ └── styles/

│

├── backend/

│ ├── src/

│ │ ├── auth/

│ │ ├── users/

│ │ ├── channels/

│ │ ├── movies/

│ │ ├── series/

│ │ ├── streaming/

│ │ ├── favorites/

│ │ ├── analytics/

│ │ └── uploads/

│

├── docker/

├── nginx/

├── ffmpeg/

├── docs/

└── scripts/

---

# Diseño UI

Crear una interfaz moderna inspirada en Pluto TV.

## Home

* Hero Banner
* Carrusel de destacados
* Categorías
* Últimos agregados
* Recomendaciones

## TV en Vivo

* Reproductor principal
* Lista de canales
* Guía EPG
* Programación actual
* Programación siguiente

## Películas

* Grid responsive
* Filtros avanzados
* Categorías
* Búsqueda

## Series

* Temporadas
* Episodios
* Continuar viendo

## Perfil

* Favoritos
* Historial
* Configuración

---

# Funcionalidades

## Usuarios

* Registro
* Login
* JWT
* Recuperación de contraseña
* Perfil

## Streaming

* Canales en vivo
* HLS Streaming
* DASH Streaming
* Cambio rápido de canal

## Catálogo

* Películas
* Series
* Documentales
* Deportes
* Noticias

## Favoritos

* Agregar favoritos
* Eliminar favoritos

## Historial

* Continuar viendo
* Últimos vistos

## Búsqueda

* Tiempo real
* Filtros inteligentes

## Recomendaciones

* Basadas en historial
* Basadas en categorías

## Administración

* Dashboard
* Gestión de usuarios
* Gestión de canales
* Gestión de contenido
* Gestión de anuncios

---

# Base de Datos

Diseñar modelos para:

## Users

* id
* name
* email
* password
* role
* avatar
* createdAt

## Channels

* id
* name
* logo
* category
* streamUrl
* country
* status

## Movies

* id
* title
* description
* poster
* backdrop
* category
* duration
* releaseDate

## Series

* id
* title
* description
* poster

## Episodes

* id
* seriesId
* season
* episode
* videoUrl

## Favorites

* id
* userId
* contentId

## History

* id
* userId
* contentId
* progress

---

# Reproductor

Crear un reproductor profesional con:

* Video.js
* HLS.js
* Calidad automática
* Fullscreen
* Picture in Picture
* Chromecast
* AirPlay
* Control de volumen
* Subtítulos
* Multi idioma

---

# Rendimiento

Implementar:

* Lazy Loading
* Route Preloading
* SSR
* SEO
* Signals
* Cache Redis
* Optimización de imágenes
* Code Splitting

---

# Seguridad

* JWT
* Refresh Token
* Guards
* Rate Limiting
* Helmet
* CORS
* Sanitización

---

# Docker

Generar:

* Dockerfile Frontend
* Dockerfile Backend
* Docker Compose
* Nginx Reverse Proxy

---

# Entregables

Generar:

1. Arquitectura completa.
2. Código Angular.
3. Código NestJS.
4. Base de datos PostgreSQL.
5. Docker Compose.
6. Configuración Nginx.
7. Configuración FFmpeg.
8. APIs REST.
9. Swagger.
10. Scripts de despliegue.
11. Panel administrativo.
12. Sistema de Streaming.
13. Sistema de autenticación.
14. Sistema de favoritos.
15. Sistema de recomendaciones.

Todo el código debe ser modular, limpio, escalable, documentado y listo para producción empresarial.

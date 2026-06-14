# StreamVerse — Architecture Documentation

> **Version:** 1.0.0  
> **Last Updated:** 2026-06-13  
> **Status:** Approved

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Goals and Constraints](#2-goals-and-constraints)
3. [Technology Stack](#3-technology-stack)
4. [Clean Architecture Layers](#4-clean-architecture-layers)
5. [Domain-Driven Design](#5-domain-driven-design)
6. [C4 Diagrams](#6-c4-diagrams)
7. [Data Flow Diagrams](#7-data-flow-diagrams)
8. [Deployment Architecture](#8-deployment-architecture)
9. [Security Architecture](#9-security-architecture)
10. [Performance Considerations](#10-performance-considerations)
11. [Scalability Strategy](#11-scalability-strategy)
12. [Architecture Decision Records](#12-architecture-decision-records)

---

## 1. System Overview

StreamVerse is a modern Over-The-Top (OTT) streaming platform inspired by Pluto TV, Netflix, and Disney+. It provides live TV channels, video-on-demand (VOD) content, and an interactive user experience across web browsers and mobile devices.

### Key Capabilities

- **Live TV Streaming**: IP-based live channels with adaptive bitrate streaming (HLS/DASH)
- **Video on Demand**: Movies, series, documentaries with catalog management
- **Electronic Program Guide (EPG)**: Real-time schedule for live channels
- **User Management**: Authentication, profiles, favorites, watch history
- **Content Management**: Admin dashboard for managing users, channels, and content
- **Recommendations**: Personalized content discovery based on history and preferences
- **Real-time Features**: Live channel switching via WebSocket, instant notifications

---

## 2. Goals and Constraints

### Architectural Goals

| Goal | Priority | Description |
|------|----------|-------------|
| Scalability | High | Horizontal scaling of stateless services to handle thousands of concurrent streams |
| Availability | High | 99.9% uptime with graceful degradation during failures |
| Performance | High | Sub-second channel switching, <2s page load, smooth 4K streaming |
| Maintainability | High | Clean Architecture with strict separation of concerns |
| Security | Critical | OWASP compliance, secure auth, DRM support, data encryption |
| Cost Efficiency | Medium | Optimized transcoding, CDN usage, and infrastructure costs |

### Constraints

- Must run in Docker containers for consistent deployment
- PostgreSQL as primary database (relational integrity requirements)
- Angular 20+ with SSR for SEO requirements
- HLS/DASH adaptive streaming for broad device compatibility
- Must support both live and VOD content simultaneously

---

## 3. Technology Stack

### Frontend

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| Angular | 20+ | SPA Framework | TypeScript-native, strong typing, enterprise-grade |
| NgRx | 18+ | State Management | Predictable state with unidirectional data flow |
| Angular Signals | 20+ | Reactive State | Fine-grained reactivity without zone.js overhead |
| Angular Material | 18+ | UI Components | Accessible, well-tested component library |
| TailwindCSS | 3+ | Styling | Utility-first, zero-runtime CSS, rapid prototyping |
| Video.js | 8+ | Video Player | Extensible, plugin ecosystem, HLS/DASH support |
| HLS.js | 1.5+ | HLS Playback | MSE-based playback, cross-browser support |
| Angular Universal | 20+ | SSR | SEO, initial load performance, social previews |
| Service Worker | - | PWA | Offline support, caching, installable app |

### Backend

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| NestJS | 10+ | API Framework | Modular architecture, decorators, DI, TypeScript |
| TypeORM | 0.3+ | ORM | Active Record + Data Mapper, migrations, multi-DB |
| PostgreSQL | 16+ | Database | ACID compliance, JSON support, full-text search |
| Redis | 7+ | Cache/Session | In-memory performance, pub/sub for WebSocket |
| Passport | 0.7+ | Authentication | Strategy pattern, JWT, OAuth2 support |
| Socket.io | 4+ | WebSocket | Real-time channel switching, EPG updates |
| Swagger | 7+ | API Docs | OpenAPI 3.0 auto-generation, interactive docs |

### Streaming

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| FFmpeg | 6+ | Transcoding | Industry-standard, supports all codecs |
| HLS | - | Streaming Protocol | Apple ecosystem, broadest device support |
| MPEG-DASH | - | Streaming Protocol | Dynamic adaptive streaming, ABR |
| Nginx RTMP | - | RTMP Server | Ingestion, relay, restreaming |

### DevOps

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| Docker | 24+ | Containerization | Consistent environments, CI/CD integration |
| Docker Compose | 2+ | Orchestration | Multi-service local dev and production |
| Nginx | 1.25+ | Reverse Proxy | High-performance, HTTPS termination, load balancing |
| GitHub Actions | - | CI/CD | Native GitHub integration, matrix builds |

---

## 4. Clean Architecture Layers

StreamVerse follows Robert C. Martin's Clean Architecture with four distinct layers:

```
┌─────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                     │
│  Angular App  │  Controllers  │  Resolvers  │  Guards   │
├─────────────────────────────────────────────────────────┤
│                  APPLICATION LAYER                       │
│  Use Cases  │  DTOs  │  Ports (Interfaces)  │  Mappers  │
├─────────────────────────────────────────────────────────┤
│                    DOMAIN LAYER                          │
│  Entities  │  Value Objects  │  Aggregates  │  Events   │
│  Repository Interfaces  │  Domain Services              │
├─────────────────────────────────────────────────────────┤
│                 INFRASTRUCTURE LAYER                     │
│  TypeORM Repositories  │  Redis Cache  │  S3 Storage   │
│  JWT Services  │  FFmpeg Adapter  │  WebSocket Gateway │
└─────────────────────────────────────────────────────────┘
```

### 4.1 Domain Layer

The innermost layer with zero external dependencies. Contains business logic and rules.

```
src/
├── domain/
│   ├── entities/
│   │   ├── user.entity.ts
│   │   ├── channel.entity.ts
│   │   ├── movie.entity.ts
│   │   ├── series.entity.ts
│   │   ├── episode.entity.ts
│   │   ├── favorite.entity.ts
│   │   └── history.entity.ts
│   ├── value-objects/
│   │   ├── email.vo.ts
│   │   ├── password.vo.ts
│   │   ├── stream-url.vo.ts
│   │   └── content-rating.vo.ts
│   ├── events/
│   │   ├── user-registered.event.ts
│   │   ├── content-watched.event.ts
│   │   └── channel-changed.event.ts
│   └── services/
│       ├── streaming.service.ts
│       └── recommendation.service.ts
```

### 4.2 Application Layer

Orchestrates use cases, defines ports (interfaces), and maps data between domain and external layers.

```
src/
├── application/
│   ├── use-cases/
│   │   ├── auth/
│   │   │   ├── login.use-case.ts
│   │   │   ├── register.use-case.ts
│   │   │   └── refresh-token.use-case.ts
│   │   ├── streaming/
│   │   │   ├── start-stream.use-case.ts
│   │   │   └── switch-channel.use-case.ts
│   │   ├── content/
│   │   │   ├── get-catalog.use-case.ts
│   │   │   └── search-content.use-case.ts
│   │   └── user/
│   │       ├── add-favorite.use-case.ts
│   │       └── get-history.use-case.ts
│   ├── ports/
│   │   ├── user-repository.port.ts
│   │   ├── channel-repository.port.ts
│   │   ├── streaming-repository.port.ts
│   │   └── cache-service.port.ts
│   └── dto/
│       ├── login.dto.ts
│       ├── register.dto.ts
│       └── content-query.dto.ts
```

### 4.3 Infrastructure Layer

Implements ports defined in the Application layer. Contains all framework-specific code.

```
src/
├── infrastructure/
│   ├── persistence/
│   │   ├── typeorm/
│   │   │   ├── entities/
│   │   │   ├── repositories/
│   │   │   └── migrations/
│   │   └── redis/
│   │       └── redis-cache.service.ts
│   ├── auth/
│   │   ├── jwt.service.ts
│   │   ├── jwt.strategy.ts
│   │   └── guards/
│   ├── streaming/
│   │   ├── ffmpeg.service.ts
│   │   ├── hls.service.ts
│   │   └── dash.service.ts
│   ├── websocket/
│   │   ├── streaming.gateway.ts
│   │   └── notifications.gateway.ts
│   └── storage/
│       ├── s3.service.ts
│       └── local-storage.service.ts
```

### 4.4 Presentation Layer

NestJS controllers, guards, interceptors, and the Angular frontend.

```
src/
├── presentation/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── users.controller.ts
│   │   ├── channels.controller.ts
│   │   ├── movies.controller.ts
│   │   ├── series.controller.ts
│   │   ├── streaming.controller.ts
│   │   ├── favorites.controller.ts
│   │   └── uploads.controller.ts
│   ├── interceptors/
│   │   ├── logging.interceptor.ts
│   │   └── transform.interceptor.ts
│   └── filters/
│       └── http-exception.filter.ts
```

---

## 5. Domain-Driven Design

### Bounded Contexts

```
┌─────────────────────────────────────────────────────────────┐
│                    STREAMVERSE CONTEXT MAP                    │
│                                                              │
│  ┌────────────┐    ┌────────────┐    ┌────────────┐        │
│  │   Auth     │◄──►│  Catalog  │◄──►│ Streaming  │        │
│  │  Context   │    │  Context  │    │  Context   │        │
│  └────────────┘    └────────────┘    └────────────┘        │
│       ▲                 ▲                  ▲                │
│       │                 │                  │                │
│  ┌────┴─────┐     ┌────┴─────┐      ┌────┴─────┐          │
│  │  User    │     │  Search  │      │ Analytics │          │
│  │ Context  │     │ Context  │      │  Context  │          │
│  └──────────┘     └──────────┘      └──────────┘          │
└─────────────────────────────────────────────────────────────┘
```

### Context Descriptions

| Bounded Context | Ubiquitous Language | Owner |
|-----------------|-------------------|-------|
| **Auth** | User, Credentials, JWT, Refresh Token, Session | Auth Team |
| **Catalog** | Movie, Series, Episode, Category, Genre, Rating | Content Team |
| **Streaming** | Channel, Stream, Segment, Manifest, Transcoding | Streaming Team |
| **User** | Profile, Favorite, History, Watchlist, Preference | User Team |
| **Search** | Query, Index, Filter, Facet, Suggestion | Search Team |
| **Analytics** | View, Impression, Watch Time, Engagement | Analytics Team |

### Ubiquitous Language (Key Terms)

| Term | Definition |
|------|------------|
| **Channel** | A live TV stream with continuous programming |
| **Stream** | A single media stream (HLS or DASH) |
| **Segment** | A small chunk of video (typically 2-10 seconds) |
| **Manifest** | Playlist file describing available streams/segments |
| **EPG** | Electronic Program Guide showing channel schedules |
| **ABR** | Adaptive Bitrate — automatic quality selection |

---

## 6. C4 Diagrams

### 6.1 System Context (Level 1)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         STREAMVERSE SYSTEM                              │
│                                                                         │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────────┐       │
│  │   Browser    │     │  Mobile App  │     │   Admin Panel    │       │
│  │  (Angular)   │     │  (Web/Mobile)│     │  (Angular Admin) │       │
│  └──────┬───────┘     └──────┬───────┘     └────────┬─────────┘       │
│         │                   │                       │                  │
│         └───────────────────┼───────────────────────┘                  │
│                             │                                           │
│                    ┌────────▼────────┐                                  │
│                    │   API Gateway   │                                  │
│                    │   (Nginx 443)   │                                  │
│                    └────────┬────────┘                                  │
│                             │                                           │
│              ┌──────────────┼──────────────┐                           │
│              │              │              │                           │
│     ┌────────▼───┐  ┌──────▼──────┐  ┌────▼────────┐                 │
│     │  Backend   │  │  Streaming  │  │   FFmpeg    │                 │
│     │  (NestJS)  │  │   Server    │  │ Transcoding │                 │
│     └──┬─────┬───┘  │  (Nginx)    │  └──────┬──────┘                 │
│        │     │      └──────┬──────┘         │                        │
│   ┌────▼─┐ ┌─▼───┐        │                 │                        │
│   │PostgreSQL│Redis│       └─────────────────┘                        │
│   └────────┘ └─────┘                                                  │
│                                                                       │
│                     External Systems:                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐            │
│  │  CDN (S3)   │  │  Email Svc   │  │  OAuth Providers │            │
│  └─────────────┘  └──────────────┘  └──────────────────┘            │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Container Diagram (Level 2)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    STREAMVERSE — CONTAINER DIAGRAM                      │
│                                                                         │
│  ┌──────────────────────────────────────────┐                           │
│  │            FRONTEND CONTAINER            │                           │
│  │  ┌─────────────────┐  ┌──────────────┐  │                           │
│  │  │   Angular SPA   │  │  Angular SSR  │  │                           │
│  │  │  (Video Player) │  │ (SEO/Crawler) │  │                           │
│  │  └─────────────────┘  └──────────────┘  │                           │
│  │  ┌────────────────────────────────────┐  │                           │
│  │  │    Nginx (Static Files + Proxy)    │  │                           │
│  │  └────────────────────────────────────┘  │                           │
│  └──────────────────────────────────────────┘                           │
│                       │ HTTPS                                           │
│                       ▼                                                 │
│  ┌──────────────────────────────────────────┐                           │
│  │         API GATEWAY (Nginx)              │                           │
│  │  ┌────────┐  ┌──────────┐  ┌──────────┐ │                           │
│  │  │SSL Term│  │ Rate Lim │  │  Router  │ │                           │
│  │  └────────┘  └──────────┘  └──────────┘ │                           │
│  └──────────────────────────────────────────┘                           │
│                       │                                                 │
│         ┌─────────────┼─────────────┐                                   │
│         ▼             ▼             ▼                                   │
│  ┌──────────────┐ ┌──────┐ ┌───────────────┐                          │
│  │  API Server  │ │Redis │ │  RTMP Server   │                          │
│  │  (NestJS)    │ │Cache │ │  (Nginx RTMP)  │                          │
│  │  :3000       │ │:6379 │ │  :1935         │                          │
│  └──────┬───────┘ └──────┘ └───────────────┘                          │
│         │                                    │                         │
│         ▼                                    ▼                         │
│  ┌──────────────┐              ┌───────────────────────┐              │
│  │  PostgreSQL  │              │  FFmpeg Transcoding   │              │
│  │  :5432       │              │  HLS/DASH Segmenter   │              │
│  └──────────────┘              └───────────────────────┘              │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.3 Component Diagram (Level 3) — Backend

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    BACKEND — COMPONENT DIAGRAM                          │
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  AuthModule  │  │  UsersModule │  │ ChannelsMod  │  │ MoviesMod │ │
│  │  JWT Guard   │  │  Profile     │  │  EPG Service  │  │  Catalog  │ │
│  │  Passport    │  │  Favorites   │  │  Live Stream  │  │  Search   │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘ │
│         │                 │                  │                │         │
│  ┌──────▼─────────────────▼──────────────────▼────────────────▼──────┐ │
│  │                     CORE SHARED MODULE                             │ │
│  │  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌────────────────┐  │ │
│  │  │Database  │  │  Cache   │  │ Exception │  │  Interceptor   │  │ │
│  │  │ (TypeORM)│  │  (Redis) │  │  Filter   │  │  Transform     │  │ │
│  │  └──────────┘  └──────────┘  └───────────┘  └────────────────┘  │ │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ StreamModule │  │ FavoritesMod │  │    WebSocket Gateway     │  │
│  │  HLS/DASH    │  │  Watchlist   │  │  Streaming  │ Notify    │  │
│  │  Transcoding │  │  History     │  │  Channel    │ EPG       │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Data Flow Diagrams

### 7.1 Video Streaming Flow

```
User                  Frontend              API Gateway           Backend              FFmpeg/CDN
 │                      │                      │                    │                    │
 │  Select Channel      │                      │                    │                    │
 │─────────────────────>│                      │                    │                    │
 │                      │  GET /stream/live    │                    │                    │
 │                      │─────────────────────>│                    │                    │
 │                      │                      │ ──> Auth Check     │                    │
 │                      │                      │───────────────────>│                    │
 │                      │                      │ <── JWT Validated  │                    │
 │                      │                      │                    │                    │
 │                      │                      │    Stream Session  │                    │
 │                      │                      │───────────────────>│                    │
 │                      │                      │                    │── Request Transcode>│
 │                      │                      │                    │<── Segment URL     │
 │                      │                      │                    │                    │
 │                      │  200 {manifest.m3u8} │                    │                    │
 │                      │<──────────────────────│                    │                    │
 │  Parse Manifest      │                      │                    │                    │
 │  GET segment.ts      │                      │                    │                    │
 │──────────────────────────────────────────────────────────────────────────> CDN        │
 │  <── segment data    │                      │                    │                    │
 │  Decode & Render     │                      │                    │                    │
 │                                                                                      │
 │    WebSocket: Channel Switch (Low Latency)                                           │
 │─────────────────────────────────────────────────────────────────────────────────────>│
 │  <── New Stream URL + EPG Update                                                     │
 │<──────────────────────────────────────────────────────────────────────────────────────│
```

### 7.2 Authentication Flow

```
Client                 Frontend              Backend               PostgreSQL           Redis
 │                      │                      │                    │                    │
 │  Login Form          │                      │                    │                    │
 │─────────────────────>│                      │                    │                    │
 │                      │  POST /auth/login    │                    │                    │
 │                      │─────────────────────>│                    │                    │
 │                      │                      │  Find User         │                    │
 │                      │                      │───────────────────>│                    │
 │                      │                      │<── User + Hash     │                    │
 │                      │                      │                    │                    │
 │                      │                      │  Verify Password   │                    │
 │                      │                      │  Generate JWT      │                    │
 │                      │                      │  Store Refresh     │                    │
 │                      │                      │──────────────────────────────────────>│
 │                      │                      │                    │                    │
 │                      │  200 {accessToken,   │                    │                    │
 │                      │        refreshToken} │                    │                    │
 │                      │<─────────────────────│                    │                    │
 │  Store Token         │                      │                    │                    │
 │  Redirect Dashboard  │                      │                    │                    │
 │<────────────────────│                      │                    │                    │
 │                      │                      │                    │                    │
 │  (Later) Request API │                      │                    │                    │
 │─────────────────────>│  GET /api/channels   │                    │                    │
 │                      │  Authorization: Bearer                    │                    │
 │                      │─────────────────────>│                    │                    │
 │                      │                      │  Validate JWT      │                    │
 │                      │                      │  Check Redis       │                    │
 │                      │                      │────────────────────────> Blacklist?    │
 │                      │                      │                    │                    │
 │                      │                      │  Return Data       │                    │
 │                      │<─────────────────────│                    │                    │
```

### 7.3 Search Flow

```
User                  Frontend               Backend               PostgreSQL
 │                      │                      │                    │
 │  Type in Search Box  │                      │                    │
 │─────────────────────>│                      │                    │
 │                      │  Debounce 300ms      │                    │
 │                      │  POST /search?q=str  │                    │
 │                      │─────────────────────>│                    │
 │                      │                      │                    │
 │                      │                      │  ┌─ Search Movies  │
 │                      │                      │  │ TSearch Vector  │
 │                      │                      │──┼───────────────>│
 │                      │                      │  │<── Results      │
 │                      │                      │  ├─ Search Series  │
 │                      │                      │  │───────────────>│
 │                      │                      │  │<── Results      │
 │                      │                      │  └─ Search Channels│
 │                      │                      │    ──────────────>│
 │                      │                      │    <── Results     │
 │                      │                      │                    │
 │                      │                      │  Merge + Rank     │
 │                      │                      │  Cache Results    │
 │                      │  {results: [...]}    │                    │
 │                      │<─────────────────────│                    │
 │                      │                      │                    │
 │  Render Suggestions  │                      │                    │
 │<─────────────────────│                      │                    │
```

---

## 8. Deployment Architecture

### Docker Compose Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DOCKER NETWORK                                  │
│                     streamverse_network                                  │
│                                                                         │
│  ┌─────────────────┐     ┌─────────────────┐     ┌──────────────────┐  │
│  │  nginx-gateway  │     │  frontend-ssr   │     │  backend-api     │  │
│  │  Ports: 80,443  │     │  Port: 4000      │     │  Port: 3000      │  │
│  │  ┌───────────┐  │     │  ┌───────────┐   │     │  ┌────────────┐  │  │
│  │  │ SSL Term  │  │     │  │ Angular   │   │     │  │ NestJS     │  │  │
│  │  │ Rate Lim  │  │     │  │ Universal │   │     │  │ API        │  │  │
│  │  │ Proxy Pass│  │     │  └───────────┘   │     │  └────────────┘  │  │
│  │  └───────────┘  │     └─────────────────┘     └──────────────────┘  │
│  └─────────────────┘                                                   │
│         │                                                              │
│         │                                                              │
│  ┌─────────────────┐     ┌─────────────────┐     ┌──────────────────┐  │
│  │  postgres-db    │     │  redis-cache    │     │  ffmpeg-worker   │  │
│  │  Port: 5432     │     │  Port: 6379     │     │  Port: (none)    │  │
│  │  Volume: pgdata │     │  Vol: redisdata │     │  Vol: /media     │  │
│  └─────────────────┘     └─────────────────┘     └──────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Service Definitions

| Service | Image | Replicas | Dependencies | Health Check |
|---------|-------|----------|--------------|--------------|
| nginx-gateway | nginx:alpine | 1 | backend, frontend | Port 80/443 |
| frontend-ssr | streamverse-frontend | 2+ | backend | /health |
| backend-api | streamverse-backend | 2+ | postgres, redis | /health |
| postgres-db | postgres:16-alpine | 1 | - | pg_isready |
| redis-cache | redis:7-alpine | 1 | - | redis-cli ping |
| ffmpeg-worker | streamverse-ffmpeg | 1-5 | - | process check |

---

## 9. Security Architecture

### Defense in Depth

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   SECURITY ARCHITECTURE                                  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    NETWORK SECURITY                              │   │
│  │  ┌────────┐  ┌────────┐  ┌────────────┐  ┌────────────────┐    │   │
│  │  │HTTPS   │  │ WAF    │  │Rate Limit  │  │  DDoS Protect │    │   │
│  │  │TLS 1.3 │  │ModSec  │  │100 req/min │  │  Cloudflare   │    │   │
│  │  └────────┘  └────────┘  └────────────┘  └────────────────┘    │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                   APPLICATION SECURITY                           │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │   │
│  │  │Helmet    │  │ CORS     │  │Input     │  │  SQL Injection │  │   │
│  │  │Headers   │  │ Whitelist│  │Validation│  │  Prevention    │  │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                   AUTHENTICATION & AUTHORIZATION                 │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │   │
│  │  │JWT       │  │Refresh   │  │RBAC     │  │  OAuth2        │  │   │
│  │  │RS256     │  │Token     │  │Roles    │  │  Google/Apple  │  │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                   DATA SECURITY                                 │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │   │
│  │  │At Rest   │  │In Transit│  │Password  │  │  PII           │  │   │
│  │  │Encryption│  │TLS       │  │Bcrypt    │  │  Anonymization │  │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Security Measures

| Category | Measure | Implementation |
|----------|---------|---------------|
| Transport | HTTPS TLS 1.3 | Nginx SSL termination |
| Transport | HSTS | Strict-Transport-Security header |
| API | Rate Limiting | @nestjs/throttler, 100 req/min per IP |
| API | CORS | Whitelist origins, methods, headers |
| API | Validation | class-validator DTOs, whitelist: true |
| Auth | Password Hashing | bcrypt with 12 salt rounds |
| Auth | JWT | RS256, 15min expiry, refresh rotation |
| Auth | RBAC | Admin, Editor, User roles with guards |
| Data | SQL Injection | TypeORM parameterized queries |
| Data | XSS | Angular sanitization, Helmet headers |
| Data | CSRF | SameSite cookies, CSRF token |
| Streaming | DRM | Token-based stream URL authorization |
| Streaming | Stream Encryption | AES-128 HLS encryption |

---

## 10. Performance Considerations

### Frontend Performance

| Strategy | Implementation | Expected Impact |
|----------|---------------|-----------------|
| SSR | Angular Universal | First paint < 1s |
| Lazy Loading | Route-level module splitting | Initial bundle < 200KB |
| Image Optimization | WebP format, responsive images | 60% size reduction |
| CDN | Static assets on CDN | Global latency < 100ms |
| Code Splitting | Feature modules, dynamic imports | Load only what's needed |
| Preloading | Quicklink, predictive preload | Sub-second navigation |
| Signals | Angular Signals over RxJS | Reduced change detection |
| Service Worker | PWA caching strategy | Offline support, instant reload |

### Backend Performance

| Strategy | Implementation | Expected Impact |
|----------|---------------|-----------------|
| Caching | Redis multi-level cache | 80% reduction in DB queries |
| Connection Pool | TypeORM pool (default 100) | Reuse connections |
| Compression | Compression middleware (Gzip) | 70% payload reduction |
| Query Optimization | Indexes, eager/lazy loading | Sub-50ms queries |
| Rate Limiting | @nestjs/throttler | Prevent abuse |
| Cluster Mode | Node.js cluster | Multi-core utilization |
| Database Indexing | B-tree on search, GIN on JSONB | Fast lookups |

### Streaming Performance

| Strategy | Implementation | Expected Impact |
|----------|---------------|-----------------|
| ABR | HLS + DASH multi-bitrate | Smooth playback |
| Segment Duration | 4-6 second segments | Quick start |
| CDN Edge | CloudFront/Cloudflare | Low latency globally |
| Prefetch | Next segment prefetch | Zero buffering |
| Hardware Encoding | GPU-accelerated FFmpeg | 10x faster transcoding |
| Origin Shield | Single origin with caching | Reduce load |

---

## 11. Scalability Strategy

### Horizontal Scaling

```
                        ┌────────────┐
                        │  Load      │
                        │  Balancer  │
                        └─────┬──────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
        ┌─────▼─────┐  ┌─────▼─────┐  ┌─────▼─────┐
        │  API      │  │  API      │  │  API      │
        │  Instance │  │  Instance │  │  Instance │
        │  1        │  │  2        │  │  N        │
        └─────┬─────┘  └─────┬─────┘  └─────┬─────┘
              │               │               │
              └───────────────┼───────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  PostgreSQL       │
                    │  (Primary/Replica)│
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Redis Cluster    │
                    │  (Sentinel/Cluster)│
                    └───────────────────┘
```

### Scaling Dimensions

| Dimension | Strategy | Implementation |
|-----------|----------|---------------|
| **API Servers** | Horizontal | Auto-scaling group, target CPU > 70% |
| **Database** | Read Replicas | 1 primary + N read replicas |
| **Cache** | Redis Cluster | Sharded across nodes |
| **Streaming** | CDN + Edge | CloudFront with origin shield |
| **Transcoding** | Worker Pool | SQS + FFmpeg workers |
| **Storage** | S3 + CDN | Object storage with CDN cache |

### Auto-scaling Rules

| Service | Metric | Scale Out | Scale In |
|---------|--------|-----------|----------|
| API | CPU > 70% for 5min | +2 instances | -1 instance |
| API | Memory > 80% for 5min | +2 instances | -1 instance |
| API | Requests > 1000/s | +4 instances | -2 instances |
| FFmpeg | Queue depth > 10 | +2 workers | -1 worker |
| Frontend | CPU > 60% for 5min | +1 instance | -1 instance |

---

## 12. Architecture Decision Records

Refer to [decisions.md](./decisions.md) for the complete list of Architecture Decision Records.

Key ADRs:
- **ADR-001**: Angular + NgRx for state management
- **ADR-002**: NestJS with TypeORM for backend
- **ADR-003**: PostgreSQL as primary database
- **ADR-004**: Redis for caching and sessions
- **ADR-005**: HLS + DASH for adaptive streaming
- **ADR-006**: WebSocket for live channel switching
- **ADR-007**: JWT with refresh tokens
- **ADR-008**: Docker Compose for deployment
- **ADR-009**: SSR with Angular Universal for SEO
- **ADR-010**: PWA for offline capabilities

---

*This architecture document is a living document. Update it as the system evolves.*

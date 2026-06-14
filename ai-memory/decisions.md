# Architecture Decision Records

> **Status:** Active  
> **Last Updated:** 2026-06-13  

---

## ADR-001: Angular + NgRx for Frontend State Management

**Status:** Accepted

**Context:**
StreamVerse requires a complex frontend with real-time state updates (streaming status, EPG data, user preferences), multiple concurrent data sources, and predictable state management. The team evaluated React + Redux, Vue + Pinia, and Angular + NgRx.

**Decision:**
Use Angular 20+ with NgRx for state management, Angular Signals for fine-grained reactivity, and RxJS for async operations.

**Rationale:**
- NgRx provides unidirectional data flow (Store → Selector → Component), making state changes predictable and debuggable
- Angular Signals (v20+) enable fine-grained change detection without zone.js overhead, critical for streaming UI updates
- RxJS integration is native to Angular, making WebSocket streams, HTTP polling, and event handling consistent
- Strong typing across the entire stack (TypeScript)
- Enterprise-grade tooling: CLI, schematics, testing utilities
- NgRx DevTools provide time-travel debugging for complex state scenarios

**Consequences:**
- Positive: Predictable state, excellent tooling, strong typing
- Positive: Signals improve rendering performance for streaming UI
- Negative: Steeper learning curve for NgRx boilerplate
- Negative: Bundle size increase (~30KB gzipped for NgRx core)
- Tradeoff: Signals vs. RxJS — we use Signals for component-local state, RxJS for async streams

**Decision Chain:**
- Angular Universal SSR (ADR-009) addresses initial load and SEO
- PWA (ADR-010) builds on Angular Service Worker

---

## ADR-002: NestJS with TypeORM for Backend

**Status:** Accepted

**Context:**
The backend needs to handle streaming orchestration, user management, catalog APIs, WebSocket connections, and background transcoding jobs. The team considered Express.js, Fastify, NestJS, and Django.

**Decision:**
Use NestJS 10+ with TypeORM 0.3+, following Clean Architecture principles.

**Rationale:**
- Modular architecture (modules, controllers, providers) matches Clean Architecture layers
- Built-in support for WebSockets (Socket.io), GraphQL, queues
- TypeORM provides both Active Record and Data Mapper patterns with migration support
- Decorator-based validation (class-validator) and transformation (class-transformer)
- Swagger/OpenAPI auto-generation via @nestjs/swagger
- Dependency injection enables testability and loose coupling
- Consistent TypeScript across frontend and backend

**Consequences:**
- Positive: Rapid development with decorators and code generation
- Positive: Unified language (TypeScript) reduces context switching
- Negative: TypeORM can be verbose for complex queries; raw SQL used when needed
- Negative: NestJS abstraction adds some overhead vs. raw Express
- Mitigation: Use TypeORM's query builder for complex queries, raw SQL for performance-critical paths

---

## ADR-003: PostgreSQL as Primary Database

**Status:** Accepted

**Context:**
The application requires ACID compliance for user data and transactions, JSON support for flexible content metadata, full-text search for catalog search, and reliable migrations. Considered PostgreSQL, MySQL, MongoDB.

**Decision:**
Use PostgreSQL 16+ as the primary database.

**Rationale:**
- ACID compliance for user accounts, favorites, watch history transactions
- JSONB columns for flexible content metadata (movie details, series info)
- Full-text search (tsvector) eliminates need for separate search service initially
- Excellent extension ecosystem (PostGIS for geolocation, pg_cron for scheduling)
- Mature migration tooling (TypeORM migrations)
- Strong concurrency with MVCC
- JSONB with GIN indexes for performant JSON queries

**Consequences:**
- Positive: Single database for relational and semi-structured data
- Positive: Full-text search built-in (TSearch5 configuration)
- Negative: Requires connection pooling (pgBouncer for production)
- Negative: Read scaling requires replicas or partitioning
- Mitigation: Redis caching (ADR-004) reduces read load

---

## ADR-004: Redis for Caching and Session Management

**Status:** Accepted

**Context:**
The platform needs fast caching for catalog data, session storage for refresh tokens, rate limiting counters, and pub/sub for real-time WebSocket events. Considered Redis, Memcached, in-memory caching.

**Decision:**
Use Redis 7+ for caching, session storage, rate limiting, and pub/sub messaging.

**Rationale:**
- Sub-millisecond read/write for catalog caching (80% cache hit ratio target)
- Built-in TTL and eviction policies (LRU, LFU)
- Pub/sub for WebSocket channel switch events across multiple API instances
- Sorted sets for leaderboards and trending content
- Rate limiting counters with EXPIRE
- Redis Sentinel for high availability
- Cache-Aside pattern: Read from cache → miss → read DB → write cache

**Consequences:**
- Positive: Drastically reduces database load for read-heavy catalog endpoints
- Positive: Enables horizontal scaling of WebSocket connections
- Positive: Centralized session store (JWT blacklist, refresh token tracking)
- Negative: Additional infrastructure component to manage
- Negative: Cache invalidation complexity (solved with TTL + event-driven invalidation)
- Negative: Memory planning required (estimate ~2GB for production)

**Cache Strategy:**
```
Catalog Items:       TTL 1 hour, invalidate on content update
User Sessions:       TTL 7 days (matching refresh token)
Rate Limit Counters: TTL 1 minute
EPG Data:            TTL 5 minutes
Search Results:      TTL 10 minutes
```

---

## ADR-005: HLS + DASH for Adaptive Streaming

**Status:** Accepted

**Context:**
The platform needs to stream live TV and VOD content with adaptive bitrate, broad device compatibility, and low-latency options. Considered HLS-only, DASH-only, HLS+DASH, WebRTC.

**Decision:**
Support both HLS (primary) and MPEG-DASH (secondary) adaptive streaming protocols.

**Rationale:**
- HLS: Universal support across iOS, Safari, macOS, and growing Chrome/Android support
- DASH: Better codec flexibility, preferred on Android/Chrome, wider smart TV support
- HLS.js enables HLS playback in browsers without native HLS (Chrome, Firefox)
- Both use segmented streaming with adaptive bitrate (ABR)
- FFmpeg can output both HLS and DASH simultaneously from a single transcode
- Common Media Application Format (CMAF) for single-format multi-protocol

**Consequences:**
- Positive: Maximum device and browser compatibility
- Positive: CMAF reduces storage (one set of segments for both protocols)
- Negative: Increased complexity in manifest generation
- Negative: Twice the transcoding output (mitigated by CMAF)
- Negative: Requires CDN configured for both .m3u8 and .mpd content types

**ABR Ladder:**
```
Track   Resolution   Bitrate
144p    256×144      200 Kbps
240p    426×240      400 Kbps
360p    640×360      800 Kbps
480p    854×480     1500 Kbps
720p   1280×720     3000 Kbps
1080p  1920×1080    6000 Kbps
4K     3840×2160   16000 Kbps (VOD only)
```

---

## ADR-006: WebSocket for Live Channel Switching

**Status:** Accepted

**Context:**
Live TV requires sub-second channel switching with minimal buffering. HTTP polling for EPG updates and channel changes introduces unacceptable latency. Considered HTTP polling, Server-Sent Events (SSE), WebSocket.

**Decision:**
Use Socket.io (WebSocket with fallback) for real-time channel switching, EPG updates, and live stream notifications.

**Rationale:**
- WebSocket provides full-duplex, low-latency communication (<50ms)
- Socket.io provides automatic fallback to HTTP long-polling when WebSocket is unavailable
- Room-based broadcasting: each channel has a Socket.io room, viewers join on channel selection
- Seamless channel switch: server sends new stream URL + EPG data → client updates player
- Redis adapter enables cross-instance WebSocket communication (ADR-004)
- Used for: channel change events, EPG updates, live stream status, user watching status

**Consequences:**
- Positive: Sub-second channel switching with preload hinting
- Positive: Real-time EPG updates as programs change
- Negative: Connection state management required (reconnect, heartbeat)
- Negative: Redis pub/sub required for multi-instance deployments
- Negative: Additional load on server (mitigated by horizontal scaling)

**WebSocket Events:**
```
Client → Server:
  channel:join       { channelId: string }
  channel:leave      { channelId: string }
  stream:quality     { quality: string }

Server → Client:
  stream:manifest    { url: string, protocol: string, qualities: [] }
  stream:switch      { channelId: string, manifestUrl: string }
  epg:update         { channelId: string, current: {}, next: {} }
  notification       { type: string, message: string }
```

---

## ADR-007: JWT with Refresh Tokens for Authentication

**Status:** Accepted

**Context:**
The platform needs stateless authentication for API scalability, secure token rotation, and support for multiple client types (browser, mobile, smart TV). Considered session cookies, JWT only, JWT + refresh tokens.

**Decision:**
Use short-lived JWT access tokens (15 minutes) with long-lived refresh tokens (7 days) stored in Redis.

**Rationale:**
- Stateless access tokens: no DB lookup on each API request
- Short TTL (15min) limits damage from token theft
- Refresh tokens enable seamless re-authentication without re-login
- Refresh token rotation: old token invalidated on each refresh
- Redis stores refresh token hash for quick validation + revocation
- JWT blacklist in Redis allows immediate token revocation
- RS256 signing (asymmetric) enables token verification by API gateway without private key

**Consequences:**
- Positive: Stateless API requests (no session DB queries)
- Positive: Secure with rotation and short TTL
- Positive: Cross-domain/cross-device compatibility
- Negative: Requires Redis for refresh token storage
- Negative: Token refresh adds ~50ms per refresh (acceptable)
- Negative: JWT size overhead (~1KB per request)

**Token Flow:**
```
1. Login          → { accessToken (15m), refreshToken (7d) }
2. API Request    → Authorization: Bearer <accessToken>
3. Token Expired  → 401 Unauthorized
4. Refresh        → POST /auth/refresh { refreshToken }
5. New Tokens     → { accessToken, refreshToken } + rotate
6. Revoke         → POST /auth/logout (blacklist both tokens)
```

---

## ADR-008: Docker Compose for Local and Production Deployment

**Status:** Accepted

**Context:**
The platform has multiple services (frontend, backend, database, Redis, FFmpeg, Nginx) that need consistent deployment across development, staging, and production environments. Considered Docker Compose, Kubernetes, Nomad, manual setup.

**Decision:**
Use Docker Compose for development and production deployments, with Kubernetes as a future upgrade path.

**Rationale:**
- Low complexity: single `docker compose up` for full stack
- Environment parity: same compose file for dev and production (with overrides)
- Multi-stage Dockerfiles for optimized production images
- Health checks for each service
- Volume management for persistent data (PostgreSQL, Redis, media)
- Network isolation with Docker networks
- Resource limits for each service (CPU, memory)
- Profiles for selective service startup during development

**Consequences:**
- Positive: Reproducible environments across team members
- Positive: Simple CI/CD integration (pull → compose up)
- Negative: Single-host deployment (Kubernetes needed for multi-host)
- Negative: Manual scaling required
- Negative: No built-in service mesh, secrets management
- Mitigation: Docker Swarm or K8s for production multi-host

**Future:**
- Kubernetes migration planned when multi-host scaling is required
- Helm charts for K8s deployment
- Service mesh (Istio/Linkerd) for observability and traffic management

---

## ADR-009: SSR with Angular Universal for SEO

**Status:** Accepted

**Context:**
Search engine crawlers need to index platform content (movie/series pages, channel guides). Client-side rendering results in poor SEO. Considered Angular Universal (SSR), Prerendering, SSG, third-party SEO services.

**Decision:**
Use Angular Universal for Server-Side Rendering with dynamic rendering fallback.

**Rationale:**
- Full SEO: crawlers receive fully-rendered HTML
- Improved Core Web Vitals: First Contentful Paint (FCP) < 1s
- Angular Universal is the official Angular SSR solution
- Dynamic rendering: SSR for crawlers, SPA for users (using Angular CLI's built-in detection)
- State transfer: server state serialized to client, preventing duplicate API calls
- Cache rendered pages in Redis for frequently accessed content
- Works with NgRx: initial state can be set on server and transferred to client

**Consequences:**
- Positive: Full SEO support for catalog pages, movie/series detail pages
- Positive: Improved perceived performance (server renders first view)
- Negative: Increased server CPU usage for SSR rendering
- Negative: Node.js server required for SSR (not just static file serving)
- Negative: Care needed with browser-specific APIs (window, document) in SSR
- Mitigation: Transfer state, Redis caching, cluster mode for SSR processes

**SSR Strategy:**
```
Crawler (Googlebot, Bing) → Nginx (detect UA) → SSR Server → Rendered HTML
Browser User              → Nginx → SPA Client-side rendering
```

---

## ADR-010: PWA for Offline Capabilities

**Status:** Accepted

**Context:**
Users may have intermittent connectivity while watching content on mobile devices. The platform should provide offline access to previously viewed content and graceful offline handling. Considered PWA, native mobile apps using Capacitor, React Native.

**Decision:**
Implement Progressive Web App (PWA) using Angular Service Worker for offline capabilities and app-like experience.

**Rationale:**
- Angular Service Worker provides built-in PWA support (ng add @angular/pwa)
- Offline caching strategy: Cache-First for assets, Network-First for API data
- App Shell pattern: cached shell loads instantly, content streams when online
- Push notifications for new content, live event reminders
- Installable: Add to home screen on Android, desktop
- Smaller scope than native apps (no app store deployment)
- Future: wrap with Capacitor for native app store distribution if needed

**Consequences:**
- Positive: Offline access to previously viewed content
- Positive: App-like experience (install, full-screen, push notifications)
- Positive: Reduced data usage (cached assets)
- Negative: Limited device API access vs. native apps
- Negative: iOS PWA limitations (no push on Safari, limited storage)
- Negative: Cache management complexity
- Mitigation: Capacitor wrapper for iOS/Android when native features needed

**Cache Strategy:**
```
App Shell:          Cache-First (install time)
Static Assets:      Cache-First + background update
API Data:           Network-First with cache fallback
Streaming Content:  Network-Only (DRM requirements)
User Preferences:   IndexedDB (offline-first, sync on connect)
```

---

*All ADRs should be reviewed quarterly. Status options: Proposed, Accepted, Deprecated, Superseded.*

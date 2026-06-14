# StreamVerse — Domain Glossary

> **Purpose:** Common vocabulary for the StreamVerse team. All technical and domain terms used in the project are defined here.  
> **Last Updated:** 2026-06-13

---

## A

### ABR (Adaptive Bitrate)
A streaming technique that dynamically adjusts video quality based on the viewer's network conditions and device capabilities. The player monitors bandwidth and CPU usage, switching between different quality renditions (e.g., 360p → 720p → 1080p) without user intervention. Implemented via HLS and DASH manifests that list multiple bitrate variants.

### Aggregates
In Domain-Driven Design, a cluster of domain objects treated as a single unit. For example, a `Series` aggregate contains `Season` and `Episode` entities, with `Series` as the aggregate root enforcing invariants.

### AirPlay
Apple's wireless streaming protocol that allows video/audio from iOS devices or macOS to be played on Apple TV or AirPlay-compatible smart TVs. Implemented via the Video.js AirPlay plugin.

### Angular Signals
A reactivity primitive introduced in Angular 16+ that provides fine-grained change detection without Zone.js. Signals are functions that return their current value and notify consumers when the value changes. Used in StreamVerse for UI state that changes frequently (playback progress, volume, EPG timers).

### Angular Universal
Angular's server-side rendering (SSR) solution that renders Angular applications on the server, producing static HTML that is sent to the client. Improves SEO, initial load performance, and social media previews.

---

## B

### Bounded Context
A central pattern in Domain-Driven Design describing the boundaries within which a particular domain model applies. Each bounded context has its own ubiquitous language and internal architecture. StreamVerse contexts: Auth, Catalog, Streaming, User, Search, Analytics.

### Bufferbloat
Excessive buffering in network equipment that increases latency, degrading real-time streaming performance. Mitigated by proper ABR algorithm tuning and client-side buffer management.

---

## C

### C4 Model
A hierarchical approach to software architecture documentation with four levels: Context (system scope), Container (high-level technology choices), Component (internal structure), and Code (detailed implementation). StreamVerse uses C4 textual diagrams in its architecture documentation.

### CDN (Content Delivery Network)
A geographically distributed network of proxy servers that cache and deliver content (video segments, images, static assets) from locations closer to end users. StreamVerse uses CDN for video segments and static assets. Reduces latency, bandwidth costs, and origin server load.

### Chromecast
Google's protocol for casting media from mobile devices or browsers to Chromecast-enabled TVs. Implemented via the Video.js Chromecast plugin.

### Clean Architecture
An architectural pattern by Robert C. Martin that enforces separation of concerns through layered architecture: Domain (enterprise business rules), Application (application business rules), Infrastructure (frameworks, databases), and Presentation (UI, API controllers). Key rule: dependencies point inward — outer layers depend on inner layers, never the reverse.

### CMAF (Common Media Application Format)
A container format standardized by MPEG that allows a single set of fragmented MP4 segments to serve both HLS and DASH streaming. Reduces storage and transcoding costs by eliminating the need for separate segment files per protocol.

### CORS (Cross-Origin Resource Sharing)
A browser security mechanism that controls which domains can access resources from a different origin. StreamVerse configures CORS in NestJS middleware and Nginx to allow requests from frontend domains while blocking unauthorized origins.

### CQRS (Command Query Responsibility Segregation)
A pattern that separates read and write operations into different models. Currently not implemented in StreamVerse but identified as a future optimization for handling complex catalog queries separately from write operations.

---

## D

### DASH (Dynamic Adaptive Streaming over HTTP)
An adaptive bitrate streaming protocol standardized as MPEG-DASH (ISO/IEC 23009-1). Uses a Media Presentation Description (MPD) manifest file to describe available segments and qualities. Used alongside HLS for maximum device compatibility.

### DDD (Domain-Driven Design)
A software development approach focusing on modeling software to match domain reality. Key concepts: entities, value objects, aggregates, domain events, bounded contexts, ubiquitous language. StreamVerse uses DDD for its content and streaming domain models.

### DRM (Digital Rights Management)
Technologies that control access to copyrighted content. While not implemented in the initial version, the streaming architecture supports integration with Widevine (Google), FairPlay (Apple), and PlayReady (Microsoft) for premium content protection.

### DTO (Data Transfer Object)
An object that carries data between processes or layers. In StreamVerse, DTOs are used at the application layer boundaries to define the shape of API request/response data, validated with class-validator decorators.

---

## E

### Entity
In DDD, an object that has a distinct identity that persists through time, even if its attributes change. Examples: User (identified by userId), Channel, Movie (identified by contentId).

### EPG (Electronic Program Guide)
A digital guide showing scheduled television programming for each channel. StreamVerse provides real-time EPG data via WebSocket, showing current and upcoming programs for each live channel.

---

## F

### FCP (First Contentful Paint)
A Core Web Vital metric measuring the time from navigation to when the browser renders the first piece of content. StreamVerse targets FCP < 1 second through SSR, lazy loading, and optimized asset delivery.

### FFmpeg
A cross-platform multimedia framework used for encoding, decoding, transcoding, and streaming audio and video. StreamVerse uses FFmpeg for:
- Transcoding uploaded videos into HLS/DASH formats
- Creating multiple quality renditions (ABR ladder)
- Video thumbnail generation
- Live stream transcoding from RTMP to HLS/DASH

---

## G

### GIN Index (Generalized Inverted Index)
A PostgreSQL index type designed for indexing composite types, arrays, and JSONB data. Used in StreamVerse for efficient querying of movie metadata stored in JSONB columns.

### Guard
In NestJS, a class annotated with `@Injectable()` that implements `CanActivate` and determines whether a request should be processed based on conditions (authentication, roles, permissions). Equivalent to middleware in other frameworks.

---

## H

### HLS (HTTP Live Streaming)
Apple's adaptive bitrate streaming protocol. Works by dividing video into small HTTP-based file downloads (segments, typically 4-10 seconds). A manifest file (.m3u8) lists available segments and quality variants. StreamVerse uses HLS as the primary streaming protocol due to its universal support across Apple devices and broad browser compatibility via HLS.js.

### HLS.js
A JavaScript library that implements HLS playback in browsers using the Media Source Extension (MSE) API. Enables HLS streaming in browsers that don't natively support it (Chrome, Firefox, Edge).

### HSTS (HTTP Strict Transport Security)
A security header that instructs browsers to only communicate with the server over HTTPS. Configured in Nginx for StreamVerse to prevent protocol downgrade attacks.

---

## I

### Interceptor
In NestJS, a class that wraps around request/response handling. Used in StreamVerse for logging, response transformation, caching headers, and timing measurements.

---

## J

### JWT (JSON Web Token)
A compact, URL-safe token format for securely transmitting claims between parties. StreamVerse uses RS256-signed JWTs for stateless authentication, containing user ID, roles, and token metadata. Access tokens are short-lived (15 minutes), refresh tokens are long-lived (7 days) and stored in Redis.

---

## M

### Manifest
A file that describes available media segments and quality variants for adaptive streaming. HLS uses `.m3u8` playlist files, DASH uses `.mpd` (Media Presentation Description) files. The player fetches the manifest first, then requests segments listed in it.

### Migration
A version-controlled change to database schema. StreamVerse uses TypeORM migrations for evolving the database schema in a tracked, repeatable manner. Each migration has an `up` (apply) and `down` (revert) method.

### MSE (Media Source Extensions)
A W3C specification that enables JavaScript to construct media streams for playback in HTML5 `<video>` and `<audio>` elements. Used by HLS.js and other streaming libraries to implement adaptive streaming in browsers.

### MVCC (Multi-Version Concurrency Control)
PostgreSQL's concurrency control mechanism that allows multiple transactions to read and write simultaneously without blocking. Each transaction sees a snapshot of data as of a point in time.

---

## N

### NgRx
A reactive state management library for Angular based on Redux patterns. Provides a centralized Store with unidirectional data flow: Actions → Reducers → Store → Selectors → Components. Used in StreamVerse for managing authentication state, catalog cache, streaming state, and user preferences.

### Nginx
A high-performance HTTP server, reverse proxy, and load balancer. StreamVerse uses Nginx for:
- HTTPS termination and SSL/TLS management
- Rate limiting and request filtering
- Serving static frontend assets
- Reverse proxy to backend API
- RTMP module for live stream ingestion

---

## O

### OTT (Over-The-Top)
Media content delivered directly to viewers over the internet, bypassing traditional cable or satellite television platforms. Examples: Netflix, Hulu, Pluto TV. StreamVerse is an OTT platform.

### OWASP (Open Web Application Security Project)
A nonprofit organization focused on web application security. Their Top 10 is used as a security baseline for StreamVerse, addressing injection, broken authentication, XSS, insecure deserialization, and other vulnerabilities.

---

## P

### Passport
A middleware for Node.js that provides authentication strategies. StreamVerse uses Passport with JWT strategy (`passport-jwt`) and local strategy (`passport-local`) for username/password authentication, with Google OAuth2 planned.

### PII (Personally Identifiable Information)
Data that can identify a specific individual (name, email, IP address, device fingerprint). StreamVerse handles PII according to GDPR/CCPA requirements, with encryption at rest and minimal collection.

### PWA (Progressive Web App)
A web application that uses modern web capabilities to deliver an app-like experience. StreamVerse's PWA features include: installable (manifest.json), offline support (Service Worker), push notifications, and background sync.

---

## R

### RBAC (Role-Based Access Control)
An authorization model that restricts system access to authorized users based on defined roles. StreamVerse roles: Admin (full access), Editor (content management), User (standard access), Guest (unauthenticated, limited catalog view).

### Redis
An in-memory data structure store used as a cache, message broker, and session store. StreamVerse uses Redis for: API response caching, refresh token storage, WebSocket pub/sub (channel switch events across instances), rate limiting counters, and session data.

### RTMP (Real-Time Messaging Protocol)
A protocol developed by Macromedia (now Adobe) for streaming audio, video, and data over the internet. StreamVerse uses Nginx RTMP module to ingest live streams from encoders (OBS, hardware encoders), then FFmpeg re-transcodes to HLS/DASH for distribution.

---

## S

### Segment
A small chunk of video content (typically 2-10 seconds) that forms part of an adaptive streaming playlist. Players request segments sequentially and stitch them together for playback. Short segments enable faster channel switching but increase manifest overhead.

### SSR (Server-Side Rendering)
The process of rendering a web application on the server instead of the client. StreamVerse uses Angular Universal for SSR to improve SEO, initial page load performance, and social media link previews.

### Swagger
A tool for designing, building, and documenting RESTful APIs. StreamVerse uses `@nestjs/swagger` to auto-generate OpenAPI documentation with an interactive Swagger UI at `/api/docs`.

---

## T

### TLS (Transport Layer Security)
A cryptographic protocol providing secure communication over a network. StreamVerse requires TLS 1.3 for all client-server communication, terminated at the Nginx reverse proxy.

### Transcoding
The process of converting a media file from one format to another. In streaming, this often means converting a source video into multiple bitrates and formats (HLS and DASH segments) for adaptive streaming delivery.

### TypeORM
An ORM for TypeScript and JavaScript that supports both Active Record and Data Mapper patterns. Provides entity management, repository pattern, query builder, and migration tools. StreamVerse uses the Data Mapper pattern with custom repositories.

### tsvector / tsquery
PostgreSQL full-text search data types. `tsvector` stores pre-processed text for efficient search, `tsquery` represents a search query. Used in StreamVerse for catalog search with ranking (`ts_rank`).

---

## U

### Ubiquitous Language
A DDD concept: a common language shared by developers and domain experts that describes the domain model. Every team member uses the same terms with the same meanings, reflected in code, documentation, and conversations.

### Use Case
In Clean Architecture, a use case represents a single business operation. It orchestrates the flow of data between entities and defines how external actors interact with the system. Examples: `LoginUseCase`, `StartStreamUseCase`, `AddFavoriteUseCase`.

---

## V

### Value Object
In DDD, an immutable object that describes a concept purely by its attributes (no identity). Examples: `Email` (validated email string), `StreamUrl` (validated URL with protocol), `ContentRating` (age rating value). Two value objects are equal if all their attributes are equal.

### VOD (Video on Demand)
A media distribution system that allows users to access video content without a traditional broadcast schedule. Users can start, pause, rewind, or fast-forward content at any time. StreamVerse provides VOD for movies, series, and documentaries.

---

## W

### WebSocket
A protocol providing full-duplex communication channels over a single TCP connection. StreamVerse uses WebSocket via Socket.io for real-time channel switching, EPG updates, and live stream notifications.

---

*This glossary should be updated as new terms are introduced. All team members are encouraged to contribute.*

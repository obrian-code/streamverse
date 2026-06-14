# StreamVerse — Lessons Learned

> **Purpose:** Document issues encountered, solutions implemented, and best practices discovered during development.  
> **Last Updated:** 2026-06-13

---

## How to Use This File

When you encounter a non-trivial issue or discover a best practice, add an entry here with:

```
### YYYY-MM-DD: Brief Title
- **Context:** What were we trying to do?
- **Problem:** What went wrong?
- **Root Cause:** Why did it happen?
- **Solution:** How was it fixed?
- **Prevention:** How to avoid in the future?
- **Tags:** [angular, nestjs, streaming, docker, database, security, performance]
```

---

## Architecture Patterns

### 2026-03-15: Circular Dependencies in NestJS Modules
- **Context:** Building feature modules (AuthModule importing UsersModule, UsersModule importing AuthModule for guards).
- **Problem:** NestJS threw `Circular dependency detected` errors during startup.
- **Root Cause:** Two modules directly importing each other.
- **Solution:** Extracted shared interfaces into a `@streamverse/core` shared module. Used forward references (`@Inject(forwardRef(() => OtherModule))`) where direct extraction wasn't possible.
- **Prevention:** Design module dependency graph before implementing. Keep modules independent. Use `forwardRef` only as last resort.

### 2026-03-20: NgRx Store Bloat with Streaming State
- **Context:** Storing all streaming metadata (segments, quality levels, buffer state) in NgRx store.
- **Problem:** Store size grew to 50MB+, causing performance degradation on low-end devices.
- **Root Cause:** Treating transient streaming state (buffer, segments) as application state.
- **Solution:** Moved streaming-specific state (current time, buffer level, quality) to Angular Signals with component-scoped lifecycle. NgRx store now only holds persistent state (user preferences, watch history, favorites).
- **Prevention:** Clear distinction between persistent state (store) and transient UI state (Signals/local state).

### 2026-04-02: TypeORM N+1 Query Problem
- **Context:** Loading channel list with EPG data.
- **Problem:** 20 channels → 20+1 queries (one for channels, one per channel for EPG data).
- **Root Cause:** TypeORM `@ManyToOne` / `@OneToMany` lazy loading defaulting to separate queries.
- **Solution:** Switched to eager loading with `relations: ['epg']` and used query builder with `leftJoinAndSelect` for complex queries.
- **Prevention:** Always use `relations` or `QueryBuilder` for related entities. Enable logging to detect N+1 in development.

---

## Performance Optimization

### 2026-03-25: API Response Time Spikes Under Load
- **Context:** Catalog API returning movie lists with metadata.
- **Problem:** Response time increasing from 50ms to 2s under 100 concurrent users.
- **Root Cause:** JSONB queries without proper indexes. `WHERE metadata @> '{"genre": "action"}'` scanning entire table.
- **Solution:** Added GIN indexes on JSONB columns (`CREATE INDEX idx_movies_metadata ON movies USING GIN (metadata jsonb_path_ops)`). Implemented Redis caching with 5-minute TTL.
- **Prevention:** Database indexing review before deployment. Query analysis with `EXPLAIN ANALYZE`. Redis cache for read-heavy endpoints.

### 2026-04-10: Large Bundle Size from Angular Material
- **Context:** Production build analysis revealed 1.2MB main.js.
- **Problem:** Slow initial load on slow networks (3G).
- **Root Cause:** Importing full Angular Material modules instead of individual components.
- **Solution:** Tree-shakeable imports: `import { MatButtonModule } from '@angular/material/button'`. Moved Material components to lazy-loaded feature modules where possible.
- **Prevention:** Enforce import rules in ESLint (`@angular-eslint/prefer-standalone` and component-level imports).

### 2026-04-18: Redis Memory Exhaustion
- **Context:** Production deployment with Redis caching.
- **Problem:** Redis process killed by OOM killer after 3 days.
- **Root Cause:** No maxmemory policy configured. Cache grew unbounded.
- **Solution:** Set `maxmemory 2gb` and `maxmemory-policy allkeys-lru` in Redis config. Implemented per-category TTLs.
- **Prevention:** Always configure Redis memory limits. Monitor Redis memory usage in production. Set appropriate TTLs for cached data.

### 2026-05-01: Slow HLS Segment Loading
- **Context:** Live channel switching taking 5+ seconds.
- **Problem:** After switching channels, user waits 5s+ for video to start.
- **Root Cause:** Client downloading manifest, then waiting for next segment boundary. Segment duration was 10s.
- **Solution:** Reduced segment duration to 4s. Implemented segment prefetching (client requests next segment before current one finishes). Added WebSocket-based channel switch hinting (server sends stream URL proactively).
- **Prevention:** Keep segments short (4-6s) for live content. Preload manifests and first segment on channel select.

---

## Security Practices

### 2026-03-30: JWT Token Leak in Client-Side Logs
- **Context:** Debugging authentication issues in development.
- **Problem:** JWT tokens appeared in browser console logs and were committed to Git.
- **Root Cause:** Console.log statements in auth service left in production build. .env not in gitignore at project start.
- **Solution:** Created ESLint rule `no-console` for production builds. Added .env and log files to .gitignore. Rotated all exposed keys.
- **Prevention:** Add .env to .gitignore at project initialization. Use debug library with environment-based filtering. Pre-commit hooks to scan for secrets.

### 2026-04-05: Rate Limiting Bypass
- **Context:** API rate limiting implemented with @nestjs/throttler.
- **Problem:** Attacker bypassed rate limits by rotating IP addresses via proxy.
- **Root Cause:** Rate limiting by IP only.
- **Solution:** Implemented multi-factor rate limiting: IP + User (if authenticated) + endpoint path. Added CAPTCHA for login/register endpoints.
- **Prevention:** Use layered rate limiting. Combine IP, user ID, and endpoint in rate limit key.

### 2026-04-22: Insecure Direct Object Reference (IDOR)
- **Context:** User favorites API returning favorites for any userId.
- **Problem:** User A could see User B's favorites by modifying the userId parameter.
- **Root Cause:** No authorization check — API trusted client-provided userId.
- **Solution:** Always use authenticated user ID from JWT, never from URL parameters. Added NestJS `@CurrentUser()` custom decorator extracting user from token.
- **Prevention:** Never trust client-provided user IDs. Use guards for authorization at the controller level. Regular security review of all endpoints.

---

## Streaming Issues

### 2026-04-12: HLS.js Stuttering on Low-Latency Streams
- **Context:** Implementing sub-2-second live latency for sports channels.
- **Problem:** HLS.js player stuttering and buffering with low-latency HLS streams.
- **Root Cause:** Low-latency HLS produces shorter segments (2s) and more frequent updates. Default HLS.js settings weren't optimized.
- **Solution:** Tuned HLS.js configuration: `lowLatencyMode: true`, `backbufferLength: 30`, `maxBufferLength: 15`, `liveSyncDurationCount: 3`. Updated video.js integration.
- **Prevention:** Test streaming configuration with target latency. Profile player performance with different settings.

### 2026-04-28: FFmpeg Transcoding CPU Overload
- **Context:** Encoding uploaded videos through FFmpeg on the same server as API.
- **Problem:** FFmpeg consumed 100% CPU, causing API timeouts.
- **Root Cause:** Transcoding running on main server without resource limits. Simultaneous encodes exhausted CPU.
- **Solution:** Isolated FFmpeg to separate Docker container with CPU limits (`--cpus=4`). Implemented job queue with Bull (Redis-backed). Maximum 2 concurrent transcodes per host.
- **Prevention:** Resource-intensive operations in separate containers with limits. Async processing with job queues. Separate transcoding workers from API servers.

### 2026-05-05: Audio-Video Sync Issues
- **Context:** Some uploaded content has audio out of sync after transcoding.
- **Problem:** Audio lags behind video by 1-3 seconds after HLS transcoding.
- **Root Cause:** Source content using variable frame rate (VFR). FFmpeg's default transcoding assumed constant frame rate (CFR).
- **Solution:** Added `-vsync cfr` and `-async 1` flags to FFmpeg transcoding command. Added pre-transcoding analysis to detect VFR content.
- **Prevention:** Normalize input media to CFR before transcoding. Validate output sync in integration tests.

---

## Deployment Gotchas

### 2026-04-08: Docker Compose Service Startup Order
- **Context:** Deploying with `docker compose up -d`.
- **Problem:** Backend crashed because PostgreSQL wasn't ready yet.
- **Root Cause:** No startup dependency enforcement. Docker Compose's `depends_on` only ensures container start, not service readiness.
- **Solution:** Added health checks to all services. Backend waits for PostgreSQL health check before starting. Used `depends_on` with `condition: service_healthy`.
- **Prevention:** Always use health checks. Service should retry DB connection with exponential backoff.

### 2026-04-15: Secret Exposure in Docker Build Args
- **Context:** Passing API keys as Docker build arguments.
- **Problem:** Secrets leaked in Docker image history (`docker history` shows build args).
- **Root Cause:** Build arguments are persisted in image layers, accessible to anyone with image access.
- **Solution:** Moved secrets to runtime environment variables (not build args). Use Docker secrets (Swarm) or `.env` file (Compose). For build-time only secrets (npm tokens), use `--secret` flag with BuildKit.
- **Prevention:** Never pass secrets as build args. Use runtime env vars. Use BuildKit secrets for build-time needs.

### 2026-05-10: Cross-Platform Path Issues
- **Context:** Development team using Windows, macOS, and Linux.
- **Problem:** Shell scripts failing with `$'\r': command not found` on Linux.
- **Root Cause:** Windows line endings (CRLF) in shell scripts committed to Git.
- **Solution:** Added `.gitattributes` with `* text=auto eol=lf` and `*.sh text eol=lf`. Configured Git to auto-convert.
- **Prevention:** Set up `.gitattributes` at project start. Use pre-commit hook to check line endings.

### 2026-05-15: SSL Certificate Expiry
- **Context:** Production deployment with Let's Encrypt.
- **Problem:** Site became inaccessible on Sunday morning.
- **Root Cause:** SSL certificate expired overnight. No monitoring on certificate expiry.
- **Solution:** Automated cert renewal with `certbot renew` as a cron job (daily). Added certificate expiry monitoring to health check endpoint. Configured alerts 14 days before expiry.
- **Prevention:** Automate SSL renewal. Monitor certificate expiry. Set up alerts. Use health check for certificate status.

### 2026-05-20: Database Connection Pool Exhaustion
- **Context:** Traffic spike during a live event.
- **Problem:** New connections failing with `too many clients already` error.
- **Root Cause:** TypeORM default connection pool of 100 connections. Each API instance created its own pool. Under load, total connections exceeded PostgreSQL's `max_connections` (default 100).
- **Solution:** Reduced TypeORM pool size to 20 per instance. Increased PostgreSQL `max_connections` to 200. Added connection timeout. Implemented connection pool monitoring.
- **Prevention:** Calculate pool size: `(max_connections - 10) / number_of_instances`. Monitor connection usage. Set up alerts at 80% capacity.

---

## Database

### 2026-04-25: Migration Conflicts in Team
- **Context:** Multiple developers running migrations simultaneously.
- **Problem:** Two migrations with the same timestamp, causing conflicts.
- **Root Cause:** TypeORM generates migration timestamps using local time. Different developers generated migrations with overlapping timestamps.
- **Solution:** Configured TypeORM to use `uuid` for migration names instead of timestamps. Established migration workflow: branch → generate → commit → merge.
- **Prevention:** Use sequential or UUID-based migration naming. One migration per branch. Review migrations in PR.

### 2026-05-08: Large JSONB Impact on Write Performance
- **Context:** Storing movie metadata (genres, cast, crew, ratings) in JSONB columns.
- **Problem:** Update queries on movies table taking >1s.
- **Root Cause:** JSONB column containing large data (~50KB per row). Every update rewrites entire row (MVCC overhead).
- **Solution:** Extracted frequently updated fields (view count, rating) to separate columns with indexes. JSONB reserved for infrequently changed metadata (cast, crew, description). Considered table partitioning for high-traffic content.
- **Prevention:** Profile write-heavy tables. Keep JSONB for read-heavy, write-seldom data. Normalize frequently updated fields.

---

## Tooling & Development

### 2026-03-10: ESLint + Prettier Conflicts
- **Context:** Setting up linting for frontend and backend.
- **Problem:** ESLint and Prettier disagreeing on code formatting, causing pre-commit hook failures.
- **Root Cause:** ESLint's formatting rules (indent, quotes, etc.) conflicting with Prettier.
- **Solution:** Used `eslint-config-prettier` to disable ESLint rules that conflict with Prettier. Prettier handles formatting, ESLint handles code quality. Added to scripts: `lint: "eslint . && prettier --check"`.
- **Prevention:** Don't use ESLint for formatting. Let Prettier handle formatting, ESLint handle logic.

### 2026-03-28: Slow Docker Build Caching
- **Context:** CI/CD Docker builds taking 8+ minutes.
- **Problem:** Each build recompiling entire application despite no dependency changes.
- **Root Cause:** Docker build cache invalidated because package.json changes or wrong COPY order.
- **Solution:** Optimized Dockerfile: `COPY package.json package-lock.json ./` BEFORE `COPY . .`. Used `--cache-from` with GitHub Actions cache. Implemented multi-stage builds to separate builder vs runtime dependencies.
- **Prevention:** Structure Dockerfile for optimal layer caching. Copy dependency files first, install, then copy source. Use CI cache.

---

*Add entries as new lessons are learned. Review quarterly during retrospectives.*

<div align="center">
  <img src="docs/images/logo.png" alt="StreamVerse Logo" width="200"/>
  <h1>StreamVerse</h1>
  <p><strong>Modern OTT Streaming Platform</strong></p>
  <p>Inspired by Pluto TV, Netflix, and Disney+. Live TV channels, video-on-demand, and interactive streaming experience.</p>

  <!-- Badges -->
  <p>
    <a href="#"><img src="https://img.shields.io/badge/Angular-20%2B-red?logo=angular" alt="Angular 20+"></a>
    <a href="#"><img src="https://img.shields.io/badge/NestJS-10%2B-red?logo=nestjs" alt="NestJS 10+"></a>
    <a href="#"><img src="https://img.shields.io/badge/PostgreSQL-16%2B-blue?logo=postgresql" alt="PostgreSQL 16+"></a>
    <a href="#"><img src="https://img.shields.io/badge/Redis-7%2B-red?logo=redis" alt="Redis 7+"></a>
    <a href="#"><img src="https://img.shields.io/badge/Docker-24%2B-blue?logo=docker" alt="Docker 24+"></a>
    <a href="#"><img src="https://img.shields.io/badge/FFmpeg-6%2B-green?logo=ffmpeg" alt="FFmpeg 6+"></a>
    <a href="#"><img src="https://img.shields.io/badge/TypeScript-5%2B-blue?logo=typescript" alt="TypeScript 5+"></a>
    <br>
    <a href="#"><img src="https://img.shields.io/badge/License-MIT-green" alt="License MIT"></a>
    <a href="#"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen" alt="PRs Welcome"></a>
    <a href="#"><img src="https://img.shields.io/badge/CI-GitHub%20Actions-blue?logo=githubactions" alt="CI - GitHub Actions"></a>
  </p>
</div>

---

## Screenshots

<!-- TODO: Add actual screenshots -->
<div align="center">
  <table>
    <tr>
      <td><img src="docs/images/screenshot-home.png" alt="Home Page" width="400"/></td>
      <td><img src="docs/images/screenshot-live.png" alt="Live TV" width="400"/></td>
    </tr>
    <tr>
      <td><em>Home Page — Hero Banner & Categories</em></td>
      <td><em>Live TV — Channel Guide & Player</em></td>
    </tr>
    <tr>
      <td><img src="docs/images/screenshot-movies.png" alt="Movies Catalog" width="400"/></td>
      <td><img src="docs/images/screenshot-player.png" alt="Video Player" width="400"/></td>
    </tr>
    <tr>
      <td><em>Movies Catalog — Grid & Filters</em></td>
      <td><em>Video Player — HLS/DASH Controls</em></td>
    </tr>
  </table>
</div>

---

## Features

### 📺 Live TV
- Real-time channel streaming with HLS/DASH
- Electronic Program Guide (EPG) with current/next show
- Sub-second channel switching via WebSocket
- Channel categories: Entertainment, News, Sports, Movies

### 🎬 Video on Demand
- Movies, series, documentaries catalog
- Multi-season series with episode management
- Continue watching across devices
- Personalized recommendations

### 👤 User Experience
- JWT authentication with refresh tokens
- Favorites and watchlist management
- Watch history with progress tracking
- User profiles and preferences
- PWA — Installable, offline support

### 🎮 Player Features
- Adaptive Bitrate (ABR) streaming
- Quality selector (144p to 4K)
- Picture-in-Picture (PiP)
- Chromecast & AirPlay support
- Subtitles and multi-language audio
- Keyboard shortcuts

### 🔧 Administration
- Content management dashboard
- Channel, movie, and series CRUD
- User management with RBAC
- Analytics dashboard
- Media upload with FFmpeg transcoding

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| [Angular 20+](https://angular.dev) | SPA framework with Signals and SSR |
| [NgRx](https://ngrx.io) | State management (unidirectional data flow) |
| [Angular Material](https://material.angular.io) | UI component library |
| [TailwindCSS](https://tailwindcss.com) | Utility-first CSS framework |
| [Video.js](https://videojs.com) | Video player with HLS/DASH plugins |
| [HLS.js](https://github.com/video-dev/hls.js) | HLS playback in browser |
| [Angular Universal](https://angular.dev/guide/ssr) | Server-side rendering for SEO |

### Backend
| Technology | Purpose |
|------------|---------|
| [NestJS 10+](https://nestjs.com) | Node.js API framework |
| [TypeORM](https://typeorm.io) | ORM with PostgreSQL |
| [PostgreSQL 16+](https://postgresql.org) | Primary database |
| [Redis 7+](https://redis.io) | Caching, sessions, pub/sub |
| [Socket.io](https://socket.io) | WebSocket for live features |
| [Swagger](https://swagger.io) | OpenAPI documentation |

### Streaming
| Technology | Purpose |
|------------|---------|
| [FFmpeg](https://ffmpeg.org) | Video transcoding |
| [HLS](https://developer.apple.com/streaming) | Adaptive streaming (Apple) |
| [MPEG-DASH](https://dashif.org) | Adaptive streaming (MPEG) |
| [Nginx RTMP](https://nginx.org) | Live stream ingestion |

### DevOps
| Technology | Purpose |
|------------|---------|
| [Docker](https://docker.com) | Containerization |
| [Docker Compose](https://docs.docker.com/compose) | Multi-service orchestration |
| [GitHub Actions](https://github.com/features/actions) | CI/CD pipelines |

---

## Architecture

StreamVerse follows **Clean Architecture** with **Domain-Driven Design**.

```
┌──────────────────────────────────────────────────────┐
│                  PRESENTATION LAYER                   │
│        Angular App  │  Controllers  │  Guards        │
├──────────────────────────────────────────────────────┤
│                  APPLICATION LAYER                    │
│        Use Cases  │  Ports  │  DTOs  │  Mappers      │
├──────────────────────────────────────────────────────┤
│                    DOMAIN LAYER                       │
│        Entities  │  Value Objects  │  Events         │
├──────────────────────────────────────────────────────┤
│                INFRASTRUCTURE LAYER                   │
│     TypeORM  │  Redis  │  FFmpeg  │  WebSocket       │
└──────────────────────────────────────────────────────┘
```

### Bounded Contexts
- **Auth** — User authentication, authorization, sessions
- **Catalog** — Content management, metadata, categories
- **Streaming** — Live channels, transcoding, ABR
- **User** — Profiles, favorites, history
- **Search** — Full-text catalog search
- **Analytics** — View tracking, recommendations

See [architecture documentation](ai-memory/architecture.md) for detailed C4 diagrams and data flow descriptions.

---

## Quick Start

### Prerequisites

- **Node.js** 18+ (recommended: 20 LTS)
- **npm** 9+
- **Docker** 24+ and **Docker Compose** 2+
- **Git**

### One-Command Setup

```bash
# Clone and set up everything
git clone <repository-url>
cd streamverse
chmod +x scripts/setup.sh
./scripts/setup.sh
```

This installs dependencies, creates `.env` files, builds Docker images, and starts all services.

### Manual Setup

```bash
# 1. Install backend dependencies
cd backend
npm ci --legacy-peer-deps

# 2. Install frontend dependencies
cd ../frontend
npm ci --legacy-peer-deps

# 3. Configure environment
cd ../backend
cp .env.example .env
# Edit .env with your configuration

# 4. Start development services (PostgreSQL, Redis)
docker compose -f ../docker/docker-compose.yml up -d postgres redis

# 5. Run migrations
npm run migration:run

# 6. Seed database
cd ../scripts
chmod +x seed-data.sh
./seed-data.sh

# 7. Start development servers
# Terminal 1: Backend
cd ../backend
npm run start:dev

# Terminal 2: Frontend
cd ../frontend
npm start
```

### Access the Application

| Service | URL |
|---------|-----|
| Frontend | [http://localhost:4200](http://localhost:4200) |
| Backend API | [http://localhost:3000](http://localhost:3000) |
| Swagger Docs | [http://localhost:3000/api/docs](http://localhost:3000/api/docs) |
| Redis Commander | [http://localhost:8081](http://localhost:8081) |

### Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@streamverse.com | admin123 |
| User | user@streamverse.com | user123 |

> **⚠ WARNING:** Change default credentials immediately in production.

---

## Docker Deployment

### Production Deployment

```bash
# Build and start all services
docker compose -f docker/docker-compose.yml -f docker/docker-compose.production.yml up -d

# Run migrations
docker compose -p streamverse run --rm backend npm run migration:run

# Seed data
docker compose -p streamverse run --rm backend npm run seed
```

### Production URL: [https://streamverse.com](https://streamverse.com) <!-- TODO: Update URL -->

### Service URLs (Production)

| Service | URL |
|---------|-----|
| Frontend | [https://streamverse.com](https://streamverse.com) |
| API | [https://api.streamverse.com](https://api.streamverse.com) |
| Swagger | [https://api.streamverse.com/docs](https://api.streamverse.com/docs) |

---

## Environment Variables

### Backend (`backend/.env`)

```env
# ── Server ────────────────────
NODE_ENV=development
PORT=3000

# ── Database ──────────────────
DB_HOST=localhost
DB_PORT=5432
DB_USER=streamverse
DB_PASSWORD=YOUR_DB_PASSWORD_HERE
DB_NAME=streamverse

# ── Redis ─────────────────────
REDIS_HOST=localhost
REDIS_PORT=6379

# ── JWT ───────────────────────
JWT_SECRET=YOUR_JWT_SECRET_HERE
JWT_REFRESH_SECRET=YOUR_REFRESH_SECRET_HERE
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ── Storage ───────────────────
UPLOAD_DIR=./uploads
MEDIA_DIR=./media

# ── Streaming ─────────────────
STREAMING_PROTOCOL=hls
SEGMENT_DURATION=4

# ── CORS ──────────────────────
CORS_ORIGIN=http://localhost:4200,http://localhost:80

# ── Throttle ──────────────────
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

### Docker Compose (`docker/.env`)

```env
POSTGRES_DB=streamverse
POSTGRES_USER=streamverse
POSTGRES_PASSWORD=YOUR_DB_PASSWORD_HERE
REDIS_PASSWORD=YOUR_REDIS_PASSWORD_HERE
JWT_SECRET=YOUR_JWT_SECRET_HERE
```

---

## API Documentation

Interactive API documentation is available via Swagger UI at `/api/docs` when the backend is running.

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/channels` | List all channels |
| GET | `/api/channels/:id` | Channel details with EPG |
| GET | `/api/movies` | List movies (paginated) |
| GET | `/api/movies/:id` | Movie details |
| GET | `/api/series` | List series |
| GET | `/api/series/:id` | Series with seasons/episodes |
| GET | `/api/stream/:channelId` | Get stream manifest URL |
| GET | `/api/favorites` | User favorites |
| POST | `/api/favorites` | Add to favorites |
| GET | `/api/history` | Watch history |
| GET | `/api/search?q=` | Full-text search |

---

## Project Structure

```
streamverse/
├── frontend/               # Angular 20+ SPA
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/       # Singleton services, guards, interceptors
│   │   │   ├── shared/     # Reusable components, directives, pipes
│   │   │   ├── layout/     # Shell layout (header, sidebar, player)
│   │   │   ├── features/   # Feature modules (auth, channels, movies, etc.)
│   │   │   ├── store/      # NgRx actions, reducers, selectors, effects
│   │   │   ├── routes/     # Route definitions and resolvers
│   │   │   └── config/     # App configuration
│   │   ├── assets/         # Static assets (images, icons)
│   │   ├── environments/   # Environment files
│   │   └── styles/         # Global SCSS, Tailwind config
│   ├── server.ts           # Angular Universal SSR server
│   └── angular.json
├── backend/                # NestJS 10+ API
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management module
│   │   ├── channels/       # Live channels module
│   │   ├── movies/         # Movies catalog module
│   │   ├── series/         # Series & episodes module
│   │   ├── streaming/      # HLS/DASH streaming module
│   │   ├── favorites/      # User favorites module
│   │   ├── analytics/      # View tracking & recommendations
│   │   └── uploads/        # Media upload module
│   ├── test/               # E2E tests
│   └── package.json
├── docker/                 # Docker configuration
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   ├── Dockerfile.ffmpeg
│   └── docker-compose.yml
├── nginx/                  # Nginx configuration
│   └── nginx.conf
├── ffmpeg/                 # FFmpeg transcoding scripts
│   ├── transcode.sh
│   └── live-transcode.sh
├── scripts/                # Utility scripts
│   ├── deploy.sh           # Linux deployment
│   ├── deploy.ps1          # Windows deployment
│   ├── setup.sh            # First-time setup
│   ├── backup-db.sh        # Database backup
│   └── seed-data.sh        # Database seed
├── ai-memory/              # AI-assisted development memory
│   ├── architecture.md     # Architecture documentation
│   ├── decisions.md        # ADRs (Architecture Decision Records)
│   ├── glossary.md         # Domain glossary
│   └── lessons-learned.md  # Development lessons
├── docs/                   # Documentation & images
├── .github/workflows/      # GitHub Actions CI/CD
│   ├── ci.yml
│   └── deploy.yml
└── README.md
```

---

## Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/JIRA-123-description`
3. **Commit changes**: Follow [Conventional Commits](https://www.conventionalcommits.org/)
   - `feat:` new feature
   - `fix:` bug fix
   - `refactor:` code restructuring
   - `docs:` documentation
   - `test:` adding tests
4. **Push** to your fork
5. **Open a Pull Request** against `main`

### Code Style

- TypeScript strict mode
- Prettier for formatting
- ESLint for code quality
- Angular style guide for frontend
- NestJS conventions for backend

### Testing

- Write unit tests for all new code
- Maintain minimum 80% code coverage
- Run test suite before pushing:

```bash
# Backend
cd backend && npm run test

# Frontend
cd frontend && npm run test
```

### Commit Messages

```
feat(auth): add Google OAuth2 login
fix(player): handle buffer underflow on slow networks
refactor(api): extract streaming logic to service
docs(readme): update deployment instructions
test(channels): add EPG service unit tests
```

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>
    <strong>StreamVerse</strong> — Built with ❤️ by the StreamVerse Team
  </p>
  <p>
    <a href="https://streamverse.com">Website</a> ·
    <a href="https://github.com/streamverse">GitHub</a> ·
    <a href="https://twitter.com/streamverse">Twitter</a> ·
    <a href="mailto:team@streamverse.com">Contact</a>
  </p>
</div>

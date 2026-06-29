# Pixels CMS — Backend API

A NestJS-based headless CMS backend for the Pixels wood products website. Provides REST APIs for homepage sections, wood products, and a price list, with JWT authentication and role-based access control.

---

## 1. Setup Instructions

### Prerequisites
- Node.js >= 18
- PostgreSQL (running locally)
- npm

### Install dependencies

```bash
npm install
```

### Configure environment variables

Copy the example below into a `.env` file at the project root (see section 2).

### Run database migrations & seed

```bash
npx prisma migrate dev
npx prisma db seed
```

### Start the server

```bash
# Development (watch mode)
npm run start:dev

# Production
npm run build
npm run start:prod
```

### API Documentation (Swagger)

Once running, open:

```
http://localhost:3000/api/docs
```

---

## 2. Environment Variables

Create a `.env` file in the project root:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/cms"

# JWT secrets (use long random strings in production)
JWT_SECRET="your-access-token-secret"
JWT_REFRESH_SECRET="your-refresh-token-secret"

# Optional: override default admin seed credentials
ADMIN_EMAIL="admin@admin.com"
ADMIN_PASSWORD="Admin1234!"
ADMIN_NAME="Admin"
```

| Variable           | Required | Description                          |
|--------------------|----------|--------------------------------------|
| `DATABASE_URL`     | Yes      | PostgreSQL connection string         |
| `JWT_SECRET`       | Yes      | Secret for signing access tokens     |
| `JWT_REFRESH_SECRET` | Yes    | Secret for signing refresh tokens    |
| `ADMIN_EMAIL`      | No       | Seed admin email (default: admin@admin.com) |
| `ADMIN_PASSWORD`   | No       | Seed admin password (default: Admin1234!) |
| `ADMIN_NAME`       | No       | Seed admin display name              |

---

## 3. Database Setup

This project uses **PostgreSQL** with **Prisma ORM**.

### Create the database

```bash
# Using psql
createdb cms
```

### Run migrations

```bash
npx prisma migrate dev
```

### Seed default data

```bash
npx prisma db seed
```

The seed creates:
- An admin user (`admin@admin.com` / `Admin1234!`)
- Homepage sections: `hero`, `our-work`, `advantages`, `about-us`, `any-questions`
- 3 wood products: Oak, Buk, Ash — each with their features
- Static image paths are registered; place actual images in `uploads/`

### View the database (Prisma Studio)

```bash
npx prisma studio
```

---

## 4. Architecture Overview

```
src/
├── auth/           JWT authentication, refresh tokens, role-based guards
├── homepage/       Homepage sections CRUD + image upload
├── wood/           Wood products + features CRUD + image upload
├── price/          Price list CRUD
├── prisma/         PrismaService (database client)
└── common/         Global response interceptor, HTTP exception filter
```

### Modules

| Module      | Route prefix   | Description                                     |
|-------------|----------------|-------------------------------------------------|
| Auth        | `/auth`        | Register, login, refresh, logout, logout-all    |
| Homepage    | `/homepage`    | Section management (public read, admin write)   |
| Wood        | `/wood`        | Wood product catalog with features              |
| Price       | `/price`       | Price list by category (délka × šířka × tloušťka) |

### Auth flow
- **Access token** — short-lived JWT, sent as `Authorization: Bearer <token>`
- **Refresh token** — 7-day JWT, stored hashed in the database; rotated on each use
- **Roles** — `admin` | `participant`; role is embedded in the JWT payload

### Database schema (summary)

| Model         | Key fields                                           |
|---------------|------------------------------------------------------|
| `User`        | email, password (bcrypt), role                       |
| `RefreshToken`| hashed token, userId, expiresAt, revoked             |
| `Section`     | key (unique), type, title, background, content (JSON), images[] |
| `Wood`        | name, slug (unique), image                           |
| `WoodFeature` | woodId, content, type (positive/negative), sortOrder |
| `PriceItem`   | category, length, width, thickness, pricePerM3       |

### Static files
Uploaded images are served from `uploads/` at `/uploads/<filename>`.  
Configured in `main.ts` via `useStaticAssets`.

---

## 5. AI Tools Used

- **Claude Code (Anthropic)** — used throughout development for:
  - Generating NestJS modules, services, controllers, and DTOs
  - Writing and updating Prisma schema migrations
  - Creating the database seed with default content
  - Setting up Swagger/OpenAPI documentation
  - Debugging TypeScript and runtime errors

---

## 6. Time Spent

| Task                                              | Time     |
|---------------------------------------------------|----------|                                      | **~3.5 hours** |

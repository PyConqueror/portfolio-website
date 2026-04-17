# Wan Aqim Portfolio Website

Personal portfolio website powered by Payload CMS and Next.js.  
Content is managed in the Payload admin panel and rendered on a custom frontend with sections for about, projects, resume, gallery, and contact.

## Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Payload CMS 3
- MongoDB via `@payloadcms/db-mongodb`
- Tailwind CSS + shadcn/ui
- Optional Vercel Blob storage for media assets

## App Overview

- Frontend routes:
  - `/` - landing page with portfolio sections
  - `/resume` - dedicated fullscreen resume viewer
- Admin route:
  - `/admin` - Payload CMS admin panel

### Active content structure

Configured in `src/payload.config.ts`.

- Collections:
  - `users`
  - `media`
  - `projects`
  - `about-me`
  - `gallery`
  - `technologies`
  - `categories`
  - `hero-section`
- Globals:
  - `social-links`
  - `about-section`
  - `projects-global`
  - `resume-section`
  - `gallery-global`

## Local Development

### 1) Configure environment

```bash
cp .env.example .env
```

Required variables:

- `DATABASE_URI` - MongoDB connection string
- `PAYLOAD_SECRET` - Payload app secret
- `NEXT_PUBLIC_SERVER_URL` - public app URL (for local: `http://localhost:3000`)
- `CRON_SECRET` - secret for scheduled job endpoints
- `PREVIEW_SECRET` - secret for preview requests
- `BLOB_READ_WRITE_TOKEN` - optional, needed when using Vercel Blob

### 2) Install dependencies

```bash
pnpm install
```

### 3) Start development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the site and [http://localhost:3000/admin](http://localhost:3000/admin) for CMS access.

On first run, create your initial admin user from the admin page.

## Common Commands

- `pnpm dev` - run development server
- `pnpm build` - build production app
- `pnpm start` - run production build
- `pnpm lint` - run ESLint
- `pnpm lint:fix` - auto-fix lint issues
- `pnpm generate:types` - regenerate Payload TypeScript types
- `pnpm generate:importmap` - regenerate admin import map
- `pnpm payload` - run Payload CLI commands

## Content Editing Workflow

1. Create and maintain records in collections (`projects`, `about-me`, `gallery`, `technologies`, `media`).
2. Select what appears on the homepage from globals:
   - `about-section` links to one `about-me` entry
   - `projects-global` selects ordered projects
   - `gallery-global` selects ordered gallery items
   - `resume-section` controls uploaded resume file
   - `social-links` controls navbar/footer/contact details
3. Publish updates in Payload; relevant globals trigger frontend revalidation.

## Docker (Optional)

The repo includes `docker-compose.yml` for local app + MongoDB:

```bash
cp .env.example .env
docker-compose up
```

This starts:

- app on port `3000`
- MongoDB on port `27017`

## Deployment Notes

- Standard production flow:
  - `pnpm build`
  - `pnpm start`
- `next-sitemap` runs in `postbuild` and uses `NEXT_PUBLIC_SERVER_URL` / `VERCEL_PROJECT_PRODUCTION_URL`.
- A production `Dockerfile` is included. If using standalone Next output, set `output: 'standalone'` in Next config.

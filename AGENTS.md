# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the main corporate website for Cogito Software, built with **Astro** and **Svelte** components. The project serves as a marketing site and lead generation platform, featuring interactive zero-landings for product validation. It uses **PocketBase** as the backend for lead management and is containerized with Docker.

## Development Commands

### Running the Application

```bash
# Start development server (default port 4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### PocketBase Type Generation

```bash
# Generate TypeScript types from PocketBase schema
npm run build:gen-types
```

Run this after modifying PocketBase collections to sync types to `src/lib/pb/pocketbase-types.ts`.

### Docker

```bash
# Run full stack (app + PocketBase)
docker-compose up

# Run PocketBase only
cd pb && docker-compose up
```

## Architecture

### Tech Stack

- **Astro**: Static site generator with SSR support
- **Svelte**: Interactive components (via `@astrojs/svelte`)
- **PocketBase**: Backend-as-a-Service for lead management
- **TailwindCSS v4**: Styling via `@tailwindcss/vite`
- **DaisyUI**: Component library
- **Node.js**: Production adapter (`@astrojs/node`)

### Project Structure

```
src/
├── components/          # Reusable Astro and Svelte components
│   ├── Header.astro
│   ├── Footer.astro
│   ├── Hero.astro
│   ├── ContactForm.svelte
│   └── ...
├── layouts/            # Page layouts
│   └── Layout.astro
├── pages/              # Astro pages (file-based routing)
│   ├── index.astro
│   ├── contact.astro
│   ├── magiclink/      # Example zero landing
│   │   └── index.astro
│   └── ...
├── lib/                # Shared utilities and libraries
│   └── pb/             # PocketBase integration
│       ├── pb.ts       # PocketBase client instance
│       └── pocketbase-types.ts
└── styles/
    └── global.css
```

### Backend Integration

**PocketBase** is the primary backend:

- Client instance: `src/lib/pb/pb.ts`
- Environment variable: `PUBLIC_PB_URL` (default: `http://localhost:8092/`)
- Types generated via `pocketbase-typegen`

**PocketBase Collections**:

- **`leads`**: Lead collection with fields:
  - `contact`: Email or phone number (text)
  - `meta`: Additional form data (JSON)
  - `experiment`: Landing page identifier (text)
  - `created`, `updated`: Timestamps

**PocketBase Hooks** (`pb/pb_hooks/`):

- Server-side JavaScript hooks for collections
- Files: `startup.pb.js` and others

**Migrations**: `pb/pb_migrations/` contains PocketBase schema migrations

### Analytics and Tracking

- **Posthog**: Analytics integration (`src/components/Posthog.astro`)
- **Meta Pixel**: Facebook/Meta tracking (`src/components/MetaPixelCode.astro`)

### Styling

- **TailwindCSS v4**: Via `@tailwindcss/vite` plugin
- **DaisyUI**: Component library with theme support
- **Theme System**: Light/dark mode via `data-theme` attribute
- **Custom Fonts**: IBM Plex Mono, Space Grotesk, Space Mono

## Zero-Landings

### Concept

Zero-landings are interactive landing pages designed to validate product ideas and collect early leads before full development. Each landing page:

- Has its own unique theme and design
- May include interactive elements (quizzes, calculators, demos, etc.)
- Focuses on communicating a specific product concept
- Collects leads through PocketBase

### Structure

Zero-landings are located in `src/pages/magiclink/`:

```
src/pages/magiclink/[landing-name]/
├── index.astro                 # Landing page
├── components/                 # Landing-specific components (optional)
│   └── InteractiveWidget.svelte
└── styles.css                  # Landing-specific styles (optional)
```

### Creating a New Zero-Landing

1. **Create landing directory**: `src/pages/magiclink/[landing-name]/index.astro`

2. **Use Layout or create custom**:

   - Use `Layout.astro` for consistency with main site
   - Or create a custom layout for unique branding

3. **Add interactive components** (optional):

   - Create Svelte components in `src/components/` or landing-specific folder
   - Use for quizzes, calculators, interactive demos, etc.

4. **Implement lead collection**:

   ```typescript
   import { pb } from "$lib/pb";

   // In Svelte component or Astro page
   await pb.collection("leads").create({
     contact: email,
     meta: {
       /* additional data */
     },
     experiment: "landing-name",
   });
   ```

5. **Track analytics**: Ensure Posthog and Meta Pixel are included (via Layout)

### Best Practices

- **Unique experiment identifier**: Use descriptive `experiment` field value (e.g., "magiclink", "product-x-v1")
- **Minimal dependencies**: Keep landings lightweight and fast-loading
- **Mobile-first**: Ensure responsive design
- **Clear value proposition**: Focus on communicating the core idea quickly
- **Simple lead capture**: Minimize form fields to reduce friction
- **A/B testing ready**: Use `experiment` field to track different variants

### Example Landing Structure

```astro
---
// src/pages/magiclink/product-x/index.astro
import Layout from "$layouts/Layout.astro";
import InteractiveDemo from "./components/InteractiveDemo.svelte";
---

<Layout path="/magiclink/product-x" title="Product X | Cogito Software">
  <main class="min-h-screen">
    <!-- Hero section with value proposition -->
    <section class="hero">
      <h1>Product X: Solve Your Problem</h1>
      <p>Interactive demo below</p>
    </section>

    <!-- Interactive component -->
    <InteractiveDemo />

    <!-- Lead capture form -->
    <!-- ... -->
  </main>
</Layout>
```

## Routes Structure

- **`src/pages/`**: Main marketing pages
  - `/`: Homepage
  - `/contact`: Contact page
  - `/custom-solution`: Custom solution page (Primary offering)
  - `/[zero]/*`: Zero-landings # aka "magiclink"
  - `/privacy-policy`, `/terms-and-conditions`: Legal pages

## Shared Components

Located in `src/components/`:

- **`Header.astro`**: Site navigation
- **`Footer.astro`**: Site footer
- **`Hero.astro`**: Hero section component
- **`ContactForm.svelte`**: Lead capture form (uses PocketBase)
- **`Portfolio.astro`**: Portfolio showcase
- **`TechStack.astro`**: Technology stack display
- **`Offer.astro`**: Offer/pricing component
- **`Background.astro`**: Background graphics
- **`ThemeController.svelte`**: Theme switching component
- **`Posthog.astro`**: Analytics integration
- **`MetaPixelCode.astro`**: Meta Pixel tracking

## Important Notes

### Environment Setup

Copy `.env.example` to `.env` and fill in required values. Critical for local development:

- `PUBLIC_PB_URL`: PocketBase URL (default: `http://localhost:8092/`)
- Analytics keys (Posthog, Meta Pixel) if needed

### Astro Configuration

- Uses `@astrojs/node` adapter for production builds
- Build output: `dist/` directory
- Server runs in standalone mode
- Svelte integration enabled for interactive components

### PocketBase Setup

- PocketBase runs in Docker container (`pb/`)
- Data persisted in `pb/pb_data/`
- Admin UI available at PocketBase URL + `/_/`
- Migrations run automatically on startup

### Styling Guidelines

- Use TailwindCSS utility classes
- Leverage DaisyUI components for consistency
- Custom styles in `src/styles/global.css`
- Theme variables via DaisyUI theme system
- Responsive design: mobile-first approach

### Lead Collection Pattern

All lead collection should follow this pattern:

```typescript
import { pb } from "$lib/pb";

// In component or page
const leadData = {
  contact: emailOrPhone,
  meta: {
    // Additional structured data
    firstName,
    lastName,
    projectType,
    message,
    // Landing-specific data
    interactionData,
    quizResults,
    etc.
  },
  experiment: "landing-identifier" // Track which landing generated the lead
};

await pb.collection("leads").create(leadData);
```

This ensures consistent lead tracking and allows for analysis of which landings perform best.

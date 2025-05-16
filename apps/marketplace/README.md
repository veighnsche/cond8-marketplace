# VHX Starter Kit

A modern, modular starter kit for building Cloudflare Worker applications using TypeScript, Preact, Hono, and TailwindCSS. This kit is structured for rapid development, clean separation of concerns, and easy extensibility using a director/actor/conduit/service pattern.

---

## Features

- **TypeScript-first**: Strong types throughout the codebase.
- **Preact UI**: Lightweight, fast component rendering.
- **TailwindCSS**: Utility-first CSS framework for rapid UI development.
- **Hono**: Minimal, fast web framework for Cloudflare Workers.
- **Cloudflare Wrangler**: Simple deployment and local development.
- **Modular Architecture**: Clear separation via actors, directors, conduits, and services.
- **PostCSS & Prettier**: Modern build and formatting tools.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (or npm/yarn)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/)

### Installation

```bash
pnpm install
```

### Development

Start the local development server (Cloudflare Worker + Tailwind in watch mode):

```bash
pnpm run dev
```

- Access your app at the local address provided by Wrangler.

### Build CSS

```bash
pnpm run build:css
```

### Deployment

Deploy to Cloudflare Workers:

```bash
pnpm run deploy
```

---

## Project Structure

```
├── public/           # Static assets (JS, favicon, built CSS)
├── scripts/          # Utility scripts (dev, mdx builder, etc.)
├── src/              # Source code
│   ├── actors/       # UI logic/actors
│   ├── component/    # Reusable components
│   ├── conduits/     # State/data conduits
│   ├── directors/    # Page composition logic
│   ├── services/     # Business logic/services
│   ├── index.ts      # App entry point (Hono routes)
│   └── styles.css    # TailwindCSS source
├── package.json      # Project metadata and scripts
├── tsconfig.json     # TypeScript configuration
├── wrangler.jsonc    # Cloudflare Worker config
├── tailwind.config.js# TailwindCSS config
├── postcss.config.js # PostCSS config
└── README.md         # Project documentation
```

---

## Core Concepts

### Director/Actor/Conduit/Service Pattern
- **Directors**: Compose pages/routes, orchestrate actors and conduits.
- **Actors**: Encapsulate UI logic and reusable UI patterns.
- **Conduits**: Manage state, data flow, and context.
- **Services**: Encapsulate business logic and utility functions.

### Routing
- Uses [Hono](https://hono.dev/) for defining endpoints (see `src/index.ts`).

### Styling
- TailwindCSS with PostCSS for processing (`src/styles.css` → `public/dist/styles.css`).

### Deployment
- Managed via [Wrangler](https://developers.cloudflare.com/workers/wrangler/).
- Static assets are served from `public/`.

---

## Extending the Kit

- Add new pages by creating new directors and routes in `src/directors/` and `src/index.ts`.
- Add UI logic with actors in `src/actors/`.
- Add or modify data/state conduits in `src/conduits/`.
- Add business logic/services in `src/services/`.
- Add static assets to `public/`.

---

## Scripts

- `dev`         : Start local dev server with live reload
- `build:css`   : Build TailwindCSS styles
- `deploy`      : Deploy to Cloudflare Workers
- `cf-typegen`  : Generate Cloudflare types
- `prettier`    : Format codebase

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Acknowledgements

- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Hono](https://hono.dev/)
- [Preact](https://preactjs.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/)
- [@cond8-ai/core](https://www.npmjs.com/package/@cond8-ai/core)

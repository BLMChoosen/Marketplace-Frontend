# Bloodmoon Marketplace Frontend

Next.js storefront and buyer/seller UI for Bloodmoon Marketplace.

## Stack

- Next.js 16, React 19 and Tailwind CSS 4
- Zustand for client state
- Axios for REST API calls
- Socket.IO client for realtime chat
- Stripe Elements for checkout

## Runtime model

The production container builds the app with `next build` and runs the standalone
Next server with `node server.js`. It is intended to sit behind the Nginx reverse
proxy from `Marketplace-Infra`.

When `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL` are empty, the frontend uses
same-origin routes:

- REST API: `/api`
- Socket.IO: current origin

That is the preferred production setup behind Nginx.

## Environment

Copy `.env.local.example` to `.env.local` and fill the values that apply to the
target environment.

Important variables:

- `NEXT_PUBLIC_API_URL`: API host. Leave empty for same-origin Nginx routing.
- `NEXT_PUBLIC_WS_URL`: Socket.IO host. Leave empty for same-origin routing.
- `NEXT_PUBLIC_CDN_URL`: CDN/public asset base URL for uploaded product media.
- `NEXT_PUBLIC_SITE_URL`: public site URL used by metadata and social previews.
- `FRONTEND_PORT`: local/container published port.

`NEXT_PUBLIC_*` values are baked into the client bundle at build time. Rebuild
the image after changing them.

## Local development

```powershell
npm install
npm run dev
```

The development server runs on `http://localhost:3000` by default.

## Production build

```powershell
npm run lint
npm run build
```

Docker:

```powershell
docker compose --env-file .env.local up --build
```

In the full platform, run Docker Compose from `Marketplace-Infra`; it includes
this compose file and the backend compose file.

## Main paths

- `app/`: Next.js routes
- `components/ui/`: shared UI components
- `context/AuthContext.js`: authentication state
- `lib/api.js`: Axios client and JWT refresh
- `lib/productStore.js`: catalog/store data
- `lib/dashboardStore.js`: seller/buyer dashboard data
- `lib/socket.js`: Socket.IO client bootstrap

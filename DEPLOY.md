# ConservationCred Deployment

## Runtime

- Node.js: `20.19.0` or newer
- Package manager: `npm`
- Build command: `npm run build`
- Output directory: `dist`

## Tech Stack

- Frontend: React 19
- Build tool: Vite 8
- Routing/UI shell: React + `lucide-react`
- Data/auth/storage: Firebase Auth, Firestore, Firebase Storage when `VITE_FIREBASE_*` env vars are present
- Offline persistence: IndexedDB via the local platform repository
- Styling: custom CSS dark-forest glassmorphism design system
- Localization: bundled JSON locale packs with runtime loading and RTL support

## Vercel

This repo includes [vercel.json](C:/Users/sonal/cc/vercel.json:1).

- Framework: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- SPA routing fallback: enabled

If Vercel is connected to a monorepo or parent repo, make sure the Vercel project root directory is set to this folder.

## Netlify

This repo includes [netlify.toml](C:/Users/sonal/cc/netlify.toml:1).

- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirect: enabled
- Node version: pinned to `20.19.0`

## Firebase Hosting

This repo includes [firebase.json](C:/Users/sonal/cc/firebase.json:1).

Typical commands:

```powershell
npm.cmd run build
firebase deploy --only hosting
```

## Environment Variables

Copy [`.env.example`](C:/Users/sonal/cc/.env.example:1) to `.env` locally, or set the same values in your hosting dashboard.

Without Firebase env vars, the app still builds and runs in local-first mode, but cloud auth, Firestore sync, and Storage uploads will stay disabled.

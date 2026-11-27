# Getting started

## What you need

- [Node.js](https://nodejs.org) 22 or newer. The automatic checks use 22 (see `.nvmrc`).
- git.
- A Supabase project of your own, if you want to sign in and use real data.
  You can still build the app and run the checks without one.

## Set up

1. Fork the repository and copy it to your computer.
2. Run `npm install`.
3. Copy `example.env` to `.env` and fill in your own Supabase project's address and public key.
   Never commit `.env`. It is ignored by git.
4. Run `npm run dev` and open http://localhost:5173.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Runs the app on your computer. It reloads when you save. |
| `npm run build` | Builds the app the way the live site gets it. |
| `npm run lint` | Looks for mistakes in the code (oxlint). Must show 0 errors. |
| `npm run build:check` | Builds a test copy with fake keys. It never talks to a real database. |
| `npm run a11y` | Checks the main pages for accessibility problems. Run `build:check` first. |
| `npm run preview` | Serves the last build, to look at it as the live site would. |

The same lint, build and accessibility checks run on every pull request.

## Settings in `.env`

| Name | Needed? | What it is |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes | Your Supabase project's address. |
| `VITE_SUPABASE_ANON_KEY` | Yes | Your project's public (anon) key. Never use the service key here. |
| `VITE_TURNSTILE_SITE_KEY` | No | Spam protection on sign up. |
| `VITE_VAPID_PUBLIC_KEY` | No | Push notifications. |
| `VITE_CRN_PREVIEW` | No | Set to `1` to turn on the Places preview that is still being built. |

Anything starting with `VITE_` ends up in the app people download, so it is public.
Only public keys go there.

## When something looks wrong

- If a change does not show, stop `npm run dev` and start it again.
- Keep line endings as git has them (LF), and save files as UTF-8 with no BOM.
- The service worker can hang while the app runs locally. Code that waits on it should give up after a short time.

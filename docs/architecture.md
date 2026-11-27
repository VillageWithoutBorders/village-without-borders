# How the app is built

## The pieces

- **The app:** React 19 and Vite 8, in plain JavaScript (`.jsx`, not TypeScript). React Router 7.
- **Styles:** plain CSS. `src/index.css` plus page styles such as `village-scene.css`, `world.css`,
  `dashboard.css` and `find-help.css`. Colors are CSS variables (`--surface`, `--accent`, `--danger` and more).
  Dark is the default. Light mode is a warm cream.
- **The database and accounts:** Supabase. Postgres with row level security on every table,
  database functions (RPCs), Edge Functions, Storage, `pg_net` and `pg_cron`.
- **Maps:** Leaflet. **Scrambled chats:** libsodium, in `src/lib/e2ee.js`.
- **Works offline:** VitePWA with `injectManifest`. The service worker is `src/sw.js`.
- **QR codes:** jsQR. **Avatars:** DiceBear.
- **Hosting:** Cloudflare Pages. Every pull request gets its own preview build.

We do not add Tailwind, a component library, or a state library. Please ask in an issue first
if you think one is needed.

## Where things are

| Folder | What is in it |
|---|---|
| `src/App.jsx` | Every page's address (route). Pages load only when needed. |
| `src/pages/` | One file per page. `Layout.jsx` is the frame around every page. |
| `src/components/` | Parts used on more than one page. |
| `src/utils/` | Helpers with no screen of their own. |
| `src/hooks/` | React hooks. |
| `src/context/` | Shared state: `AuthContext`, `NotificationsContext`, `UnreadCountContext`. |
| `src/data/` | Word lists and lookup data, including the Spanish (`es.js`, `es-more.js`). |
| `src/lib/` | Scrambled chat code. |
| `public/` | Files served as they are: art, icons, and `_headers` (safety headers). |
| `functions/` | Cloudflare Pages functions: link previews for shared events and invites. |
| `supabase/functions/` | Supabase Edge Functions: push, email, calendar feed and more. |
| `scripts/` | Build check, accessibility check, and safety header helper. |

## How the app fits together

- **Who is signed in:** `AuthContext` gives `user`, `profile`, `isAdmin`, `isFounder`,
  `organizations` and `established`. Check roles with `isAdmin` and `isFounder`, never with raw role words.
- **Talking to the database:** the client is `src/supabaseClient.js`. Check every result for an error.
  Log it, and tell the person in plain words what went wrong.
- **Profiles:** `helper_profiles` is the only profile table. Other people are looked up through
  `helper_profiles_public`, which holds only what anyone may see.
- **Page frame:** `src/pages/Layout.jsx`. `BackLink` hands Back to the frame so it sits beside the title.
  Every page has one title style and a way back. A page's only main button is solid.
- **Top bar:** Places (World, Village, Cottage, in `src/components/Places.jsx`), My Corner, and Alerts.
- **Icons:** `<Icon name="..." />` from `src/components/Icon.jsx`. The art is in `public/art/icons`.
  We use drawn icons, not emoji.
- **People:** shown as drawn avatars, or a letter if they have none. Never a photo.
- **Simple view** hides things. It never removes them.
- **Plain words** (`src/utils/plainWords.js`) explain VWB's own names in a sentence, for a new account's first 14 days.
- **Menus near the edge of the screen** use `src/utils/useMenuPosition.js`, so they stay on screen.
- **Words on screen** go through `t()` from `src/utils/lang.js`. See [Writing and Spanish](writing-and-spanish.md).

## Main flows

- **Asking for help:** `open`, then `accepted`, then `completed`. It is archived once both people
  say how it went. It can also be `cancelled`. With no signal, the ask waits on the phone
  (`src/utils/pendingAsks.js`) and sends itself when the signal is back.
- **Emergencies:** someone reports one. It is verified by 2 neighbors, or by a Hope Ambassador or VWB admin.
  Then a Response Camp chat opens. When it is closed, the chat becomes read-only and is deleted 30 days later.
  The Hope Ambassador who verified it can close it alone.

Check the current status words in the code before you change any. See [The database](database.md).

# Privacy and security

VWB holds information about real neighbors, some of them in hard times. These rules are never broken.
To report a security problem, please follow [SECURITY.md](../SECURITY.md). Do not post it in a public issue.

## Never

- Never let anyone use VWB to find where a person lives or is. Use zip and town centers only, rounded.
- Never show an address on a public post, or who needs help.
- Never show an email, unless a group chose to show its contact email.
- Never add photos of people, or face or fingerprint sign in.
- Never keep copies of messages.
- Never put a secret key in the code. Only public keys start with `VITE_`.
- Never commit `.env`, data exports, or anything with people's details in it.

## How privacy is kept

- **Row level security on every table.** The database decides who may read or change each row.
  Hiding a button is never enough on its own.
- **Private things go through database functions** marked `security definer`. Each one checks who is asking.
  Each one sets `set search_path = public` (or a fixed path), so it cannot be tricked into using another schema.
- **Scrambled chats** (`src/lib/e2ee.js`): messages are locked on the phone, and only the right devices can open them.
  The server never sees the words or the private key.
- **Safety headers** in `public/_headers`, including the content rules (CSP). If you change one of the small
  scripts inside `index.html`, run `npm run build`, then `node scripts/csp-hashes.mjs`, and put the new numbers
  in `public/_headers`.
- **Edge Functions** in `supabase/functions/` run without the usual sign-in check, because the database or a
  calendar app calls them. So each one checks a shared secret header itself, or only reads what is already public.
  A new function must do the same.
- **Errors:** log them for us, and show people a plain sentence. Never show a database error, an email or an ID.

## Before you open a pull request

- Does anything new reach the screen that a stranger should not see?
- Does a new table have row level security turned on, with rules?
- Does a new `security definer` function check who is asking, and set its search path?
- Did you add a key, password, email or real person's details to any file? Remove it.

# The database

VWB runs on Supabase (Postgres). The live database is changed by hand, by a maintainer,
one SQL file at a time. There are no automatic migrations.

## Changing the database

If your change needs a new table, column, rule or function:

1. Open an issue first, and say what you need and why.
2. Write the change as one SQL file, and add it to your pull request in `supabase/proposed/`.
   Name it for what it does, like `supabase/proposed/add-event-reminders.sql`.
3. In the pull request, say the file must run before the app change goes live.

A maintainer reads it, tests it, and runs it on the live database. Then the file is moved out of the repo.

## How a SQL file must be written

- **Safe to run twice.** Use `create table if not exists`, `create or replace function`,
  `drop policy if exists` before `create policy`, and so on.
- **Deletes nothing people made.**
- **Checks before it changes.** If a table or column it needs is missing, stop with a clear message:
  `raise exception 'STOP: ...'`.
- **Adds to lists, never replaces them.** Some checks hold a list of allowed values, for example
  `notifications_type_allowed`. Read the list that is there and add to it, so nothing that grew is lost.
- **Row level security on every new table,** with rules for who may read and change rows.
- **Every `security definer` function** checks who is asking, and sets `search_path`.
- **Ends with a CHECK query** where every column says `true` when it worked.

## Things to know

- `helper_profiles` is the only profile table. Read other people through `helper_profiles_public`.
- `notifications.type` only allows listed values. A new alert type must be added to that list.
- Open `campfire_boards` must have names that are different from each other.
- Status words (like `open`, `accepted`, `completed`, `cancelled`) are read in many places.
  Do not change one without updating everything that reads it.

## Testing without the live database

- `npm run build:check` builds the app with fake keys, so it never reaches a real database.
- To try the database itself, make your own free Supabase project. Never test against the live one.

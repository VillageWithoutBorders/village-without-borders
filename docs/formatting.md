# Code style

Match the code around you. `npm run lint` must show 0 errors.

- Plain JavaScript (`.jsx` for files with a screen, `.js` for helpers). No TypeScript.
- No semicolons. Single quotes.
- Indent like the rest of the file. Most files use 2 spaces. Some older pages use 4.
- Keep a change small and focused. A pull request does one thing.
- Comments explain why, in plain words. Older comments start with a date, like `// Nov 5:`.
- Check every database call for an error. Log it, and tell the person in plain words.
- Use the helpers that are already there before you write a new one. Look in `src/utils/` and `src/hooks/`.
- No new packages without asking in an issue first. Say what it does and why nothing here can do it.
- Save files as UTF-8 with no BOM, with LF line endings.

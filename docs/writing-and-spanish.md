# Writing and Spanish

VWB is for people of every reading level, including people with learning disabilities.
The words matter as much as the code.

## How to write

- Short sentences. Common words. One idea in each sentence.
- Say what a button does: "Ask for help", not "Submit".
- No jargon. If you use a VWB name (like Campfire), the app can explain it. See [Words VWB uses](vocabulary.md).
- No em dashes.
- Warm, never cute. Never make anyone feel bad for needing help.
- Never change words that people typed themselves.

## Every word on screen goes through `t()`

```jsx
import { t } from '../utils/lang'

<button>{t('Ask for help')}</button>
<p>{t('Hi, {name}', { name: profile.display_name })}</p>
```

- The English words are the key. Write them exactly the same each time.
- Spots like `{name}` and `{n}` are filled in by the app. People's own words go in spots,
  so they are never translated or changed.
- In a component that must redraw when the language changes, use `useT()`.

## Adding the Spanish

- Add each new English sentence and its Spanish to `src/data/es-more.js`.
  `src/data/es.js` holds only the first screens, which load before the app draws.
- Use plain Latin American Spanish with "usted".
- Change the Spanish on the right side only. The left side must match the English in the code.
- Anything missing shows in English, so the app never breaks. But please add it.
- Not sure of your Spanish? Say so in the pull request, and someone can check it.

# Screen checklist

Check every change people can see against this list. Most people use VWB on a phone.

## Size and fit

- No side-to-side scrolling at 320 pixels wide.
- Buttons and links you tap are at least 44 by 44 pixels, with 8 pixels between them.
- Body text is 16 pixels or more. Inputs are 16 pixels too, so iPhones do not zoom in.
- Main buttons are within thumb reach on a phone.

## Easy to see and use

- Text contrast is at least 4.5 to 1, in both dark and light mode.
- Everything you can reach with Tab has a visible outline.
- Pages still work with text at 200%.
- With reduced motion turned on, nothing moves.

## Forms

- One field per row on phones.
- A label on every input.
- The right keyboard and autofill (`inputmode` and `autocomplete`).
- Errors show next to the field they are about, in plain words.

## Pages

- Every page has a way back.
- An empty page offers a next step.

## Check it

Look at the change at 320, 390 and 1280 pixels wide, in dark and light mode.
Then run `npm run build:check` and `npm run a11y`.

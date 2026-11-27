import { PLAIN_WORDS } from '../data/plainWords'

// Plain words (Nov 24, Jade). Shows a short meaning after VWB's own names, like
// "Campfire (a team chat)", so new people are not left guessing.
// On by itself for an account's first 14 days. Anyone can turn it on or off in
// Settings. The choice is kept on this phone (vwb_plain: 'on' or 'off'; empty = automatic).
// Only sentences get the meaning (words that end in . ? or !), never buttons, tabs or
// titles, so nothing gets too long to fit. People's own words are never changed.
const KEY = 'vwb_plain'
const subs = new Set()
let choice = read()
let newAccount = false

function read() {
  try { const v = localStorage.getItem(KEY); return v === 'on' || v === 'off' ? v : 'auto' } catch { return 'auto' }
}
function changed() { subs.forEach((f) => f()) }

export function plainOn() { return choice === 'on' || (choice === 'auto' && newAccount) }
export function plainChoice() { return choice }
export function onPlainChange(f) { subs.add(f); return () => subs.delete(f) }

// Layout tells us when the account is in its first 14 days.
export function setNewAccount(v) {
  if (!!v === newAccount) return
  newAccount = !!v
  if (choice === 'auto') changed()
}

// 'on', 'off', or 'auto'.
export function setPlainChoice(v) {
  choice = v === 'on' || v === 'off' ? v : 'auto'
  try { if (choice === 'auto') localStorage.removeItem(KEY); else localStorage.setItem(KEY, choice) } catch { /* private window */ }
  changed()
}

function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }

let built = null
function build() {
  built = { en: [], es: [] }
  for (const w of PLAIN_WORDS) {
    for (const [lang, i] of [['en', 0], ['es', 1]]) {
      // Longest spelling first, so "Campfires" wins over "Campfire".
      const forms = [...w[lang]].sort((a, b) => b.length - a.length).map(esc).join('|')
      // A whole word only, and not when a ( ) meaning is already there.
      // The second spelling is the one for more than one ("Campfires"), so it gets the "many" meaning.
      const many = w[lang][1]
      built[lang].push({ re: new RegExp('(^|[^\\p{L}])(' + forms + ')(?![\\p{L}])(?!\\s*\\()', 'u'), plain: w.plain[i], many: many && w.many ? { form: many, plain: w.many[i] } : null })
    }
  }
  return built
}

// Adds the meanings to one sentence. Each name gets its meaning once, at its first use.
export function addPlain(s, lang) {
  if (!s || typeof s !== 'string' || !/[.?!]["')”]?\s*$/.test(s)) return s
  const list = (built || build())[lang === 'es' ? 'es' : 'en']
  const held = []
  let out = s
  for (const w of list) {
    out = out.replace(w.re, (m, before, name) => {
      held.push(name + ' (' + (w.many && name === w.many.form ? w.many.plain : w.plain) + ')')
      return before + '\u0000' + (held.length - 1) + '\u0000'
    })
  }
  if (!held.length) return s
  return out.replace(/\u0000(\d+)\u0000/g, (m, n) => held[Number(n)])
}

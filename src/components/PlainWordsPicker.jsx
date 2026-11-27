import { useSyncExternalStore } from 'react'
import { plainOn, plainChoice, setPlainChoice, onPlainChange } from '../utils/plainWords'
import { useT } from '../utils/lang'
import { savePrefs } from '../utils/uiPrefs'

// Settings > Using: Plain words (Nov 24, Jade). Shows a short meaning after VWB names
// like Campfire. On by itself for the first 14 days. Saved on the account too (vwb-plain-words.sql).
const CHOICES = [
  { k: 'on', label: 'On' },
  { k: 'off', label: 'Off' },
]

export default function PlainWordsPicker() {
  const t = useT()
  // Re-draw when the choice changes, or when the 14 days are known.
  const on = useSyncExternalStore(onPlainChange, plainOn, () => false)
  const picked = plainChoice()
  const current = on ? 'on' : 'off'
  return (
    <div className="profile-details" style={{ marginBottom: '1rem' }}>
      <div className="detail-section-header" id="plain-h">{t('Plain words')}</div>
      <div role="radiogroup" aria-labelledby="plain-h" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.5rem', padding: '0.5rem 1rem 0.25rem' }}>
        {CHOICES.map((c) => (
          <button key={c.k} type="button" role="radio" aria-checked={current === c.k} onClick={() => { setPlainChoice(c.k); savePrefs({ plain: c.k }) }}
            style={{ minHeight: 56, borderRadius: 12, cursor: 'pointer', font: 'inherit', fontWeight: 700, fontSize: '1rem', padding: '0.4rem',
              border: '2px solid ' + (current === c.k ? 'var(--accent)' : 'var(--border)'),
              background: current === c.k ? 'var(--green-light)' : 'var(--surface-2)', color: 'var(--text)' }}>
            {t(c.label)}
          </button>
        ))}
      </div>
      <p style={{ margin: 0, padding: '0.25rem 1rem 0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        {t('Shows what VWB names mean, like Campfire (a team chat). It is on by itself for your first 14 days.')}
        {picked !== 'auto' && <> <button type="button" className="link-button" onClick={() => { setPlainChoice('auto'); savePrefs({ plain: 'auto' }) }}>{t('Go back to automatic')}</button></>}
      </p>
    </div>
  )
}

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'
import { useT } from '../utils/lang'

// The second step of signing in, for accounts that turned on two-step login.
// Shown instead of the app until the 6-digit code from their authenticator
// app is entered.
export default function MfaChallenge() {
  const { signOut, refreshMfa } = useAuth()
  const t = useT()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const clean = code.replace(/\s/g, '')
    if (!/^\d{6}$/.test(clean)) { setError(t('Enter the 6-digit code from your authenticator app.')); return }
    setBusy(true)
    const { data: factors, error: listErr } = await supabase.auth.mfa.listFactors()
    const list = factors?.totp || []
    if (listErr || !list.length) {
      setBusy(false)
      console.error('[MfaChallenge] listFactors', listErr)
      setError(t("We couldn't find your two-step login. Sign out and sign in again."))
      return
    }
    // Nov 24 (Jade was locked out): an account can have more than one authenticator
    // (a backup phone, or two-step set up again). The code is checked against each one,
    // not only the first, so a code from any of your phones works.
    let ok = false
    let lastErr = null
    for (const factor of list) {
      const { error: verifyErr } = await supabase.auth.mfa.challengeAndVerify({ factorId: factor.id, code: clean })
      if (!verifyErr) { ok = true; break }
      lastErr = verifyErr
      console.error('[MfaChallenge] verify', factor.friendly_name || factor.id, verifyErr)
      // Too many tries: stop here instead of using up more.
      if (verifyErr.status === 429) break
    }
    setBusy(false)
    if (!ok) {
      setCode('')
      setError(lastErr && lastErr.status === 429
        ? t('Too many tries. Wait a few minutes, then try the newest code.')
        : t('That code did not work. Check that the clock on your phone is right, then try the newest code.'))
      return
    }
    await refreshMfa()
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>Village Without Borders</h1>
          <p className="login-subtitle">{t('One more step')}</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <h2>{t('Two-step login')}</h2>
          <p className="field-hint">{t('Open your authenticator app and enter the 6-digit code for Village Without Borders.')}</p>
          <div className="form-field">
            <label htmlFor="mfaCode">{t('6-digit code')}</label>
            <input id="mfaCode" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={7} value={code} onChange={(e) => setCode(e.target.value)} autoFocus />
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="btn btn-primary btn-full" disabled={busy}>{busy ? t('Checking...') : t('Continue')}</button>
          <p className="login-toggle">
            {t('Lost your phone? Use your backup phone if you added one. If not, email info@villagewithoutborders.org from the address on your account.')}
          </p>
          <button type="button" className="link-button" onClick={signOut} style={{ fontSize: '0.875rem' }}>{t('Sign out')}</button>
        </form>
      </div>
    </div>
  )
}

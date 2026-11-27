import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { startAppTour } from './AppTour'
import Icon from './Icon'
import { tell } from './AdminDialog'
import { useT } from '../utils/lang'

// The one menu in the top bar. It replaces two hidden menus (tapping the logo,
// and a separate person icon) that people didn't know were there.
// The button says "Menu" in words, not just an icon.

// Wherever the app is actually running, so the shared link and QR code always work.
const APP_URL = window.location.origin
// The QR code opens the sign-up form directly, so someone scanning at an event
// is one step from joining.
const SIGNUP_URL = `${APP_URL}/login?mode=signup`
const SHARE_TEXT = 'Village Without Borders is a mutual aid network where neighbors help neighbors. Join us:'

// inline: shown as a plain list inside My Corner (/me), with no button and no pop-up.
// only: which inline groups to show, from 'about', 'vwb', 'logout'. All by default.
// Nov 10 (Jade): the Your account group is gone. Its rows live on the profile card,
// in Messages, and under Your roles.
export default function AppMenu({ inline = false, only = null }) {
  const t = useT()
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { canInstall, isStandalone, isIOS, promptInstall } = useInstallPrompt()
  const [open, setOpen] = useState(false)
  const [panel, setPanel] = useState(null) // 'share' | 'install' | 'logout'
  const [copied, setCopied] = useState(false)
  // Nov 11 (privacy follow-up): the share QR is made on the phone, not by an outside website.
  const [qrPng, setQrPng] = useState('')
  useEffect(() => {
    if (panel !== 'share' || qrPng) return
    let alive = true
    import('qrcode').then((m) => (m.default || m).toDataURL(SIGNUP_URL, { width: 520, margin: 0, errorCorrectionLevel: 'M', color: { dark: '#000000', light: '#ffffff' } }))
      .then((d) => { if (alive) setQrPng(d) })
      .catch((err) => console.error('QR code failed:', err))
    return () => { alive = false }
  }, [panel, qrPng])
  const buttonRef = useRef(null)
  const menuRef = useRef(null)

  // Open: focus the first item. Escape closes and returns focus to the button.
  useEffect(() => {
    if (!open || inline) return
    menuRef.current?.querySelector('button, a')?.focus()
    function onKey(e) {
      if (e.key === 'Escape') { setOpen(false); buttonRef.current?.focus() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (!panel) return
    function onKey(e) { if (e.key === 'Escape') closePanel() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [panel])

  function closePanel() {
    setPanel(null)
    setCopied(false)
    buttonRef.current?.focus()
  }

  function go(path, state) {
    setOpen(false)
    navigate(path, state ? { state } : undefined)
  }

  // Nov 24 (Jade): always opens the short guide. It has the Install button when the
  // browser offers one, steps for this kind of phone or computer, the browser-logo
  // shortcut fix, and the press-and-hold menu.
  function handleInstall() {
    setOpen(false)
    setPanel('install')
  }
  async function installNow() {
    const outcome = await promptInstall()
    if (outcome === 'accepted') closePanel()
  }

  async function handleNativeShare() {
    if (!navigator.share) return
    try {
      await navigator.share({ title: 'Village Without Borders', text: t(SHARE_TEXT), url: APP_URL })
    } catch (err) {
      if (err.name !== 'AbortError') console.error('[AppMenu] share', err)
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(`${t(SHARE_TEXT)} ${APP_URL}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('[AppMenu] copy', err)
      tell(t("Could not copy automatically. Here's the link: {link}", { link: APP_URL }), { tone: 'error' })
    }
  }

  return (
    <div className="app-menu">
      {!inline && (
      <button
        ref={buttonRef}
        type="button"
        className="header-btn"
        data-tour="menu"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="appMenuList"
        aria-haspopup="true"
        aria-label={t('Menu')}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="17" x2="20" y2="17" /></svg>
        <span className="header-btn-label">{t('Menu')}</span>
      </button>
      )}

      {(open || inline) && (() => {
        // The rows, in three groups. My Corner (inline) shows each group as its own card,
        // so a wide screen can put them side by side (Oct 30). The pop-up keeps one list.
        const about = <>
          <button type="button" className="app-menu-item" onClick={() => go('/help')}>
            <span aria-hidden="true"><Icon name="question" /></span> {t('App guide and feedback')}
          </button>
          <button type="button" className="app-menu-item" onClick={() => { setOpen(false); startAppTour() }}>
            <span aria-hidden="true"><Icon name="compass" /></span> {t('Take the tour')}
          </button>
        </>
        const vwb = <>
          <button type="button" className="app-menu-item" onClick={() => { setOpen(false); setPanel('share') }}>
            <span aria-hidden="true"><Icon name="share" /></span> {t('Share the app')}
          </button>
          {!isStandalone && (
            <button type="button" className="app-menu-item" onClick={handleInstall}>
              <span aria-hidden="true"><Icon name="phone-add" /></span> {t('Put the app on my home screen')}
            </button>
          )}
          <a className="app-menu-item" href="https://villagewithoutborders.org" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
            <span aria-hidden="true"><Icon name="globe" /></span> {t('Visit our website')}
            <span className="sr-only"> {t('(opens in a new tab)')}</span>
          </a>
        </>
        // Nov 10 (Jade): Log out sits alone in its own card on My Corner, with space above it.
        const logout = (
          <button type="button" className="app-menu-item app-menu-logout" onClick={() => { setOpen(false); setPanel('logout') }}>
            <span aria-hidden="true"><Icon name="door" /></span> {t('Log out')}
          </button>
        )
        if (inline) {
          const has = (g) => !only || only.includes(g)
          return <>
            {has('about') && <section className="app-menu-group app-menu-group-about" aria-labelledby="amg-about">
              <h2 id="amg-about" className="app-menu-heading">{t('About the app')}</h2>
              <div className="app-menu-list app-menu-inline">{about}</div>
            </section>}
            {has('vwb') && <section className="app-menu-group app-menu-group-vwb" aria-labelledby="amg-vwb">
              <h2 id="amg-vwb" className="app-menu-heading">Village Without Borders</h2>
              <div className="app-menu-list app-menu-inline">{vwb}</div>
            </section>}
            {has('logout') && <section className="app-menu-group app-menu-group-logout" aria-label={t('Log out')}>
              <div className="app-menu-list app-menu-inline">{logout}</div>
            </section>}
          </>
        }
        return <>
          <button type="button" className="app-menu-scrim" aria-label={t('Close menu')} tabIndex={-1} onClick={() => setOpen(false)} />
          <div id="appMenuList" className="app-menu-list" ref={menuRef}>
            <p className="app-menu-heading">{t('About the app')}</p>
            {about}
            <p className="app-menu-heading">Village Without Borders</p>
            {vwb}
            {logout}
          </div>
        </>
      })()}

      {panel && (
        <>
          <button type="button" className="app-dialog-scrim" aria-label={t('Close')} tabIndex={-1} onClick={closePanel} />
          {panel === 'share' && (
            <div role="dialog" aria-modal="true" aria-labelledby="shareTitle" className="app-dialog">
              <h2 id="shareTitle" className="app-dialog-title">{t('Share Village Without Borders')}</h2>
              <p className="app-dialog-text">{t("Scan with a phone camera to sign up. It's a plain link. Nothing is tracked.")}</p>
              {qrPng
                ? <img src={qrPng} alt={t('QR code that opens the Village Without Borders sign-up form')} width={260} height={260} className="app-dialog-qr" />
                : <div className="app-dialog-qr" style={{ width: 260, height: 260, maxWidth: '100%' }} role="status" aria-label={t('Loading...')} />}
              <p className="app-dialog-link">{APP_URL}</p>
              <div className="app-dialog-buttons">
                {typeof navigator !== 'undefined' && navigator.share && (
                  <button type="button" className="btn btn-primary btn-full" onClick={handleNativeShare}>{t('Share...')}</button>
                )}
                <button type="button" className="btn btn-outline btn-full" onClick={handleCopyLink}>{copied ? t('Copied!') : t('Copy link')}</button>
                <button type="button" className="btn btn-outline btn-full" onClick={closePanel} autoFocus>{t('Close')}</button>
              </div>
            </div>
          )}
          {panel === 'install' && (
            <div role="dialog" aria-modal="true" aria-labelledby="installTitle" className="app-dialog">
              <h2 id="installTitle" className="app-dialog-title">{t('Put the app on your home screen')}</h2>
              {(() => {
                const android = /Android/i.test(navigator.userAgent)
                const computer = !isIOS && !android && !!(window.matchMedia && window.matchMedia('(pointer: fine)').matches)
                return <>
                  {canInstall && (
                    <button type="button" className="btn btn-primary btn-full install-now" onClick={installNow} autoFocus>
                      <span aria-hidden="true"><Icon name="phone-add" /></span> {t('Install the app')}
                    </button>
                  )}
                  {canInstall && <p className="app-dialog-text install-or">{t('Or do it yourself:')}</p>}
                  <ol className="install-steps">
                    {isIOS ? <>
                      <li>{t('Open this page in Safari.')}</li>
                      <li>{t('Tap the Share button. It is a square with an arrow pointing up.')}</li>
                      <li>{t('Tap "Add to Home Screen," then tap "Add."')}</li>
                    </> : computer ? <>
                      <li>{t('Look at the right end of the address bar for the install button. It looks like a screen with an arrow.')}</li>
                      <li>{t('Or open the browser menu and choose "Install."')}</li>
                    </> : <>
                      <li>{t('Tap the menu. It is the three dots at the top right.')}</li>
                      <li>{t('Tap "Install app." If you only see "Add to Home screen," tap that and pick "Install."')}</li>
                      <li>{t('Tap "Install" one more time.')}</li>
                    </>}
                  </ol>
                  {!isIOS && !computer && (
                    <p className="install-note">{t('Is there a little browser logo on your VWB icon? That icon is only a shortcut. Press and hold it, remove it, then follow the steps above.')}</p>
                  )}
                  {!isIOS && (
                    <p className="install-tip">{computer
                      ? t('Once it is installed, right-click the VWB icon for quick choices: Find help, Ask for help, QR code, and My village.')
                      : t('Once it is installed, press and hold the VWB icon for quick choices: Find help, Ask for help, QR code, and My village.')}</p>
                  )}
                </>
              })()}
              <div className="app-dialog-buttons">
                <button type="button" className={'btn btn-full ' + (canInstall ? 'btn-outline' : 'btn-primary')} onClick={closePanel} autoFocus={!canInstall}>{t('Got it')}</button>
              </div>
            </div>
          )}
          {panel === 'logout' && (
            <div role="dialog" aria-modal="true" aria-labelledby="logoutTitle" className="app-dialog">
              <h2 id="logoutTitle" className="app-dialog-title">{t('Log out?')}</h2>
              <p className="app-dialog-text">{t("You'll need your email and password to get back in.")}</p>
              <div className="app-dialog-buttons">
                <button type="button" className="btn btn-full app-dialog-danger" onClick={() => { setPanel(null); signOut() }}>{t('Log out')}</button>
                <button type="button" className="btn btn-outline btn-full" onClick={closePanel} autoFocus>{t('Stay logged in')}</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

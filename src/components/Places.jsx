import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Icon from './Icon'
import { useT, tabWord } from '../utils/lang'

// Places (Nov 24, Jade): fewer tabs. My World, My Village and My Cottage are one
// Places tab in the top bar. Places opens the one you used last.
// On those pages:
//   computers: the Places tab opens into three joined buttons right in the top bar
//   (World, Village, Cottage), so there is no second row.
//   phones: a row hangs under the Places tab like a drawer, full width, same color.
// Simple view has no maps, so none of this shows there.

const LAST = 'vwb_last_place'

export function isPlacePath(pathname) {
  return pathname === '/' || pathname === '/world' || pathname === '/cottage'
    || pathname === '/village' || /^\/village\/[^/]+$/.test(pathname)
}

function whichPlace(pathname) {
  if (pathname === '/cottage') return 'cottage'
  if (pathname === '/village' || pathname.startsWith('/village/')) return 'village'
  return 'world'
}

function lastPlace() {
  try {
    const p = localStorage.getItem(LAST)
    return p === '/world' || p === '/cottage' || p === '/village' || /^\/village\/[^/]+$/.test(p || '') ? p : '/world'
  } catch { return '/world' }
}

// Remembers the place you are on, so the Places tab brings you back to it.
export function useRememberPlace(pathname, on) {
  useEffect(() => {
    if (!on || !isPlacePath(pathname)) return
    try { localStorage.setItem(LAST, pathname === '/' ? '/world' : pathname) } catch { /* private window */ }
  }, [pathname, on])
}

// The top bar tab.
export function PlacesTab() {
  const t = useT()
  const { pathname } = useLocation()
  const here = isPlacePath(pathname)
  return (
    <Link to={here ? pathname : lastPlace()} className={'header-btn places-btn' + (here ? ' on' : '')}
      aria-current={here ? 'page' : undefined} data-tour="top-places"
      aria-label={t('Places: your world, your village, and your cottage')}
      data-tip={t('Places: your world, your village, and your cottage. Pick one at the top.')}>
      <Icon name="compass" size={26} className="header-btn-pic" />
      <span className="header-btn-label" aria-hidden="true">{t('Places')}</span>
    </Link>
  )
}

// World, Village, Cottage. inline: joined buttons in the top bar (computers).
// Otherwise: the drawer row under the top bar (phones).
export function PlacesSwitch({ inline = false }) {
  const t = useT()
  const { pathname } = useLocation()
  const on = whichPlace(pathname)
  // Your own village page counts as Village too. Village with no id opens your home village.
  const villageTo = pathname.startsWith('/village/') ? pathname : '/village'
  const items = [
    { k: 'world', to: '/world', logo: true, word: 'World', tip: 'My World: see your villages and groups on a map of the world.' },
    { k: 'village', to: villageTo, icon: 'houses', word: 'Village', tip: 'My Village: your home village. Its chat, neighbors, groups, rules, and sister villages.' },
    { k: 'cottage', to: '/cottage', icon: 'cottage', word: 'Cottage', tip: 'My Cottage: your own place. Your garden, chats, calendar, groups, connections, and who can visit.' },
  ]
  const pic = (it, size) => it.logo
    ? <img className="header-btn-logo" src="/images/vwb_header-v3.png" alt="" width={size} height={size} />
    : <Icon name={it.icon} size={size} className="header-btn-pic" />
  if (inline) {
    return (
      <div className="places-inline" role="group" aria-label={t('Places')} data-tour="top-places">
        {items.map((it) => (
          <Link key={it.k} to={it.to} className={'header-btn places-seg' + (on === it.k ? ' on' : '')}
            aria-current={on === it.k ? 'page' : undefined} data-tip={t(it.tip)}>
            {pic(it, 26)}
            <span className="header-btn-label">{tabWord(it.word)}</span>
          </Link>
        ))}
      </div>
    )
  }
  return (
    <nav className="places-switch" aria-label={t('Places')}>
      {items.map((it) => (
        <Link key={it.k} to={it.to} className={'places-switch-btn' + (on === it.k ? ' on' : '')}
          aria-current={on === it.k ? 'page' : undefined} data-tip={t(it.tip)}>
          {pic(it, 22)}
          <span>{tabWord(it.word)}</span>
        </Link>
      ))}
    </nav>
  )
}

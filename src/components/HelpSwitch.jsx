import { Link, NavLink } from 'react-router-dom'
import { useWaitingOffers } from '../hooks/useWaitingOffers'
import { useOwnBack } from './BackLink'
import { useT } from '../utils/lang'

// The three parts of the Help tab: what neighbors near you need (Offer Help, once called SkillShare),
// your own requests, offers, and tasks, and the resource library (Find help).
// Your tasks shows a count when neighbors offered to help and are waiting for your yes.
// "All help" goes back to the Help doors page (the Help tab's front door).
export default function HelpSwitch() {
  const t = useT()
  useOwnBack() // "All help" is this page's way back, so the frame's Back button hides
  const waiting = useWaitingOffers()

  return (
    <>
      {/* Nov 24 (Jade, same frame on every page): "All help" is the round Back arrow at the
          start of the tab row, like Back beside a title, instead of a row of its own. */}
      <div className="help-switch-row">
      <Link to="/help-doors" className="help-switch-back" data-tip={t('Go back to all the ways to get help or give help.')}>
        <span aria-hidden="true">&#8592;</span><span className="sr-only">{t('All help')}</span>
      </Link>
      <nav className="help-switch" aria-label={t('Help')}>
        <NavLink to="/skillshare" className={({ isActive }) => 'help-switch-btn' + (isActive ? ' on' : '')}>{t('Offer Help')}</NavLink>
        <NavLink to={waiting ? '/tasks?tab=requests' : '/tasks'} className={({ isActive }) => 'help-switch-btn' + (isActive ? ' on' : '')} aria-label={waiting ? t('Your tasks') + ', ' + t(waiting === 1 ? '1 neighbor offered to help' : '{n} neighbors offered to help', { n: waiting }) : undefined}>
          {t('Your tasks')}{waiting > 0 && <span className="help-switch-count" aria-hidden="true">{waiting > 9 ? '9+' : waiting}</span>}
        </NavLink>
        <NavLink to="/community/resources" className={({ isActive }) => 'help-switch-btn' + (isActive ? ' on' : '')}>{t('Find resources')}</NavLink>
      </nav>
      </div>
    </>
  )
}

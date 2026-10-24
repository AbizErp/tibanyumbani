import { useEffect, useState } from 'react'
import { useStore } from './store.jsx'
import Icon from './Icon.jsx'
import Home from './pages/Home.jsx'
import FindPhysio from './pages/FindPhysio.jsx'
import Passport from './pages/Passport.jsx'
import Coach from './pages/Coach.jsx'
import Family from './pages/Family.jsx'
import Payments from './pages/Payments.jsx'
import Partners from './pages/Partners.jsx'
import ForPhysios from './pages/ForPhysios.jsx'
import Security from './pages/Security.jsx'

export const ROUTES = [
  { id: 'home', key: 'nav.home', icon: 'home', el: Home, bottom: true },
  { id: 'find', key: 'nav.find', icon: 'search', el: FindPhysio, bottom: true },
  { id: 'passport', key: 'nav.passport', icon: 'folder', el: Passport, bottom: true },
  { id: 'coach', key: 'nav.coach', icon: 'activity', el: Coach, bottom: true },
  { id: 'family', key: 'nav.family', icon: 'users', el: Family },
  { id: 'payments', key: 'nav.payments', icon: 'wallet', el: Payments },
  { id: 'partners', key: 'nav.partners', icon: 'store', el: Partners },
  { id: 'physios', key: 'nav.physios', icon: 'badge', el: ForPhysios, group: 'pro' },
  { id: 'security', key: 'nav.security', icon: 'shield', el: Security, group: 'pro' },
]

const routeFromHash = () => {
  const h = (typeof location !== 'undefined' ? location.hash : '').replace('#', '')
  return ROUTES.some((r) => r.id === h) ? h : 'home'
}

export default function App() {
  const { state, update, t, reset } = useStore()
  const [route, setRoute] = useState(routeFromHash)
  const [menu, setMenu] = useState(false)
  const [bell, setBell] = useState(false)
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine)

  useEffect(() => {
    const onHash = () => setRoute(routeFromHash())
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('hashchange', onHash)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('hashchange', onHash)
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = state.lang
    document.documentElement.classList.toggle('lite', state.lite)
  }, [state.lang, state.lite])

  const go = (id) => {
    setRoute(id)
    setMenu(false)
    setBell(false)
    try { history.replaceState(null, '', '#' + id) } catch { /* sandboxed */ }
    window.scrollTo({ top: 0, behavior: state.lite ? 'auto' : 'smooth' })
  }

  const Page = ROUTES.find((r) => r.id === route).el
  const unread = state.notifications.filter((n) => !n.read).length

  const NavList = () => (
    <nav className="side-nav" aria-label="Main">
      {ROUTES.filter((r) => !r.group).map((r) => (
        <button key={r.id} className={'nav-item' + (route === r.id ? ' active' : '')} onClick={() => go(r.id)} aria-current={route === r.id ? 'page' : undefined}>
          <Icon name={r.icon} /> <span>{t(r.key)}</span>
        </button>
      ))}
      <div className="nav-label">{t('nav.pro')}</div>
      {ROUTES.filter((r) => r.group).map((r) => (
        <button key={r.id} className={'nav-item' + (route === r.id ? ' active' : '')} onClick={() => go(r.id)} aria-current={route === r.id ? 'page' : undefined}>
          <Icon name={r.icon} /> <span>{t(r.key)}</span>
        </button>
      ))}
    </nav>
  )

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-inner">
          <button className="icon-btn only-mobile" onClick={() => setMenu(!menu)} aria-label={t('menu')} aria-expanded={menu}>
            <Icon name={menu ? 'x' : 'menu'} />
          </button>
          <button className="brand" onClick={() => go('home')}>
            <span className="brand-mark" aria-hidden="true"><Icon name="knee" /></span>
            <span className="brand-name">Tiba<b>Nyumbani</b></span>
          </button>
          <div className="topbar-tools">
            <span className={'net ' + (online ? 'on' : 'off')} title={online ? t('online') : t('offline')}>
              <i aria-hidden="true" />{online ? t('online') : t('offline')}
            </span>
            <button className={'chip-toggle' + (state.lite ? ' on' : '')} onClick={() => update((s) => ({ lite: !s.lite }))} aria-pressed={state.lite} title={t('lite.hint')}>
              <Icon name="signal" /> <span className="hide-xs">{t('lite')}</span>
            </button>
            <div className="lang" role="group" aria-label="Language">
              <button className={state.lang === 'en' ? 'on' : ''} onClick={() => update(() => ({ lang: 'en' }))}>EN</button>
              <button className={state.lang === 'sw' ? 'on' : ''} onClick={() => update(() => ({ lang: 'sw' }))}>SW</button>
            </div>
            <div className="bell-wrap">
              <button className="icon-btn" onClick={() => setBell(!bell)} aria-label={t('alerts')} aria-expanded={bell}>
                <Icon name="bell" />
                {unread > 0 && <span className="dot">{unread}</span>}
              </button>
              {bell && (
                <div className="popover" role="dialog" aria-label={t('alerts')}>
                  <div className="popover-head">
                    <strong>{t('alerts')}</strong>
                    <button className="link" onClick={() => update((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) }))}>{t('markRead')}</button>
                  </div>
                  <ul className="notif-list">
                    {state.notifications.slice(0, 8).map((n) => (
                      <li key={n.id} className={n.read ? '' : 'unread'}>
                        <span>{n.text}</span>
                        <time>{fmtWhen(n.at, state.lang)}</time>
                      </li>
                    ))}
                  </ul>
                  <button className="btn ghost sm full" onClick={() => go('passport')}>{t('seeAccessLog')}</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="layout">
        <aside className={'sidebar' + (menu ? ' open' : '')}>
          <NavList />
          <div className="side-foot">
            <p>{t('demoNote')}</p>
            <button className="link" onClick={reset}>{t('resetDemo')}</button>
          </div>
        </aside>
        {menu && <div className="scrim" onClick={() => setMenu(false)} />}
        <main className="main" id="main">
          <Page go={go} />
          <footer className="site-foot">
            <p>{t('footer')}</p>
          </footer>
        </main>
      </div>

      <nav className="bottom-nav" aria-label="Quick">
        {ROUTES.filter((r) => r.bottom).map((r) => (
          <button key={r.id} className={route === r.id ? 'active' : ''} onClick={() => go(r.id)}>
            <Icon name={r.icon} />
            <span>{t(r.key + '.short')}</span>
          </button>
        ))}
        <button className={menu ? 'active' : ''} onClick={() => setMenu(!menu)}>
          <Icon name="menu" />
          <span>{t('more')}</span>
        </button>
      </nav>
    </div>
  )
}

export function fmtWhen(iso, lang = 'en') {
  const d = new Date(iso)
  return d.toLocaleString(lang === 'sw' ? 'sw-KE' : 'en-KE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function fmtDate(iso, lang = 'en') {
  return new Date(iso).toLocaleDateString(lang === 'sw' ? 'sw-KE' : 'en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

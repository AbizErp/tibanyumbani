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
  { id: 'home', key: 'nav.home', el: Home, menu: true },
  { id: 'find', key: 'nav.find', el: FindPhysio, menu: true },
  { id: 'passport', key: 'nav.passport', el: Passport, menu: true },
  { id: 'coach', key: 'nav.coach', el: Coach, menu: true },
  { id: 'family', key: 'nav.family', el: Family, menu: true },
  { id: 'payments', key: 'nav.payments', el: Payments, menu: true },
  { id: 'partners', key: 'nav.partners', el: Partners },
  { id: 'physios', key: 'nav.physios', el: ForPhysios },
  { id: 'security', key: 'nav.security', el: Security },
]

const routeFromHash = () => {
  const h = (typeof location !== 'undefined' ? location.hash : '').replace('#', '')
  return ROUTES.some((r) => r.id === h) ? h : 'home'
}

export default function App() {
  const { state, update, t, l, reset } = useStore()
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
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const Page = ROUTES.find((r) => r.id === route).el
  const unread = state.notifications.filter((n) => !n.read).length

  return (
    <div className="shell">
      {/* thin top bar */}
      <div className="utility">
        <div className="wrap utility-inner">
          <span className="util-contact hide-sm"><Icon name="phone" size={14} /> 0700 000 000</span>
          <span className="util-contact hide-sm"><Icon name="sms" size={14} /> info@tibanyumbani.example</span>
          <span className={'net ' + (online ? 'on' : 'off')}><i aria-hidden="true" />{online ? t('online') : t('offline')}</span>
          <div className="util-right">
            <button className={'util-btn' + (state.lite ? ' on' : '')} onClick={() => update((s) => ({ lite: !s.lite }))} aria-pressed={state.lite} title={t('lite.hint')}>
              {t('lite')}
            </button>
            <span className="util-sep" aria-hidden="true">|</span>
            <button className={'util-btn' + (state.lang === 'en' ? ' on' : '')} onClick={() => update(() => ({ lang: 'en' }))}>English</button>
            <button className={'util-btn' + (state.lang === 'sw' ? ' on' : '')} onClick={() => update(() => ({ lang: 'sw' }))}>Kiswahili</button>
            <span className="util-sep hide-sm" aria-hidden="true">|</span>
            <button className="util-btn hide-sm" onClick={() => go('physios')}>{t('nav.physios')}</button>
          </div>
        </div>
      </div>

      {/* main header */}
      <header className="header">
        <div className="wrap header-inner">
          <button className="brand" onClick={() => go('home')}>
            <span className="brand-mark" aria-hidden="true"><Icon name="knee" size={26} /></span>
            <span className="brand-text">
              <span className="brand-name">TibaNyumbani</span>
              <span className="brand-tag">{l('Physiotherapy at home', 'Tiba ya viungo nyumbani')}</span>
            </span>
          </button>

          <nav className={'menu' + (menu ? ' open' : '')} aria-label="Main">
            {ROUTES.filter((r) => r.menu).map((r) => (
              <button key={r.id} className={'menu-item' + (route === r.id ? ' active' : '')} onClick={() => go(r.id)} aria-current={route === r.id ? 'page' : undefined}>
                {t(r.key)}
              </button>
            ))}
            <div className="menu-extra">
              {ROUTES.filter((r) => !r.menu).map((r) => (
                <button key={r.id} className={'menu-item' + (route === r.id ? ' active' : '')} onClick={() => go(r.id)}>{t(r.key)}</button>
              ))}
            </div>
          </nav>

          <div className="header-tools">
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
            <button className="icon-btn menu-toggle" onClick={() => setMenu(!menu)} aria-label={t('menu')} aria-expanded={menu}>
              <Icon name={menu ? 'x' : 'menu'} />
            </button>
          </div>
        </div>
      </header>

      <main className="main" id="main">
        {route !== 'home' && (
          <div className="crumbs wrap">
            <button className="link-plain" onClick={() => go('home')}>{t('nav.home')}</button>
            <span aria-hidden="true">›</span>
            <span>{t(ROUTES.find((r) => r.id === route).key)}</span>
          </div>
        )}
        <div className={route === 'home' ? '' : 'wrap'}>
          <Page go={go} />
        </div>
      </main>

      <footer className="footer">
        <div className="wrap footer-cols">
          <div>
            <div className="foot-brand"><Icon name="knee" size={22} /> TibaNyumbani</div>
            <p>{l('Home physiotherapy across Kenya. Verified physiotherapists, your records in your control, and support between visits.', 'Tiba ya viungo nyumbani kote Kenya.')}</p>
          </div>
          <div>
            <h4>{l('Patients', 'Wagonjwa')}</h4>
            {['find', 'passport', 'coach', 'family', 'payments'].map((id) => (
              <button key={id} className="foot-link" onClick={() => go(id)}>{t(ROUTES.find((r) => r.id === id).key)}</button>
            ))}
          </div>
          <div>
            <h4>{l('Partners & professionals', 'Washirika na wataalamu')}</h4>
            {['partners', 'physios', 'security'].map((id) => (
              <button key={id} className="foot-link" onClick={() => go(id)}>{t(ROUTES.find((r) => r.id === id).key)}</button>
            ))}
          </div>
          <div>
            <h4>{l('Contact', 'Mawasiliano')}</h4>
            <p>Nakuru, Kenya</p>
            <p>0700 000 000</p>
            <p>info@tibanyumbani.example</p>
          </div>
        </div>
        <div className="wrap footer-base">
          <span>© 2026 TibaNyumbani · {t('demoNote')}</span>
          <button className="link-plain" onClick={reset}>{t('resetDemo')}</button>
        </div>
      </footer>
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

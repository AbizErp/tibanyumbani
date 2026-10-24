import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { INITIAL_RECORDS, INITIAL_GRANTS, INITIAL_LOG, INITIAL_CAREGIVERS, INITIAL_RECEIPTS } from './data.js'
import { translate } from './i18n.js'

const KEY = 'tibanyumbani-demo-v1'

const initial = () => ({
  lang: 'en',
  lite: false,
  records: INITIAL_RECORDS,
  grants: INITIAL_GRANTS,
  log: INITIAL_LOG,
  caregivers: INITIAL_CAREGIVERS,
  receipts: INITIAL_RECEIPTS,
  sessionsTotal: 8,
  sessionsUsed: 5,
  bookings: [],
  done: {}, // exercise id -> true for today
  feedback: [],
  reminders: { times: ['08:00', '13:00', '19:00'], sms: true },
  offline: null, // { savedAt, expiresAt }
  notifications: [
    { id: 'n1', at: '2026-10-22T10:05:00', text: 'Dr. S. Njoroge downloaded “Left knee X-ray (6 weeks post-op)”.', read: false },
    { id: 'n2', at: '2026-10-21T14:31:00', text: 'We blocked 4 failed sign-in attempts from a new device.', read: false },
  ],
})

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...initial(), ...JSON.parse(raw) }
  } catch { /* storage unavailable */ }
  return initial()
}

const Ctx = createContext(null)

export function StoreProvider({ children }) {
  const [state, setState] = useState(load)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* ignore */ }
  }, [state])

  const update = useCallback((fn) => setState((s) => ({ ...s, ...fn(s) })), [])

  const logEvent = useCallback((entry, notify) => {
    const at = new Date().toISOString()
    setState((s) => ({
      ...s,
      log: [{ id: 'l' + Date.now() + Math.random(), at, route: 'Web app', ...entry }, ...s.log],
      notifications: notify
        ? [{ id: 'n' + Date.now(), at, text: notify, read: false }, ...s.notifications]
        : s.notifications,
    }))
  }, [])

  const reset = () => { try { localStorage.removeItem(KEY) } catch { /* ignore */ } setState(initial()) }

  const t = useCallback((k) => translate(state.lang, k), [state.lang])
  // inline bilingual helper: l('English text', 'Maandishi ya Kiswahili')
  const l = useCallback((en, sw) => (state.lang === 'sw' && sw ? sw : en), [state.lang])

  return <Ctx.Provider value={{ state, update, logEvent, reset, t, l }}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)

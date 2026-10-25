import { useMemo, useState } from 'react'
import { useStore } from '../store.jsx'
import Icon from '../Icon.jsx'
import { THERAPISTS, SPECIALTIES, MODES, TOWNS, distanceKm, travelFee, kes } from '../data.js'
import { PageHead, Modal, useToast } from '../ui.jsx'

const MAX_HOME_KM = 150

function score(t, f, km) {
  let s = 0
  if (t.specialties.includes(f.spec)) s += 45
  if (f.mode === 'video') s += 20
  else if (f.mode === 'home') s += Math.max(0, 20 - km / 8)
  else s += km < 30 ? 15 : 0
  s += (t.rating - 4) * 15
  if (t.available) s += 10
  if (!t.verified) s -= 15
  if (f.swahili && t.languages.includes('Kiswahili')) s += 5
  return Math.max(0, Math.min(99, Math.round(s)))
}

export default function FindPhysio() {
  const { l, update } = useStore()
  const [f, setF] = useState({ town: 'Nakuru', spec: 'knee', mode: 'home', budget: 6000, swahili: false, verifiedOnly: true })
  const [booking, setBooking] = useState(null)
  const [toast, showToast] = useToast()
  const here = TOWNS.find((t) => t.name === f.town)

  const results = useMemo(() => {
    return THERAPISTS
      .filter((t) => t.modes.includes(f.mode))
      .filter((t) => !f.verifiedOnly || t.verified)
      .map((t) => {
        const km = distanceKm(here, t)
        const travel = f.mode === 'home' ? travelFee(km) : 0
        return { ...t, km, travel, total: t.fees[f.mode] + travel, match: score(t, f, km) }
      })
      .filter((t) => !(f.mode === 'home' && t.km > MAX_HOME_KM))
      .filter((t) => t.total <= f.budget)
      .sort((a, b) => b.match - a.match)
  }, [f, here])

  const tooFar = f.mode === 'home'
    ? THERAPISTS.filter((t) => t.modes.includes('home') && distanceKm(here, t) > MAX_HOME_KM).length
    : 0

  const alternativesFor = (t) => results.filter((r) => r.id !== t.id && r.available).slice(0, 2)

  const set = (k, v) => setF((x) => ({ ...x, [k]: v }))

  return (
    <div className="page">
      <PageHead
        eyebrow={l('Smart matching', 'Ulinganishaji makini')}
        title={l('Find a physiotherapist', 'Tafuta mtaalamu wa viungo')}
        lead={l('Ranked by your condition, distance, availability and fees. Travel charges for home visits are shown before you book.', 'Wamepangwa kwa hali yako, umbali, upatikanaji na ada. Gharama za usafiri zinaonyeshwa kabla ya kupanga miadi.')}
      />

      <div className="filters card">
        <label className="field">
          <span>{l('I am in', 'Niko')}</span>
          <select id="f-town" value={f.town} onChange={(e) => set('town', e.target.value)}>
            {TOWNS.map((t) => <option key={t.name}>{t.name}</option>)}
          </select>
        </label>
        <label className="field">
          <span>{l('I need help with', 'Nahitaji msaada wa')}</span>
          <select id="f-spec" value={f.spec} onChange={(e) => set('spec', e.target.value)}>
            {SPECIALTIES.map((s) => <option key={s.id} value={s.id}>{l(s.en, s.sw)}</option>)}
          </select>
        </label>
        <label className="field">
          <span>{l('Budget per session', 'Bajeti kwa kipindi')} <b className="mono">{kes(f.budget)}</b></span>
          <input id="f-budget" type="range" min="1000" max="8000" step="250" value={f.budget} onChange={(e) => set('budget', +e.target.value)} />
        </label>
        <div className="field">
          <span>{l('How', 'Vipi')}</span>
          <div className="seg" role="radiogroup">
            {MODES.map((m) => (
              <button key={m.id} role="radio" aria-checked={f.mode === m.id} className={f.mode === m.id ? 'on' : ''} onClick={() => set('mode', m.id)}>
                <Icon name={m.id === 'home' ? 'home' : m.id === 'video' ? 'video' : 'store'} size={16} /> {l(m.en, m.sw)}
              </button>
            ))}
          </div>
        </div>
        <div className="field checks">
          <label className="check"><input id="f-sw" type="checkbox" checked={f.swahili} onChange={(e) => set('swahili', e.target.checked)} /> {l('Speaks Kiswahili', 'Anazungumza Kiswahili')}</label>
          <label className="check"><input id="f-ver" type="checkbox" checked={f.verifiedOnly} onChange={(e) => set('verifiedOnly', e.target.checked)} /> {l('Verified only', 'Waliothibitishwa pekee')}</label>
        </div>
      </div>

      <div className="results-meta">
        <strong>{results.length} {l('matches', 'wanaolingana')}</strong>
        {tooFar > 0 && <span className="muted"> · {tooFar} {l('more are too far for a home visit. Try a video call.', 'wengine wako mbali mno kwa ziara ya nyumbani. Jaribu simu ya video.')}</span>}
      </div>

      <div className="therapist-list">
        {results.length === 0 && (
          <div className="empty card">
            <Icon name="search" size={28} />
            <p>{l('No physiotherapist fits these filters. Raise the budget or switch to a video call.', 'Hakuna anayelingana. Ongeza bajeti au chagua simu ya video.')}</p>
          </div>
        )}
        {results.map((t) => (
          <article key={t.id} className="therapist card">
            <div className="t-top">
              <div className="avatar" aria-hidden="true">{t.initials}</div>
              <div className="t-id">
                <h3>{t.name} {t.verified
                  ? <span className="pill ok"><Icon name="badge" size={14} /> {l('Verified', 'Amethibitishwa')}</span>
                  : <span className="pill warn">{l('Verification pending', 'Uthibitisho unasubiriwa')}</span>}
                </h3>
                <div className="muted small">{t.qual} · <span className="mono">{t.reg}</span></div>
                <div className="t-meta small">
                  <span><Icon name="pin" size={15} /> {t.town} · {Math.round(t.km)} km</span>
                  <span><Icon name="star" size={15} /> {t.rating} ({t.reviews})</span>
                  <span>{t.years} {l('yrs experience', 'miaka ya uzoefu')}</span>
                </div>
              </div>
              <div className="match" title={l('Match score', 'Kiwango cha kulingana')}>
                <span className="match-num">{t.match}<small>%</small></span>
                <span className="match-cap">{l('match', 'inalingana')}</span>
              </div>
            </div>
            <p className="t-bio">{l(t.bio, t.bioSw)}</p>
            <div className="chips">
              {t.specialties.map((s) => {
                const sp = SPECIALTIES.find((x) => x.id === s)
                return <span key={s} className={'chip' + (s === f.spec ? ' hit' : '')}>{l(sp.en, sp.sw)}</span>
              })}
              {t.languages.map((lg) => <span key={lg} className="chip lang-chip">{lg}</span>)}
            </div>
            <div className="t-foot">
              <div className="fees">
                <div><span className="muted small">{l('Session', 'Kipindi')}</span><strong className="mono">{kes(t.fees[f.mode])}</strong></div>
                {f.mode === 'home' && (
                  <div><span className="muted small">{l('Travel', 'Usafiri')}</span><strong className="mono">{t.travel ? kes(t.travel) : l('Free', 'Bure')}</strong></div>
                )}
                <div><span className="muted small">{l('Total', 'Jumla')}</span><strong className="mono total">{kes(t.total)}</strong></div>
              </div>
              <div className="t-actions">
                <span className={'slot ' + (t.available ? 'ok' : 'busy')}>
                  <Icon name="clock" size={15} /> {t.available ? l('Next: ', 'Ijayo: ') + t.next : l('Fully booked until ', 'Amejaa hadi ') + t.next}
                </span>
                <button className="btn primary" onClick={() => setBooking(t)} disabled={!t.available}>{l('Book', 'Panga miadi')}</button>
              </div>
            </div>
            {!t.available && alternativesFor(t).length > 0 && (
              <div className="alts">
                <span className="small muted">{l('Available sooner:', 'Wanapatikana mapema:')}</span>
                {alternativesFor(t).map((a) => (
                  <button key={a.id} className="alt" onClick={() => setBooking(a)}>
                    <span className="avatar sm" aria-hidden="true">{a.initials}</span>
                    {a.name} · {a.next} · <span className="mono">{kes(a.total)}</span>
                  </button>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>

      {booking && (
        <BookModal
          t={booking}
          mode={f.mode}
          onClose={() => setBooking(null)}
          onDone={(b) => {
            update((s) => ({ bookings: [b, ...s.bookings] }))
            setBooking(null)
            showToast(l(`Booked with ${b.name}. SMS confirmation sent.`, `Miadi na ${b.name} imepangwa. Ujumbe wa SMS umetumwa.`))
          }}
        />
      )}
      {toast}
    </div>
  )
}

function BookModal({ t, mode, onClose, onDone }) {
  const { l } = useStore()
  const [slot, setSlot] = useState(t.next)
  const [pay, setPay] = useState('mpesa')
  const [phone, setPhone] = useState('0712 345 678')
  const [stage, setStage] = useState('form')
  const slots = [t.next, 'Wed 28 Oct, 11:00', 'Thu 29 Oct, 15:00', 'Sat 31 Oct, 9:00']
  const deposit = Math.round(t.total * 0.3 / 50) * 50

  const confirm = () => {
    setStage('waiting')
    setTimeout(() => onDone({ id: 'b' + Date.now(), name: t.name, slot, mode, total: t.total }), 1800)
  }

  return (
    <Modal
      title={l('Book a session', 'Panga kipindi')}
      onClose={onClose}
      footer={stage === 'form' ? (
        <>
          <button className="btn ghost" onClick={onClose}>{l('Cancel', 'Ghairi')}</button>
          <button className="btn primary" onClick={confirm}>{pay === 'mpesa' ? l(`Pay ${kes(deposit)} deposit`, `Lipa amana ya ${kes(deposit)}`) : l('Request insurance approval', 'Omba idhini ya bima')}</button>
        </>
      ) : null}
    >
      {stage === 'form' ? (
        <div className="stack">
          <div className="book-who">
            <div className="avatar" aria-hidden="true">{t.initials}</div>
            <div><strong>{t.name}</strong><div className="small muted">{t.qual}</div></div>
          </div>
          <div className="field">
            <span>{l('Choose a time', 'Chagua muda')}</span>
            <div className="slot-grid">
              {slots.map((s) => <button key={s} className={'slot-btn' + (slot === s ? ' on' : '')} onClick={() => setSlot(s)}>{s}</button>)}
            </div>
          </div>
          <table className="sum">
            <tbody>
              <tr><td>{l('Session fee', 'Ada ya kipindi')}</td><td className="mono">{kes(t.fees[mode])}</td></tr>
              {mode === 'home' && <tr><td>{l('Travel', 'Usafiri')} ({Math.round(t.km)} km)</td><td className="mono">{kes(t.travel)}</td></tr>}
              <tr className="total"><td>{l('Total', 'Jumla')}</td><td className="mono">{kes(t.total)}</td></tr>
            </tbody>
          </table>
          <div className="field">
            <span>{l('Pay with', 'Lipa kwa')}</span>
            <div className="seg">
              <button className={pay === 'mpesa' ? 'on' : ''} onClick={() => setPay('mpesa')}>M-Pesa</button>
              <button className={pay === 'ins' ? 'on' : ''} onClick={() => setPay('ins')}>{l('Insurance / SHA', 'Bima / SHA')}</button>
            </div>
          </div>
          {pay === 'mpesa' ? (
            <label className="field">
              <span>{l('M-Pesa number', 'Nambari ya M-Pesa')}</span>
              <input id="book-phone" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <small className="muted">{l('30% deposit now. The rest after the session.', 'Amana ya 30% sasa. Kiasi kilichobaki baada ya kipindi.')}</small>
            </label>
          ) : (
            <p className="note">{l('We send the booking to your insurer for pre-authorisation. You will get an SMS once it is approved.', 'Tutatuma ombi kwa bima yako. Utapata SMS ikiidhinishwa.')}</p>
          )}
        </div>
      ) : (
        <div className="stk">
          <div className="stk-phone"><Icon name="phone" size={34} /></div>
          <strong>{pay === 'mpesa' ? l('Check your phone', 'Angalia simu yako') : l('Sending to insurer…', 'Inatuma kwa bima…')}</strong>
          <p className="muted">{pay === 'mpesa' ? l(`Enter your M-Pesa PIN on ${phone} to pay ${kes(deposit)}.`, `Weka PIN yako ya M-Pesa kwenye ${phone} kulipa ${kes(deposit)}.`) : ''}</p>
          <div className="spinner" aria-hidden="true" />
          <small className="muted">{l('Demo: payment is simulated.', 'Majaribio: malipo ni ya kuigiza.')}</small>
        </div>
      )}
    </Modal>
  )
}

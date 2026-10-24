import { useState } from 'react'
import { useStore } from '../store.jsx'
import Icon from '../Icon.jsx'
import { SPECIALTIES, MODES, PROGRESS, EXERCISES, kes } from '../data.js'
import { PageHead, Tabs, LineChart, useToast } from '../ui.jsx'

export default function ForPhysios() {
  const { l } = useStore()
  const [tab, setTab] = useState('portfolio')
  return (
    <div className="page">
      <PageHead
        eyebrow={l('For physiotherapists', 'Kwa wataalamu wa viungo')}
        title={l('Grow your home practice', 'Kuza huduma yako ya nyumbani')}
        lead={l('Build a portfolio patients can trust, get matched with patients near you, and follow their progress between visits.', 'Jenga wasifu, upate wagonjwa karibu nawe, na ufuatilie maendeleo yao.')}
      />
      <Tabs value={tab} onChange={setTab} tabs={[
        { id: 'portfolio', label: l('Your portfolio', 'Wasifu wako') },
        { id: 'reports', label: l('Patient reports', 'Ripoti za wagonjwa') },
      ]} />
      {tab === 'portfolio' ? <Portfolio /> : <Reports />}
    </div>
  )
}

function Portfolio() {
  const { l } = useStore()
  const [toast, showToast] = useToast()
  const [p, setP] = useState({
    name: 'Mercy Njeri', reg: 'PCK/2018/0934', qual: 'BSc Physiotherapy (KMTC)', years: 7, town: 'Nakuru',
    specialties: ['knee', 'elderly'], modes: ['home', 'video'], home: 3000, video: 1300, radius: 25,
    bio: 'Joint replacement aftercare and falls prevention for older adults.',
  })
  const set = (k, v) => setP((x) => ({ ...x, [k]: v }))
  const tog = (k, id) => set(k, p[k].includes(id) ? p[k].filter((x) => x !== id) : [...p[k], id])

  return (
    <section className="tab-panel portfolio-layout">
      <form className="card stack" onSubmit={(e) => { e.preventDefault(); showToast(l('Submitted. We check your PCK registration within 2 working days.', 'Imetumwa. Tutakagua usajili wako ndani ya siku 2 za kazi.')) }}>
        <div className="two">
          <label className="field"><span>{l('Full name', 'Jina kamili')}</span><input id="pf-name" value={p.name} onChange={(e) => set('name', e.target.value)} /></label>
          <label className="field"><span>{l('PCK registration no.', 'Nambari ya usajili wa PCK')}</span><input id="pf-reg" className="mono" value={p.reg} onChange={(e) => set('reg', e.target.value)} /></label>
        </div>
        <div className="two">
          <label className="field"><span>{l('Qualification', 'Elimu')}</span><input id="pf-qual" value={p.qual} onChange={(e) => set('qual', e.target.value)} /></label>
          <label className="field"><span>{l('Years of experience', 'Miaka ya uzoefu')}</span><input id="pf-years" type="number" min="0" value={p.years} onChange={(e) => set('years', +e.target.value)} /></label>
        </div>
        <fieldset className="field"><legend>{l('Areas of expertise', 'Maeneo ya utaalamu')}</legend>
          <div className="chips">{SPECIALTIES.map((s) => (
            <button type="button" key={s.id} className={'chip' + (p.specialties.includes(s.id) ? ' hit' : '')} onClick={() => tog('specialties', s.id)} aria-pressed={p.specialties.includes(s.id)}>{l(s.en, s.sw)}</button>
          ))}</div>
        </fieldset>
        <fieldset className="field"><legend>{l('How you see patients', 'Jinsi unavyoona wagonjwa')}</legend>
          <div className="chips">{MODES.map((m) => (
            <button type="button" key={m.id} className={'chip' + (p.modes.includes(m.id) ? ' hit' : '')} onClick={() => tog('modes', m.id)} aria-pressed={p.modes.includes(m.id)}>{l(m.en, m.sw)}</button>
          ))}</div>
        </fieldset>
        <div className="two">
          <label className="field"><span>{l('Home visit fee (KES)', 'Ada ya ziara (KES)')}</span><input id="pf-home" type="number" step="100" value={p.home} onChange={(e) => set('home', +e.target.value)} /></label>
          <label className="field"><span>{l('Travel radius', 'Umbali wa kusafiri')} <b className="mono">{p.radius} km</b></span><input id="pf-radius" type="range" min="5" max="100" step="5" value={p.radius} onChange={(e) => set('radius', +e.target.value)} /></label>
        </div>
        <label className="field"><span>{l('About you', 'Kuhusu wewe')}</span><textarea id="pf-bio" rows="3" value={p.bio} onChange={(e) => set('bio', e.target.value)} /></label>
        <label className="field"><span>{l('Upload certificates (PCK licence, degree)', 'Pakia vyeti')}</span><input id="pf-docs" type="file" multiple accept="image/*,.pdf" /></label>
        <button className="btn primary" type="submit">{l('Submit for verification', 'Tuma kwa uthibitisho')}</button>
      </form>

      <aside className="preview">
        <div className="eyebrow">{l('How patients see you', 'Jinsi wagonjwa wanavyokuona')}</div>
        <article className="therapist card">
          <div className="t-top">
            <div className="avatar" aria-hidden="true">{p.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</div>
            <div className="t-id">
              <h3>{p.name || '—'} <span className="pill warn">{l('Pending check', 'Inasubiri ukaguzi')}</span></h3>
              <div className="muted small">{p.qual} · <span className="mono">{p.reg}</span></div>
              <div className="t-meta small"><span><Icon name="pin" size={15} /> {p.town} · {l('up to', 'hadi')} {p.radius} km</span><span>{p.years} {l('yrs experience', 'miaka ya uzoefu')}</span></div>
            </div>
          </div>
          <p className="t-bio">{p.bio}</p>
          <div className="chips">{p.specialties.map((s) => { const sp = SPECIALTIES.find((x) => x.id === s); return <span key={s} className="chip hit">{l(sp.en, sp.sw)}</span> })}</div>
          <div className="fees"><div><span className="muted small">{l('Home visit', 'Ziara')}</span><strong className="mono">{kes(p.home)}</strong></div></div>
        </article>
        <ul className="small muted perks">
          <li><Icon name="check" size={15} /> {l('Patients matched by your expertise and travel radius', 'Wagonjwa wanalinganishwa kwa utaalamu wako')}</li>
          <li><Icon name="check" size={15} /> {l('Payment by M-Pesa after each session', 'Malipo kwa M-Pesa baada ya kila kipindi')}</li>
          <li><Icon name="check" size={15} /> {l('Weekly progress reports between visits', 'Ripoti za maendeleo kila wiki')}</li>
        </ul>
      </aside>
      {toast}
    </section>
  )
}

function Reports() {
  const { state, l } = useStore()
  const adherence = 86
  const latest = state.feedback.slice(0, 3)
  return (
    <section className="tab-panel">
      <div className="card report">
        <div className="report-head">
          <div className="avatar" aria-hidden="true">GA</div>
          <div className="grow">
            <strong>Grace Achieng · 58</strong>
            <div className="small muted">{l('Left TKR · week 8 · next visit Tue 27 Oct', 'Upasuaji wa goti · wiki ya 8')}</div>
          </div>
          <span className="pill ok">{l('On track', 'Inaendelea vizuri')}</span>
        </div>
        <dl className="kpis">
          <div><dt>{l('Exercise adherence (7 days)', 'Ufuasi wa mazoezi')}</dt><dd>{adherence}%</dd></div>
          <div><dt>{l('Flexion', 'Kukunja')}</dt><dd>{PROGRESS.flexion.at(-1)}°</dd></div>
          <div><dt>{l('Pain (stairs)', 'Maumivu')}</dt><dd>{PROGRESS.pain.at(-1)}/10</dd></div>
          <div><dt>LEFS</dt><dd>{PROGRESS.lefs.at(-1)}/80</dd></div>
        </dl>
        <LineChart labels={PROGRESS.weeks} series={[{ label: 'Flexion', values: PROGRESS.flexion, cls: 's-primary' }]} min={60} max={130} unit="°" ticks={[60, 90, 110, 130]} height={150} />
        <h3 className="card-title">{l('Patient feedback this week', 'Maoni ya mgonjwa wiki hii')}</h3>
        {latest.length ? (
          <ul className="fb-list">{latest.map((f) => <li key={f.id}><span className={'pain-dot p' + f.pain}>{f.pain}</span><div><strong>{f.name}</strong> · {f.difficulty}{f.note && <div className="small muted">“{f.note}”</div>}</div></li>)}</ul>
        ) : (
          <ul className="fb-list">
            <li><span className="pain-dot p3">3</span><div><strong>{EXERCISES[3].name}</strong> · OK<div className="small muted">“Band slips off the chair leg”</div></div></li>
            <li><span className="pain-dot p5">5</span><div><strong>{EXERCISES[4].name}</strong> · Hard</div></li>
          </ul>
        )}
      </div>
    </section>
  )
}

import { useState } from 'react'
import { useStore } from '../store.jsx'
import Icon from '../Icon.jsx'
import { EXERCISES, TUTORIALS, BANDS } from '../data.js'
import { PageHead, Modal, useToast } from '../ui.jsx'
import { fmtWhen } from '../App.jsx'

export default function Coach() {
  const { state, update, l } = useStore()
  const [playing, setPlaying] = useState(null)
  const [feedbackFor, setFeedbackFor] = useState(null)
  const [toast, showToast] = useToast()
  const done = EXERCISES.filter((e) => state.done[e.id]).length

  const toggleDone = (e) => {
    const was = state.done[e.id]
    update((s) => ({ done: { ...s.done, [e.id]: !was } }))
    if (!was) setFeedbackFor(e)
  }

  const saveOffline = () => {
    const now = new Date()
    const exp = new Date(now); exp.setDate(exp.getDate() + 7)
    update(() => ({ offline: { savedAt: now.toISOString(), expiresAt: exp.toISOString() } }))
    showToast(l('Saved on this phone for 7 days', 'Imehifadhiwa kwenye simu hii kwa siku 7'))
  }

  const totalMb = EXERCISES.reduce((a, e) => a + +e.mb, 0).toFixed(1)

  return (
    <div className="page">
      <PageHead
        eyebrow={l('Personalised home exercise coach', 'Kocha wa mazoezi ya nyumbani')}
        title={l("Today's exercises", 'Mazoezi ya leo')}
        lead={l('Approved by Brian Otieno on 20 Oct 2026. Do them three times a day unless your physiotherapist says otherwise. Stop and report if pain goes above 6 out of 10.', 'Yameidhinishwa na Brian Otieno tarehe 20 Okt 2026. Fanya mara tatu kwa siku. Acha na uripoti maumivu yakizidi 6 kati ya 10.')}
      />

      <div className="coach-top">
        <div className="card progress-ring-card">
          <Ring value={done} max={EXERCISES.length} />
          <div>
            <strong>{done} {l('of', 'kati ya')} {EXERCISES.length} {l('done this session', 'yamekamilika')}</strong>
            <div className="small muted">{l('Morning session · next reminder 13:00', 'Kipindi cha asubuhi · kikumbusho kijacho 7:00 mchana')}</div>
          </div>
        </div>
        <div className="card offline-card">
          <div className="row-gap">
            <Icon name="download" />
            <div className="grow">
              <strong>{l('Use without data', 'Tumia bila data')}</strong>
              {state.offline
                ? <div className="small muted">{l('Saved', 'Imehifadhiwa')} · {l('deletes itself on', 'itajifuta')} {fmtWhen(state.offline.expiresAt, state.lang)} · {l('PIN protected', 'Inalindwa na PIN')}</div>
                : <div className="small muted">{l(`Save these ${EXERCISES.length} videos and instructions (${totalMb} MB) on this phone.`, `Hifadhi video ${EXERCISES.length} na maelekezo (${totalMb} MB) kwenye simu hii.`)}</div>}
            </div>
          </div>
          {state.offline
            ? <button className="btn sm ghost" onClick={() => update(() => ({ offline: null }))}>{l('Remove from phone', 'Ondoa kwenye simu')}</button>
            : <button className="btn sm" onClick={saveOffline}>{l('Save for offline', 'Hifadhi')}</button>}
        </div>
      </div>

      <ul className="exercise-list">
        {EXERCISES.map((e, i) => (
          <li key={e.id} className={'exercise card' + (state.done[e.id] ? ' done' : '')}>
            <button className="ex-video" onClick={() => setPlaying(e)} aria-label={l('Play demonstration', 'Cheza maonyesho') + ': ' + e.name}>
              <ExerciseFigure kind={e.id} />
              <span className="ex-play"><Icon name="play" size={18} /></span>
              <span className="ex-len mono">{e.length}</span>
            </button>
            <div className="ex-body">
              <div className="ex-title">
                <span className="ex-n mono">{i + 1}</span>
                <h3>{l(e.name, e.nameSw)}</h3>
                {e.band && <span className={'band-tag band-' + e.band}>{l('Yellow band', 'Bendi ya njano')}</span>}
              </div>
              <div className="dose mono">
                <span>{e.sets} × {e.reps}</span>
                {e.hold > 0 && <span>{l('hold', 'shikilia')} {e.hold}s</span>}
              </div>
              <p>{l(e.cue, e.cueSw)}</p>
            </div>
            <button className={'done-btn' + (state.done[e.id] ? ' on' : '')} onClick={() => toggleDone(e)} aria-pressed={!!state.done[e.id]}>
              <Icon name="check" /> <span>{state.done[e.id] ? l('Done', 'Imekamilika') : l('Mark done', 'Weka imekamilika')}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="coach-grid">
        <Reminders toast={showToast} />
        <div className="card">
          <h2 className="card-title">{l('Sent to your physiotherapist', 'Zilizotumwa kwa mtaalamu wako')}</h2>
          {state.feedback.length === 0
            ? <p className="muted small">{l('After each exercise, tell us how it felt. Brian sees a weekly report before your next visit.', 'Baada ya kila zoezi, tuambie lilivyokuwa. Brian ataona ripoti ya wiki.')}</p>
            : (
              <ul className="fb-list">
                {state.feedback.slice(0, 5).map((f) => (
                  <li key={f.id}>
                    <span className={'pain-dot p' + Math.min(10, f.pain)}>{f.pain}</span>
                    <div><strong>{f.name}</strong> · {f.difficulty}{f.note && <div className="small muted">“{f.note}”</div>}</div>
                    <time className="small muted mono">{fmtWhen(f.at, state.lang)}</time>
                  </li>
                ))}
              </ul>
            )}
        </div>
      </div>

      <section className="section">
        <h2 className="section-title">{l('Equipment tutorials', 'Mafunzo ya vifaa')}</h2>
        <div className="band-guide card">
          <strong>{l('Resistance bands get harder by colour', 'Bendi huwa ngumu zaidi kwa rangi')}</strong>
          <div className="band-row">
            {BANDS.map((b) => (
              <div key={b.color} className="band-swatch">
                <span className={'band-bar band-' + b.color} />
                <span className="small">{l(b.en, b.sw)}</span>
                <span className="small muted mono">≈ {b.kg} {l('at full stretch', 'ikivutwa')}</span>
              </div>
            ))}
          </div>
          <p className="small muted">{l('Move up one colour only when your physiotherapist says so. Strength figures vary by brand.', 'Panda rangi moja tu mtaalamu akikuambia.')}</p>
        </div>
        <div className="tut-grid">
          {TUTORIALS.map((t) => (
            <button key={t.id} className="tut card" onClick={() => setPlaying({ name: t.title, nameSw: t.titleSw, length: t.length, id: t.kind })}>
              <span className="tut-ico"><Icon name="play" /></span>
              <span><strong>{l(t.title, t.titleSw)}</strong><span className="small muted block mono">{t.length}</span></span>
            </button>
          ))}
        </div>
      </section>

      {playing && (
        <Modal title={l(playing.name, playing.nameSw)} onClose={() => setPlaying(null)}>
          <div className="player">
            <ExerciseFigure kind={playing.id} big />
            <div className="player-bar"><span /></div>
          </div>
          <p className="small muted">{l('Prototype: your physiotherapist uploads a short clip here. Kiswahili captions are reviewed by a clinician before release.', 'Mfano: mtaalamu wako atapakia video fupi hapa. Maelezo ya Kiswahili hukaguliwa na mtaalamu.')}</p>
        </Modal>
      )}
      {feedbackFor && <FeedbackModal ex={feedbackFor} onClose={() => setFeedbackFor(null)} onSent={() => { setFeedbackFor(null); showToast(l('Sent to Brian Otieno', 'Imetumwa kwa Brian Otieno')) }} />}
      {toast}
    </div>
  )
}

function Ring({ value, max }) {
  const c = 2 * Math.PI * 26
  return (
    <svg viewBox="0 0 64 64" className="ring" aria-hidden="true">
      <circle cx="32" cy="32" r="26" className="ring-track" />
      <circle cx="32" cy="32" r="26" className="ring-fill" style={{ strokeDasharray: `${(value / max) * c} ${c}` }} />
      <text x="32" y="37" textAnchor="middle" className="ring-text">{value}/{max}</text>
    </svg>
  )
}

// Simple line-figure illustrations standing in for demo videos
function ExerciseFigure({ kind, big }) {
  const cls = 'fig' + (big ? ' big' : '')
  if (kind === 'e5') return (
    <svg viewBox="0 0 120 80" className={cls} aria-hidden="true">
      <path d="M20 70h80" className="floor" />
      <path d="M30 70V48h22v22M30 48V30" className="prop" />
      <g className="move-stand"><circle cx="58" cy="20" r="6" /><path d="M58 26v20l-8 10v14M58 46l10 10v14M58 32l12 8" /></g>
    </svg>
  )
  if (kind === 'e4') return (
    <svg viewBox="0 0 120 80" className={cls} aria-hidden="true">
      <path d="M20 70h80" className="floor" />
      <path d="M36 70V46h26v24M36 46V22" className="prop" />
      <circle cx="46" cy="16" r="6" /><path d="M46 22v24h16" />
      <g className="move-ext"><path d="M62 46l14 22" /><path d="M76 68l-10 2" className="band-line" /></g>
    </svg>
  )
  return (
    <svg viewBox="0 0 120 80" className={cls} aria-hidden="true">
      <path d="M10 62h100" className="prop" />
      <circle cx="22" cy="52" r="6" /><path d="M28 54h32" />
      <path d="M60 54l20 0" className="still-leg" />
      <g className={kind === 'e1' ? 'move-slide' : 'move-raise'}><path d="M60 54l20 -2l20 2" /></g>
    </svg>
  )
}

function FeedbackModal({ ex, onClose, onSent }) {
  const { update, l } = useStore()
  const [pain, setPain] = useState(3)
  const [difficulty, setDifficulty] = useState('OK')
  const [note, setNote] = useState('')
  const send = () => {
    update((s) => ({ feedback: [{ id: 'f' + Date.now(), at: new Date().toISOString(), name: ex.name, pain, difficulty, note }, ...s.feedback] }))
    onSent()
  }
  return (
    <Modal title={l('How did it feel?', 'Ulijisikiaje?')} onClose={onClose} footer={
      <>
        <button className="btn ghost" onClick={onClose}>{l('Skip', 'Ruka')}</button>
        <button className="btn primary" onClick={send}>{l('Send to physiotherapist', 'Tuma kwa mtaalamu')}</button>
      </>
    }>
      <div className="stack">
        <strong>{l(ex.name, ex.nameSw)}</strong>
        <label className="field">
          <span>{l('Pain during the exercise', 'Maumivu wakati wa zoezi')}: <b className="mono">{pain}/10</b></span>
          <input id="fb-pain" type="range" min="0" max="10" value={pain} onChange={(e) => setPain(+e.target.value)} className={'pain-range p' + pain} />
          <div className="scale-labels small muted"><span>{l('None', 'Hakuna')}</span><span>{l('Worst', 'Makali zaidi')}</span></div>
        </label>
        {pain > 6 && <p className="note warn-note"><Icon name="alert" size={16} /> {l('Stop this exercise for today. We will alert Brian now.', 'Acha zoezi hili leo. Tutamjulisha Brian sasa.')}</p>}
        <div className="field">
          <span>{l('Difficulty', 'Ugumu')}</span>
          <div className="seg">
            {[['Easy', 'Rahisi'], ['OK', 'Sawa'], ['Hard', 'Ngumu'], ["Couldn't finish", 'Sikumaliza']].map(([en, sw]) => (
              <button key={en} className={difficulty === en ? 'on' : ''} onClick={() => setDifficulty(en)}>{l(en, sw)}</button>
            ))}
          </div>
        </div>
        <label className="field"><span>{l('Anything else? (optional)', 'Lingine? (si lazima)')}</span>
          <textarea id="fb-note" rows="2" value={note} onChange={(e) => setNote(e.target.value)} placeholder={l('e.g. knee felt stiff in the morning', 'mf. goti lilikuwa gumu asubuhi')} />
        </label>
      </div>
    </Modal>
  )
}

function Reminders({ toast }) {
  const { state, update, l } = useStore()
  const r = state.reminders
  const setTime = (i, v) => update((s) => ({ reminders: { ...s.reminders, times: s.reminders.times.map((t, j) => (j === i ? v : t)) } }))
  return (
    <div className="card">
      <h2 className="card-title">{l('Reminders', 'Vikumbusho')}</h2>
      <div className="times">
        {r.times.map((t, i) => (
          <input key={i} id={'rem-' + i} type="time" value={t} onChange={(e) => setTime(i, e.target.value)} aria-label={l('Reminder time', 'Muda wa kikumbusho') + ' ' + (i + 1)} />
        ))}
      </div>
      <label className="check toggle-row">
        <input id="rem-sms" type="checkbox" checked={r.sms} onChange={(e) => update((s) => ({ reminders: { ...s.reminders, sms: e.target.checked } }))} />
        <span>{l('Also send by SMS', 'Tuma pia kwa SMS')}<small className="block muted">{l('Works on any phone, no data needed', 'Inafanya kazi kwenye simu yoyote, bila data')}</small></span>
      </label>
      <div className="sms-preview">
        <Icon name="sms" size={16} />
        <span>{l('TibaNyumbani: Time for your knee exercises (5). Reply 1 when done, 2 if pain is worse.', 'TibaNyumbani: Ni wakati wa mazoezi ya goti (5). Jibu 1 ukimaliza, 2 maumivu yakizidi.')}</span>
      </div>
      <button className="btn sm ghost" onClick={() => toast(l('Reminder times saved', 'Muda wa vikumbusho umehifadhiwa'))}>{l('Save times', 'Hifadhi')}</button>
    </div>
  )
}

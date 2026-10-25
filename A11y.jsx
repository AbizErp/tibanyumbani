import { useEffect, useRef, useState } from 'react'
import { useStore } from './store.jsx'
import Icon from './Icon.jsx'

// Accessibility tools: read aloud (text to speech), voice typing and voice
// commands (speech to text), text size, contrast, readable font, spacing.
// Uses the browser's built-in Web Speech API — no data leaves the device
// except through the browser's own speech service.

const synth = typeof window !== 'undefined' ? window.speechSynthesis : null
const Recognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null

const COMMANDS = [
  { words: ['home', 'mwanzo', 'nyumbani'], route: 'home' },
  { words: ['find', 'physiotherapist', 'tafuta', 'mtaalamu'], route: 'find' },
  { words: ['passport', 'records', 'pasipoti', 'rekodi'], route: 'passport' },
  { words: ['exercise', 'exercises', 'mazoezi', 'coach'], route: 'coach' },
  { words: ['family', 'caregiver', 'familia', 'mlezi'], route: 'family' },
  { words: ['payment', 'payments', 'package', 'malipo', 'mpesa'], route: 'payments' },
  { words: ['equipment', 'partners', 'vifaa'], route: 'partners' },
]

export default function A11y({ go }) {
  const { state, update, l } = useStore()
  const a = state.a11y
  const [open, setOpen] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  const [listening, setListening] = useState(null) // 'type' | 'command' | null
  const [heard, setHeard] = useState('')
  const lastField = useRef(null)
  const rec = useRef(null)
  const voiceLang = state.lang === 'sw' ? 'sw-KE' : 'en-KE'

  const set = (k, v) => update((s) => ({ a11y: { ...s.a11y, [k]: v } }))

  // apply display settings to the page
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--fs', [14, 16, 18, 20][a.size] + 'px')
    root.classList.toggle('hc', a.contrast)
    root.classList.toggle('readable', a.readable)
    root.classList.toggle('spaced', a.spacing)
    root.classList.toggle('hl-links', a.links)
    root.classList.toggle('click-read', a.clickRead)
  }, [a])

  // remember the last text box the person used, for voice typing
  useEffect(() => {
    const onFocus = (e) => {
      if (e.target.matches('input:not([type=checkbox]):not([type=range]):not([type=file]), textarea')) lastField.current = e.target
    }
    document.addEventListener('focusin', onFocus)
    return () => document.removeEventListener('focusin', onFocus)
  }, [])

  const speak = (text) => {
    if (!synth || !text) return
    synth.cancel()
    // split long text so the browser does not cut it off
    const parts = text.replace(/\s+/g, ' ').match(/[^.!?]+[.!?]*/g) || [text]
    parts.forEach((p, i) => {
      const u = new SpeechSynthesisUtterance(p.trim())
      u.lang = voiceLang
      u.rate = a.rate
      const v = synth.getVoices().find((x) => x.lang?.toLowerCase().startsWith(state.lang === 'sw' ? 'sw' : 'en'))
      if (v) u.voice = v
      if (i === 0) u.onstart = () => { setSpeaking(true); setPaused(false) }
      if (i === parts.length - 1) u.onend = () => { setSpeaking(false); setPaused(false) }
      synth.speak(u)
    })
  }
  const stop = () => { synth?.cancel(); setSpeaking(false); setPaused(false) }
  const pauseResume = () => {
    if (!synth) return
    if (paused) { synth.resume(); setPaused(false) } else { synth.pause(); setPaused(true) }
  }
  const readPage = () => {
    const main = document.getElementById('main')
    speak(main ? main.innerText : '')
  }
  const readSelection = () => {
    const t = window.getSelection()?.toString()
    speak(t || l('Select some text on the page first.', 'Chagua maandishi kwanza.'))
  }

  // click-to-read: tap any text to hear it
  useEffect(() => {
    if (!a.clickRead) return
    const onClick = (e) => {
      if (e.target.closest('.a11y-panel, .a11y-fab')) return
      const el = e.target.closest('p, h1, h2, h3, h4, li, td, th, label, button, strong, .lead, span')
      if (el) speak(el.innerText)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  })

  // stop speaking when the language changes or the panel unmounts
  useEffect(() => () => synth?.cancel(), [])

  const listen = (mode) => {
    if (!Recognition) return
    if (listening) { rec.current?.stop(); return }
    const r = new Recognition()
    r.lang = voiceLang
    r.interimResults = false
    r.maxAlternatives = 1
    r.onresult = (e) => {
      const text = e.results[0][0].transcript
      setHeard(text)
      if (mode === 'type') {
        const f = lastField.current
        if (f) {
          const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(f), 'value').set
          setter.call(f, (f.value ? f.value + ' ' : '') + text)
          f.dispatchEvent(new Event('input', { bubbles: true }))
          f.focus()
        }
      } else {
        const t = text.toLowerCase()
        if (/(stop|acha|nyamaza)/.test(t)) return stop()
        if (/(read|soma)/.test(t)) return readPage()
        const hit = COMMANDS.find((c) => c.words.some((w) => t.includes(w)))
        if (hit) { go(hit.route); setTimeout(() => speak(document.querySelector('#main h1')?.innerText || ''), 400) }
      }
    }
    r.onerror = () => setListening(null)
    r.onend = () => setListening(null)
    rec.current = r
    setHeard('')
    setListening(mode)
    try { r.start() } catch { setListening(null) }
  }

  const reset = () => update(() => ({ a11y: { size: 1, contrast: false, readable: false, spacing: false, links: false, rate: 1, clickRead: false } }))

  const Toggle = ({ k, label, hint }) => (
    <label className="a11y-toggle">
      <span><strong>{label}</strong>{hint && <small>{hint}</small>}</span>
      <input type="checkbox" role="switch" checked={!!a[k]} onChange={(e) => set(k, e.target.checked)} />
      <i aria-hidden="true" />
    </label>
  )

  return (
    <>
      <button className="a11y-fab" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={l('Accessibility options', 'Chaguo za ufikivu')}>
        <Icon name="access" size={28} />
      </button>

      {speaking && !open && (
        <div className="a11y-mini" role="status">
          <Icon name="volume" size={18} /> {l('Reading aloud', 'Inasoma kwa sauti')}
          <button onClick={pauseResume} aria-label={paused ? 'Resume' : 'Pause'}><Icon name={paused ? 'play' : 'pause'} size={16} /></button>
          <button onClick={stop} aria-label="Stop"><Icon name="stop" size={16} /></button>
        </div>
      )}

      {open && (
        <div className="a11y-panel" role="dialog" aria-label={l('Accessibility options', 'Chaguo za ufikivu')}>
          <div className="a11y-head">
            <strong><Icon name="access" /> {l('Accessibility', 'Ufikivu')}</strong>
            <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close"><Icon name="x" /></button>
          </div>

          <div className="a11y-body">
            <section>
              <h3><Icon name="volume" size={18} /> {l('Text to speech', 'Maandishi kwa sauti')}</h3>
              {synth ? (
                <>
                  <div className="a11y-row">
                    <button className="btn sm primary" onClick={readPage}><Icon name="play" size={16} /> {l('Read this page', 'Soma ukurasa huu')}</button>
                    <button className="btn sm ghost" onClick={readSelection}>{l('Read selected text', 'Soma nilichochagua')}</button>
                    {speaking && (
                      <>
                        <button className="btn sm ghost" onClick={pauseResume}><Icon name={paused ? 'play' : 'pause'} size={16} /> {paused ? l('Resume', 'Endelea') : l('Pause', 'Simamisha')}</button>
                        <button className="btn sm ghost" onClick={stop}><Icon name="stop" size={16} /> {l('Stop', 'Acha')}</button>
                      </>
                    )}
                  </div>
                  <Toggle k="clickRead" label={l('Tap to read', 'Gusa ili kusoma')} hint={l('Tap any text to hear it', 'Gusa maandishi yoyote kuyasikia')} />
                  <label className="field">
                    <span>{l('Reading speed', 'Kasi ya kusoma')} <b className="mono">{a.rate.toFixed(1)}×</b></span>
                    <input id="a11y-rate" type="range" min="0.6" max="1.6" step="0.1" value={a.rate} onChange={(e) => set('rate', +e.target.value)} />
                  </label>
                </>
              ) : <p className="small muted">{l('Your browser does not support reading aloud.', 'Kivinjari chako hakiwezi kusoma kwa sauti.')}</p>}
            </section>

            <section>
              <h3><Icon name="mic" size={18} /> {l('Speech to text', 'Sauti kwa maandishi')}</h3>
              {Recognition ? (
                <>
                  <div className="a11y-row">
                    <button className={'btn sm ' + (listening === 'type' ? 'danger' : 'primary')} onClick={() => listen('type')}>
                      <Icon name="mic" size={16} /> {listening === 'type' ? l('Listening… tap to stop', 'Inasikiliza…') : l('Voice typing', 'Andika kwa sauti')}
                    </button>
                    <button className={'btn sm ' + (listening === 'command' ? 'danger' : 'ghost')} onClick={() => listen('command')}>
                      <Icon name="mic" size={16} /> {listening === 'command' ? l('Listening…', 'Inasikiliza…') : l('Voice command', 'Amri ya sauti')}
                    </button>
                  </div>
                  <p className="small muted">{l(
                    'Voice typing: tap a text box first, then speak. Voice command: say “exercises”, “find physiotherapist”, “payments”, “read page” or “stop”.',
                    'Andika kwa sauti: gusa kisanduku kwanza, kisha ongea. Amri: sema “mazoezi”, “tafuta mtaalamu”, “malipo”, “soma” au “acha”.'
                  )}</p>
                  {heard && <p className="a11y-heard">“{heard}”</p>}
                </>
              ) : <p className="small muted">{l('Voice input works in Chrome, Edge and Safari. It needs microphone permission.', 'Sauti inafanya kazi kwenye Chrome, Edge na Safari.')}</p>}
            </section>

            <section>
              <h3>{l('Display', 'Mwonekano')}</h3>
              <div className="field">
                <span>{l('Text size', 'Ukubwa wa maandishi')}</span>
                <div className="seg size-seg" role="radiogroup">
                  {['A−', 'A', 'A+', 'A++'].map((t, i) => (
                    <button key={t} role="radio" aria-checked={a.size === i} className={a.size === i ? 'on' : ''} onClick={() => set('size', i)} style={{ fontSize: 12 + i * 2 }}>{t}</button>
                  ))}
                </div>
              </div>
              <Toggle k="contrast" label={l('High contrast', 'Utofautishaji wa juu')} />
              <Toggle k="readable" label={l('Easy-read font', 'Herufi rahisi kusoma')} hint={l('Wider letters, helps with dyslexia', 'Husaidia wenye dyslexia')} />
              <Toggle k="spacing" label={l('More spacing', 'Nafasi zaidi')} />
              <Toggle k="links" label={l('Highlight buttons and links', 'Angazia vitufe na viungo')} />
              <label className="a11y-toggle">
                <span><strong>{l('Reduce motion and data', 'Punguza mwendo na data')}</strong></span>
                <input type="checkbox" role="switch" checked={state.lite} onChange={(e) => update(() => ({ lite: e.target.checked }))} />
                <i aria-hidden="true" />
              </label>
            </section>
          </div>

          <div className="a11y-foot">
            <button className="link" onClick={reset}>{l('Reset to default', 'Rudisha kawaida')}</button>
          </div>
        </div>
      )}
    </>
  )
}

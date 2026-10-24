import { useStore } from '../store.jsx'
import Icon from '../Icon.jsx'
import { PATIENT, PROGRESS, EXERCISES } from '../data.js'
import { Meter } from '../ui.jsx'

export default function Home({ go }) {
  const { state, l } = useStore()
  const doneCount = EXERCISES.filter((e) => state.done[e.id]).length
  const flex = PROGRESS.flexion.at(-1)

  const features = [
    { id: 'find', icon: 'search', en: ['Find a physiotherapist', 'Matched by condition, location and how you want to be seen. Travel charges shown before you book.'], sw: ['Tafuta mtaalamu wa viungo', 'Unalinganishwa kwa hali yako, mahali, na jinsi unavyotaka kuonwa.'] },
    { id: 'passport', icon: 'folder', en: ['Rehab passport', 'Your X-rays, MRI reports, referrals and notes in one vault. You decide who sees what, and for how long.'], sw: ['Pasipoti ya matibabu', 'X-ray, MRI, rufaa na maelezo yako mahali pamoja. Wewe ndiye unaamua nani aone.'] },
    { id: 'coach', icon: 'activity', en: ['Exercise coach', 'Exercises approved by your physiotherapist, with short videos, reminders and a way to report pain.'], sw: ['Kocha wa mazoezi', 'Mazoezi yaliyoidhinishwa na mtaalamu wako, video fupi na vikumbusho.'] },
    { id: 'family', icon: 'users', en: ['Family & caregivers', 'Let a son, daughter or carer handle appointments and reminders, with limits you set.'], sw: ['Familia na walezi', 'Ruhusu mtoto au mlezi kusimamia miadi na vikumbusho, kwa mipaka unayoweka.'] },
    { id: 'payments', icon: 'wallet', en: ['Packages & payment', 'Pay per session or for a full package with M-Pesa or insurance, and see sessions left.'], sw: ['Vifurushi na malipo', 'Lipa kwa M-Pesa au bima, na uone vipindi vilivyobaki.'] },
    { id: 'partners', icon: 'store', en: ['Equipment & centres', 'Where to buy bands and braces nearby, and rehab centres if you prefer not to be seen at home.'], sw: ['Vifaa na vituo', 'Mahali pa kununua bendi na vifaa, na vituo vya urekebishaji.'] },
  ]

  const steps = [
    l(['Book', 'Pick a verified physiotherapist and a time. Pay a deposit by M-Pesa or confirm your insurance cover.'], ['Panga miadi', 'Chagua mtaalamu aliyethibitishwa na muda. Lipa kwa M-Pesa au thibitisha bima.']),
    l(['Assessment at home', 'Your physiotherapist checks movement, strength, pain and how safe your home is to move around in.'], ['Tathmini nyumbani', 'Mtaalamu anakagua mwendo, nguvu, maumivu na usalama wa nyumba yako.']),
    l(['Your plan', 'You get exercises in the app, with videos you can save for times without data.'], ['Mpango wako', 'Unapata mazoezi kwenye programu, na video unazoweza kuhifadhi.']),
    l(['Review and adjust', 'Your pain and progress reports reach the therapist between visits, so the plan changes when you do.'], ['Kagua na rekebisha', 'Ripoti zako za maumivu na maendeleo zinamfikia mtaalamu kati ya ziara.']),
  ]

  return (
    <div className="page home">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">{l('Home physiotherapy across Kenya', 'Tiba ya viungo nyumbani kote Kenya')}</div>
          <h1 className="display">{l('Physiotherapy that comes to your door.', 'Tiba ya viungo hadi mlangoni kwako.')}</h1>
          <p className="lead">{l(
            'Recover from surgery, stroke or injury at home. Verified physiotherapists, your records in your control, and a coach for the days between visits.',
            'Pona kutokana na upasuaji, kiharusi au jeraha ukiwa nyumbani. Wataalamu waliothibitishwa, rekodi zako chini ya udhibiti wako, na kocha kwa siku kati ya ziara.'
          )}</p>
          <div className="hero-cta">
            <button className="btn primary lg" onClick={() => go('find')}><Icon name="search" /> {l('Find a physiotherapist', 'Tafuta mtaalamu')}</button>
            <button className="btn ghost lg" onClick={() => go('passport')}>{l('Open my passport', 'Fungua pasipoti yangu')}</button>
          </div>
          <ul className="hero-points">
            <li><Icon name="badge" size={18} /> {l('Registration checked with PCK', 'Usajili umethibitishwa na PCK')}</li>
            <li><Icon name="sms" size={18} /> {l('SMS reminders, works on low data', 'Vikumbusho vya SMS, hutumia data kidogo')}</li>
            <li><Icon name="wallet" size={18} /> {l('M-Pesa and insurance', 'M-Pesa na bima')}</li>
          </ul>
        </div>

        <aside className="today card" aria-label={l('Your recovery today', 'Urejesho wako leo')}>
          <div className="today-head">
            <div>
              <div className="eyebrow">{l('Sample patient', 'Mgonjwa wa sampuli')}</div>
              <strong>{PATIENT.name}</strong>
              <div className="muted small">{l(PATIENT.condition, PATIENT.conditionSw)} · {l('week 8', 'wiki ya 8')}</div>
            </div>
            <div className="dial" aria-label={l(`Knee bends to ${flex} degrees`, `Goti linakunjika nyuzi ${flex}`)}>
              <svg viewBox="0 0 120 70" aria-hidden="true">
                <path d="M10 62 A50 50 0 0 1 110 62" className="dial-track" />
                <path d="M10 62 A50 50 0 0 1 110 62" className="dial-fill" style={{ strokeDasharray: `${(flex / 135) * 157} 157` }} />
              </svg>
              <div className="dial-num">{flex}°</div>
              <div className="dial-cap">{l('knee bend', 'kukunja goti')}</div>
            </div>
          </div>
          <div className="today-row">
            <Icon name="calendar" />
            <div>
              <div className="small muted">{l('Next home visit', 'Ziara ijayo nyumbani')}</div>
              <strong>{l('Tue 27 Oct, 9:00 · Brian Otieno', 'Jumanne 27 Okt, 3:00 asubuhi · Brian Otieno')}</strong>
            </div>
          </div>
          <div className="today-row">
            <Icon name="activity" />
            <div className="grow">
              <div className="small muted">{l("Today's exercises", 'Mazoezi ya leo')}</div>
              <strong>{doneCount} / {EXERCISES.length} {l('done', 'yamekamilika')}</strong>
            </div>
            <button className="btn sm" onClick={() => go('coach')}>{l('Start', 'Anza')}</button>
          </div>
          <div className="today-row">
            <Icon name="wallet" />
            <div className="grow">
              <div className="small muted">{l('Knee & hip package', 'Kifurushi cha goti na nyonga')}</div>
              <strong>{state.sessionsTotal - state.sessionsUsed} {l('sessions left', 'vipindi vimebaki')}</strong>
              <Meter value={state.sessionsUsed} max={state.sessionsTotal} label="sessions used" />
            </div>
          </div>
        </aside>
      </section>

      <section className="section">
        <h2 className="section-title">{l('Everything for your recovery', 'Kila kitu kwa urejesho wako')}</h2>
        <div className="feature-grid">
          {features.map((f) => {
            const [title, body] = l(f.en, f.sw)
            return (
              <button key={f.id} className="feature" onClick={() => go(f.id)}>
                <span className="feature-icon"><Icon name={f.icon} /></span>
                <span className="feature-text">
                  <strong>{title}</strong>
                  <span>{body}</span>
                </span>
                <Icon name="chevron" className="feature-go" />
              </button>
            )
          })}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">{l('How a home visit works', 'Jinsi ziara ya nyumbani inavyofanya kazi')}</h2>
        <ol className="steps">
          {steps.map(([title, body], i) => (
            <li key={i}>
              <span className="step-num">{i + 1}</span>
              <strong>{title}</strong>
              <p>{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section band-strip">
        <div>
          <h2 className="section-title">{l('Built for rural Kenya too', 'Imejengwa pia kwa maeneo ya vijijini')}</h2>
          <p className="muted">{l(
            'Pages are small, reminders arrive by SMS, and exercise videos can be saved for days without a connection. Matching works outside the big towns by showing travel charges up front.',
            'Kurasa ni ndogo, vikumbusho huja kwa SMS, na video za mazoezi zinaweza kuhifadhiwa kwa siku bila mtandao.'
          )}</p>
        </div>
        <div className="pay-logos" aria-label={l('Payment options', 'Njia za malipo')}>
          <span>M-Pesa</span><span>SHA</span><span>Britam</span><span>Jubilee</span><span>AAR</span>
          <small className="muted">{l('Proposed payment partners', 'Washirika wa malipo wanaopendekezwa')}</small>
        </div>
      </section>
    </div>
  )
}

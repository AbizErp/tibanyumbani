import { useStore } from '../store.jsx'
import Icon from '../Icon.jsx'
import { PATIENT, PROGRESS, EXERCISES, THERAPISTS, TOWNS } from '../data.js'
import { Meter } from '../ui.jsx'

export default function Home({ go }) {
  const { state, l } = useStore()
  const doneCount = EXERCISES.filter((e) => state.done[e.id]).length
  const flex = PROGRESS.flexion.at(-1)

  const services = [
    { id: 'find', icon: 'search', en: ['Find a physiotherapist', 'Matched by condition, location and how you want to be seen. Travel charges shown before you book.'], sw: ['Tafuta mtaalamu wa viungo', 'Unalinganishwa kwa hali yako, mahali, na jinsi unavyotaka kuonwa.'] },
    { id: 'passport', icon: 'folder', en: ['Rehab passport', 'Your X-rays, MRI reports, referrals and notes in one place. You decide who sees what, and for how long.'], sw: ['Pasipoti ya matibabu', 'X-ray, MRI, rufaa na maelezo yako mahali pamoja. Wewe ndiye unaamua nani aone.'] },
    { id: 'coach', icon: 'activity', en: ['Exercise coach', 'Exercises approved by your physiotherapist, with short videos, reminders and a way to report pain.'], sw: ['Kocha wa mazoezi', 'Mazoezi yaliyoidhinishwa na mtaalamu wako, video fupi na vikumbusho.'] },
    { id: 'family', icon: 'users', en: ['Family & caregivers', 'Let a family member or carer handle appointments and reminders, with limits you set.'], sw: ['Familia na walezi', 'Ruhusu mwanafamilia au mlezi kusimamia miadi na vikumbusho.'] },
    { id: 'payments', icon: 'wallet', en: ['Packages & payment', 'Pay per session or for a full package with M-Pesa or insurance, and see sessions left.'], sw: ['Vifurushi na malipo', 'Lipa kwa M-Pesa au bima, na uone vipindi vilivyobaki.'] },
    { id: 'partners', icon: 'store', en: ['Equipment & centres', 'Where to buy bands and braces nearby, and rehab centres if you prefer not to be seen at home.'], sw: ['Vifaa na vituo', 'Mahali pa kununua vifaa, na vituo vya urekebishaji.'] },
  ]

  const steps = [
    l(['Book', 'Pick a verified physiotherapist and a time. Pay a deposit by M-Pesa or use your insurance.'], ['Panga miadi', 'Chagua mtaalamu na muda. Lipa kwa M-Pesa au tumia bima.']),
    l(['Assessment at home', 'Your physiotherapist checks movement, strength, pain and home safety.'], ['Tathmini nyumbani', 'Mtaalamu anakagua mwendo, nguvu, maumivu na usalama wa nyumba.']),
    l(['Your plan', 'You get exercises in the app, with videos you can save for times without data.'], ['Mpango wako', 'Unapata mazoezi kwenye programu, na video unazoweza kuhifadhi.']),
    l(['Review and adjust', 'Your progress reaches the therapist between visits, so the plan keeps up with you.'], ['Kagua na rekebisha', 'Maendeleo yako yanamfikia mtaalamu kati ya ziara.']),
  ]

  const glance = [
    [THERAPISTS.filter((t) => t.verified).length, l('Verified physiotherapists', 'Wataalamu waliothibitishwa')],
    [TOWNS.length, l('Towns covered', 'Miji inayohudumiwa')],
    ['3', l('Ways to be seen: home, clinic, video', 'Njia za kuonwa')],
    ['2', l('Languages: English & Kiswahili', 'Lugha: Kiingereza na Kiswahili')],
  ]

  return (
    <div className="page home">
      <section className="hero-band">
        <div className="wrap hero">
          <div className="hero-copy">
            <div className="eyebrow">{l('Home physiotherapy across Kenya', 'Tiba ya viungo nyumbani kote Kenya')}</div>
            <h1 className="display">{l('Physiotherapy that comes to your door', 'Tiba ya viungo hadi mlangoni kwako')}</h1>
            <p className="lead">{l(
              'Recover from surgery, stroke or injury at home, with verified physiotherapists and your records in your control.',
              'Pona kutokana na upasuaji, kiharusi au jeraha ukiwa nyumbani, na wataalamu waliothibitishwa.'
            )}</p>
            <div className="hero-cta">
              <button className="btn gold lg" onClick={() => go('find')}>{l('Find a physiotherapist', 'Tafuta mtaalamu')}</button>
              <button className="btn outline-light lg" onClick={() => go('passport')}>{l('My rehab passport', 'Pasipoti yangu')}</button>
            </div>
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
                <strong>{l('Tue 27 Oct, 9:00 · Baraka Tumaini', 'Jumanne 27 Okt, 3:00 asubuhi · Baraka Tumaini')}</strong>
              </div>
            </div>
            <div className="today-row">
              <Icon name="activity" />
              <div className="grow">
                <div className="small muted">{l("Today's exercises", 'Mazoezi ya leo')}</div>
                <strong>{doneCount} / {EXERCISES.length} {l('done', 'yamekamilika')}</strong>
              </div>
              <button className="btn sm primary" onClick={() => go('coach')}>{l('Start', 'Anza')}</button>
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
        </div>
      </section>

      <section className="home-section">
        <div className="wrap">
          <div className="sec-head">
            <div className="eyebrow">{l('Our services', 'Huduma zetu')}</div>
            <h2>{l('Everything for your recovery', 'Kila kitu kwa urejesho wako')}</h2>
          </div>
          <div className="services">
            {services.map((s) => {
              const [title, body] = l(s.en, s.sw)
              return (
                <button key={s.id} className="service" onClick={() => go(s.id)}>
                  <span className="service-icon"><Icon name={s.icon} /></span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                  <span className="read-more">{l('Read more', 'Soma zaidi')} <Icon name="chevron" size={16} /></span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="glance">
        <div className="wrap glance-grid">
          {glance.map(([n, cap]) => (
            <div key={cap}>
              <div className="glance-num">{n}</div>
              <div className="glance-cap">{cap}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section shaded">
        <div className="wrap">
          <div className="sec-head">
            <div className="eyebrow">{l('How it works', 'Jinsi inavyofanya kazi')}</div>
            <h2>{l('Your first home visit', 'Ziara yako ya kwanza nyumbani')}</h2>
          </div>
          <ol className="steps">
            {steps.map(([title, body], i) => (
              <li key={i}>
                <span className="step-num">{i + 1}</span>
                <strong>{title}</strong>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="home-section">
        <div className="wrap">
          <div className="sec-head">
            <div className="eyebrow">{l('Payments', 'Malipo')}</div>
            <h2>{l('Pay the way that suits you', 'Lipa kwa njia inayokufaa')}</h2>
            <p>{l('Pages are small and reminders come by SMS, so the service works on low data and in rural areas.', 'Kurasa ni ndogo na vikumbusho huja kwa SMS.')}</p>
          </div>
          <div className="pay-logos">
            <span>M-Pesa</span><span>SHA</span><span>Britam</span><span>Jubilee</span><span>AAR</span>
          </div>
          <p className="small muted center-note">{l('Proposed payment partners', 'Washirika wa malipo wanaopendekezwa')}</p>
        </div>
      </section>
    </div>
  )
}

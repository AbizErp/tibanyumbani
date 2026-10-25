import { useStore } from '../store.jsx'
import Icon from '../Icon.jsx'
import { SUPPLIERS, CENTRES } from '../data.js'
import { PageHead } from '../ui.jsx'

export default function Partners({ go }) {
  const { l } = useStore()
  return (
    <div className="page">
      <PageHead
        eyebrow={l('Partners', 'Washirika')}
        title={l('Equipment & rehab centres', 'Vifaa na vituo vya urekebishaji')}
        lead={l('Where to get the bands, braces and walking aids your physiotherapist recommends, and centres to visit if you would rather not be treated at home.', 'Mahali pa kupata bendi, vifaa vya goti na vifaa vya kutembea, na vituo vya kutembelea.')}
      />

      <section className="section first">
        <h2 className="section-title"><Icon name="store" /> {l('Equipment suppliers near Nakuru', 'Wasambazaji wa vifaa karibu na Nakuru')}</h2>
        <div className="partner-grid">
          {SUPPLIERS.map((s) => (
            <article key={s.name} className="card partner">
              <div className="row-between"><strong>{s.name}</strong><span className="mono small muted">{s.km} km</span></div>
              <div className="small muted"><Icon name="pin" size={14} /> {s.town}</div>
              <div className="chips">{s.stock.map((x) => <span key={x} className="chip">{x}</span>)}</div>
              <div className="small referral"><Icon name="file" size={15} /> {l('Show your exercise plan at the counter so they give you the right band strength.', 'Onyesha mpango wako wa mazoezi ili upewe bendi sahihi.')}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title"><Icon name="heart" /> {l('Hospitals and rehabilitation centres', 'Hospitali na vituo vya urekebishaji')}</h2>
        <div className="partner-grid">
          {CENTRES.map((c) => (
            <article key={c.name} className="card partner">
              <div className="row-between"><strong>{c.name}</strong><span className="mono small muted">{c.km} km</span></div>
              <div className="small muted"><Icon name="pin" size={14} /> {c.town}</div>
              <div className="chips">{c.services.map((x) => <span key={x} className="chip">{x}</span>)}</div>
              <button className="btn sm ghost" onClick={() => go('passport')}><Icon name="share" size={16} /> {l('Share my passport with this centre', 'Shiriki pasipoti yangu na kituo hiki')}</button>
            </article>
          ))}
        </div>
      </section>

      <div className="card become-partner">
        <div>
          <strong>{l('Pharmacy, supplier or rehab centre?', 'Duka la dawa, msambazaji au kituo?')}</strong>
          <p className="small muted">{l('Partner with TibaNyumbani to receive patient referrals for equipment and centre-based care.', 'Shirikiana na TibaNyumbani kupokea rufaa za wagonjwa.')}</p>
        </div>
        <span className="small mono">partners@tibanyumbani.example</span>
      </div>
      <p className="small muted">{l('All partner names on this page are examples.', 'Majina yote ya washirika hapa ni mifano.')}</p>
    </div>
  )
}

import { useState } from 'react'
import { useStore } from '../store.jsx'
import Icon from '../Icon.jsx'
import { PACKAGES, INSURERS, kes } from '../data.js'
import { PageHead, Modal, Meter, useToast } from '../ui.jsx'
import { fmtDate } from '../App.jsx'

const mpesaCode = () => {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'
  return 'SK' + Array.from({ length: 8 }, () => c[Math.floor(Math.random() * c.length)]).join('')
}

export default function Payments() {
  const { state, update, l } = useStore()
  const [buying, setBuying] = useState(null)
  const [toast, showToast] = useToast()
  const left = state.sessionsTotal - state.sessionsUsed

  return (
    <div className="page">
      <PageHead
        eyebrow={l('M-Pesa and insurance treatment packages', 'Vifurushi vya M-Pesa na bima')}
        title={l('Packages & payment', 'Vifurushi na malipo')}
        lead={l('See the full cost before treatment starts. Pay per session or for a package, with M-Pesa or your cover from SHA or a private insurer.', 'Ona gharama kamili kabla ya matibabu. Lipa kwa kipindi au kifurushi, kwa M-Pesa au bima.')}
      />

      <div className="card current-pack">
        <div className="grow">
          <div className="eyebrow">{l('Your current package', 'Kifurushi chako cha sasa')}</div>
          <strong className="big">{l('Knee & hip recovery', 'Urejesho wa goti na nyonga')}</strong>
          <div className="small muted">{state.sessionsUsed} {l('of', 'kati ya')} {state.sessionsTotal} {l('sessions used', 'vipindi vimetumika')} · {l('paid with M-Pesa', 'imelipwa kwa M-Pesa')}</div>
          <Meter value={state.sessionsUsed} max={state.sessionsTotal} label="sessions used" />
        </div>
        <div className="left-count">
          <span className="num">{left}</span>
          <span className="small">{l('sessions left', 'vimebaki')}</span>
        </div>
        <button className="btn sm ghost" onClick={() => { if (left > 0) { update((s) => ({ sessionsUsed: s.sessionsUsed + 1 })); showToast(l('Session marked as completed', 'Kipindi kimewekwa kimekamilika')) } }} disabled={left === 0}>
          {l('Record a session (demo)', 'Andika kipindi (majaribio)')}
        </button>
      </div>

      <div className="pack-grid">
        {PACKAGES.map((p) => (
          <article key={p.id} className={'card pack' + (p.popular ? ' popular' : '')}>
            {p.popular && <span className="pill ok pop-tag">{l('Most chosen after joint replacement', 'Huchaguliwa zaidi baada ya upasuaji wa viungo')}</span>}
            <h3>{l(p.name, p.nameSw)}</h3>
            <div className="price mono">{kes(p.price)}</div>
            <div className="small muted">{p.sessions > 1 ? `${p.sessions} ${l('sessions', 'vipindi')} · ${kes(p.per)} ${l('each', 'kila kimoja')}` : l('One session', 'Kipindi kimoja')}</div>
            <p className="small">{l(p.note, p.noteSw)}</p>
            <button className="btn primary full" onClick={() => setBuying(p)}>{l('Choose', 'Chagua')}</button>
          </article>
        ))}
      </div>
      <p className="small muted">{l('Prices are examples. Home visit travel is added per visit based on distance.', 'Bei ni mifano. Usafiri huongezwa kulingana na umbali.')}</p>

      <section className="section">
        <h2 className="section-title">{l('Receipts', 'Risiti')}</h2>
        <div className="table-wrap card">
          <table className="log">
            <thead><tr><th>{l('Date', 'Tarehe')}</th><th>{l('Item', 'Bidhaa')}</th><th>{l('Method', 'Njia')}</th><th>{l('Reference', 'Kumbukumbu')}</th><th className="r">{l('Amount', 'Kiasi')}</th></tr></thead>
            <tbody>
              {state.receipts.map((r) => (
                <tr key={r.id}>
                  <td className="nowrap">{fmtDate(r.date, state.lang)}</td>
                  <td>{r.item}</td>
                  <td>{r.method}</td>
                  <td className="mono">{r.id}</td>
                  <td className="mono r nowrap">{kes(r.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {buying && <PayModal p={buying} onClose={() => setBuying(null)} onPaid={(rec, sessions) => {
        update((s) => ({ receipts: [rec, ...s.receipts], sessionsTotal: s.sessionsTotal - s.sessionsUsed + sessions, sessionsUsed: 0 }))
        setBuying(null)
        showToast(rec.method === 'M-Pesa' ? l(`Paid. M-Pesa ref ${rec.id}`, `Imelipwa. Kumbukumbu ${rec.id}`) : l('Sent to your insurer for approval', 'Imetumwa kwa bima yako'))
      }} />}
      {toast}
    </div>
  )
}

function PayModal({ p, onClose, onPaid }) {
  const { l } = useStore()
  const [method, setMethod] = useState('mpesa')
  const [phone, setPhone] = useState('0712 345 678')
  const [insurer, setInsurer] = useState(INSURERS[0])
  const [member, setMember] = useState('')
  const [stage, setStage] = useState('form')

  const pay = () => {
    setStage('wait')
    setTimeout(() => {
      const today = new Date().toISOString().slice(0, 10)
      onPaid(method === 'mpesa'
        ? { id: mpesaCode(), date: today, item: p.name, amount: p.price, method: 'M-Pesa' }
        : { id: 'PA-' + Math.floor(100000 + Math.random() * 900000), date: today, item: p.name + ' (pending approval)', amount: p.price, method: insurer.split(' ')[0] }, p.sessions)
    }, 2000)
  }

  return (
    <Modal title={l(p.name, p.nameSw)} onClose={onClose} footer={stage === 'form' && (
      <>
        <button className="btn ghost" onClick={onClose}>{l('Cancel', 'Ghairi')}</button>
        <button className="btn primary" onClick={pay} disabled={method === 'ins' && member.length < 4}>
          {method === 'mpesa' ? l(`Pay ${kes(p.price)}`, `Lipa ${kes(p.price)}`) : l('Request approval', 'Omba idhini')}
        </button>
      </>
    )}>
      {stage === 'form' ? (
        <div className="stack">
          <div className="seg">
            <button className={method === 'mpesa' ? 'on' : ''} onClick={() => setMethod('mpesa')}>M-Pesa</button>
            <button className={method === 'ins' ? 'on' : ''} onClick={() => setMethod('ins')}>{l('Insurance', 'Bima')}</button>
          </div>
          {method === 'mpesa' ? (
            <label className="field"><span>{l('M-Pesa number', 'Nambari ya M-Pesa')}</span><input id="pay-phone" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
          ) : (
            <>
              <label className="field"><span>{l('Insurer', 'Bima')}</span>
                <select id="pay-ins" value={insurer} onChange={(e) => setInsurer(e.target.value)}>{INSURERS.map((i) => <option key={i}>{i}</option>)}</select>
              </label>
              <label className="field"><span>{l('Member number', 'Nambari ya uanachama')}</span><input id="pay-member" value={member} onChange={(e) => setMember(e.target.value)} placeholder="e.g. CR1234567" /></label>
            </>
          )}
          <table className="sum"><tbody>
            <tr><td>{p.sessions} × {l('session', 'kipindi')}</td><td className="mono">{kes(p.per)}</td></tr>
            <tr className="total"><td>{l('Total', 'Jumla')}</td><td className="mono">{kes(p.price)}</td></tr>
          </tbody></table>
        </div>
      ) : (
        <div className="stk">
          <div className="stk-phone"><Icon name="phone" size={34} /></div>
          <strong>{method === 'mpesa' ? l('Enter your M-Pesa PIN', 'Weka PIN yako ya M-Pesa') : l('Contacting insurer…', 'Inawasiliana na bima…')}</strong>
          <p className="muted">{method === 'mpesa' ? l(`A payment request for ${kes(p.price)} was sent to ${phone}.`, `Ombi la malipo la ${kes(p.price)} limetumwa kwa ${phone}.`) : insurer}</p>
          <div className="spinner" aria-hidden="true" />
          <small className="muted">{l('Demo: payment is simulated.', 'Majaribio: malipo ni ya kuigiza.')}</small>
        </div>
      )}
    </Modal>
  )
}

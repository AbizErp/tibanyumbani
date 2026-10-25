import { useState } from 'react'
import { useStore } from '../store.jsx'
import Icon from '../Icon.jsx'
import { SCOPES } from '../data.js'
import { PageHead, Modal, useToast } from '../ui.jsx'
import { fmtDate } from '../App.jsx'

export default function Family() {
  const { state, update, logEvent, l } = useStore()
  const [adding, setAdding] = useState(false)
  const [revoking, setRevoking] = useState(null)
  const [toast, showToast] = useToast()

  const toggleScope = (c, id) => {
    update((s) => ({ caregivers: s.caregivers.map((x) => x.id === c.id ? { ...x, scopes: x.scopes.includes(id) ? x.scopes.filter((y) => y !== id) : [...x.scopes, id] } : x) }))
  }

  return (
    <div className="page">
      <PageHead
        eyebrow={l('Family and caregiver access', 'Ruhusa kwa familia na walezi')}
        title={l('Who helps you', 'Wanaokusaidia')}
        lead={l('Let a family member or carer handle appointments, reminders and paperwork. You choose exactly what they can do, and you can remove them at any time.', 'Ruhusu mwanafamilia au mlezi kusimamia miadi, vikumbusho na nyaraka. Wewe unachagua wanachoweza kufanya.')}
      >
        <button className="btn primary" onClick={() => setAdding(true)}><Icon name="plus" size={18} /> {l('Add a caregiver', 'Ongeza mlezi')}</button>
      </PageHead>

      <div className="cg-list">
        {state.caregivers.map((c) => (
          <article key={c.id} className="card cg">
            <div className="cg-head">
              <div className="avatar" aria-hidden="true">{c.name.split(' ').map((w) => w[0]).join('')}</div>
              <div className="grow">
                <strong>{c.name}</strong>
                <div className="small muted">{c.relation} · <span className="mono">{c.phone}</span> · {l('added', 'aliongezwa')} {fmtDate(c.added, state.lang)}</div>
              </div>
              {c.verified ? <span className="pill ok"><Icon name="check" size={14} /> {l('Phone verified', 'Simu imethibitishwa')}</span> : <span className="pill warn">{l('Awaiting code', 'Inasubiri nambari')}</span>}
            </div>
            <div className="scope-grid">
              {SCOPES.map((s) => {
                const on = c.scopes.includes(s.id)
                return (
                  <label key={s.id} className={'scope' + (on ? ' on' : '')}>
                    <input type="checkbox" checked={on} onChange={() => toggleScope(c, s.id)} />
                    <span>{l(s.en, s.sw)}</span>
                  </label>
                )
              })}
            </div>
            <div className="row-between">
              <span className="small muted">{l('They get SMS reminders for appointments and exercises when that box is ticked.', 'Wanapata vikumbusho vya SMS kisanduku kikiwekwa alama.')}</span>
              <button className="btn sm danger" onClick={() => setRevoking(c)}>{l('Remove access', 'Ondoa ruhusa')}</button>
            </div>
          </article>
        ))}
        {state.caregivers.length === 0 && (
          <div className="empty card"><Icon name="users" size={28} /><p>{l('No caregivers yet. Add someone you trust to help with appointments and reminders.', 'Hakuna walezi bado.')}</p></div>
        )}
      </div>

      <div className="card safeguards">
        <h2 className="card-title"><Icon name="shield" /> {l('Safeguards', 'Kinga')}</h2>
        <ul>
          <li>{l('Every caregiver confirms their phone number with a one-time code before they can act.', 'Kila mlezi anathibitisha nambari yake ya simu kwa nambari ya mara moja.')}</li>
          <li>{l('Medical records and imaging stay hidden from caregivers unless you tick that box.', 'Rekodi za matibabu zinabaki zimefichwa isipokuwa ukiruhusu.')}</li>
          <li>{l('For a child, or an adult who cannot give consent, the guardian uploads proof such as a birth certificate or court order. Our team checks it before access starts.', 'Kwa mtoto, au mtu mzima asiyeweza kutoa idhini, mlezi anapakia uthibitisho. Timu yetu inaukagua kabla ya ruhusa kuanza.')}</li>
          <li>{l('Everything a caregiver does appears in your access history.', 'Kila kitendo cha mlezi kinaonekana kwenye historia yako.')}</li>
        </ul>
      </div>

      {adding && <AddCaregiver onClose={() => setAdding(false)} onDone={(c) => {
        update((s) => ({ caregivers: [...s.caregivers, c] }))
        logEvent({ who: 'You', action: 'shared', item: `Caregiver access for ${c.name}` })
        setAdding(false)
        showToast(l(`${c.name} can now help you`, `${c.name} sasa anaweza kukusaidia`))
      }} />}

      {revoking && (
        <Modal title={l('Remove caregiver?', 'Ondoa mlezi?')} onClose={() => setRevoking(null)} footer={
          <>
            <button className="btn ghost" onClick={() => setRevoking(null)}>{l('Cancel', 'Ghairi')}</button>
            <button className="btn danger" onClick={() => {
              update((s) => ({ caregivers: s.caregivers.filter((x) => x.id !== revoking.id) }))
              logEvent({ who: 'You', action: 'revoked', item: `Caregiver access for ${revoking.name}` })
              setRevoking(null)
              showToast(l('Caregiver removed', 'Mlezi ameondolewa'))
            }}>{l('Remove', 'Ondoa')}</button>
          </>
        }>
          <p>{l(`${revoking.name} will stop receiving reminders and lose access straight away.`, `${revoking.name} ataacha kupokea vikumbusho mara moja.`)}</p>
        </Modal>
      )}
      {toast}
    </div>
  )
}

function AddCaregiver({ onClose, onDone }) {
  const { l } = useStore()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', relation: 'Daughter', phone: '', scopes: ['appointments', 'reminders'] })
  const [code, setCode] = useState('')
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const valid = form.name.trim().length > 1 && form.phone.replace(/\D/g, '').length >= 9

  return (
    <Modal title={l('Add a caregiver', 'Ongeza mlezi')} onClose={onClose} footer={
      step === 1 ? (
        <>
          <button className="btn ghost" onClick={onClose}>{l('Cancel', 'Ghairi')}</button>
          <button className="btn primary" disabled={!valid} onClick={() => setStep(2)}>{l('Send verification code', 'Tuma nambari ya uthibitisho')}</button>
        </>
      ) : (
        <>
          <button className="btn ghost" onClick={() => setStep(1)}>{l('Back', 'Rudi')}</button>
          <button className="btn primary" disabled={code !== '4821'} onClick={() => onDone({
            id: 'c' + Date.now(), ...form, phone: form.phone.slice(0, 4) + ' *** ' + form.phone.replace(/\D/g, '').slice(-3), verified: true, added: new Date().toISOString().slice(0, 10),
          })}>{l('Verify and add', 'Thibitisha na ongeza')}</button>
        </>
      )
    }>
      {step === 1 ? (
        <div className="stack">
          <div className="two">
            <label className="field"><span>{l('Full name', 'Jina kamili')}</span><input id="cg-name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Mary Achieng" /></label>
            <label className="field"><span>{l('Relationship', 'Uhusiano')}</span>
              <select id="cg-rel" value={form.relation} onChange={(e) => set('relation', e.target.value)}>
                {['Daughter', 'Son', 'Spouse', 'Sibling', 'Paid carer', 'Parent / guardian'].map((r) => <option key={r}>{r}</option>)}
              </select>
            </label>
          </div>
          <label className="field"><span>{l('Their phone number', 'Nambari yao ya simu')}</span><input id="cg-phone" inputMode="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="07xx xxx xxx" /></label>
          <fieldset className="field">
            <legend>{l('What can they do?', 'Wanaweza kufanya nini?')}</legend>
            <div className="check-list">
              {SCOPES.map((s) => (
                <label key={s.id} className="check">
                  <input type="checkbox" checked={form.scopes.includes(s.id)} onChange={() => set('scopes', form.scopes.includes(s.id) ? form.scopes.filter((x) => x !== s.id) : [...form.scopes, s.id])} />
                  <span>{l(s.en, s.sw)}</span>
                </label>
              ))}
            </div>
          </fieldset>
          {form.relation === 'Parent / guardian' && <p className="note">{l('You will be asked to upload proof of guardianship before access starts.', 'Utaombwa kupakia uthibitisho wa ulezi kabla ya ruhusa kuanza.')}</p>}
        </div>
      ) : (
        <div className="stack">
          <p>{l(`We sent a 4-digit code by SMS to ${form.phone}. Ask ${form.name} to read it to you.`, `Tumetuma nambari ya tarakimu 4 kwa SMS kwa ${form.phone}.`)}</p>
          <label className="field"><span>{l('Code', 'Nambari')}</span><input id="cg-code" className="code-input mono" inputMode="numeric" maxLength={4} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} /></label>
          <small className="muted">{l('Demo code: 4821', 'Nambari ya majaribio: 4821')}</small>
        </div>
      )}
    </Modal>
  )
}

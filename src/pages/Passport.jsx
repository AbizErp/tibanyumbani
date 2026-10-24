import { useRef, useState } from 'react'
import { useStore } from '../store.jsx'
import Icon from '../Icon.jsx'
import { PATIENT, RECORD_TYPES, SESSIONS, PROGRESS } from '../data.js'
import { PageHead, Modal, Tabs, LineChart, useToast } from '../ui.jsx'
import { fmtWhen, fmtDate } from '../App.jsx'

const TODAY = new Date().toISOString().slice(0, 10)

export default function Passport() {
  const { state, l } = useStore()
  const [tab, setTab] = useState('records')
  const [shareFor, setShareFor] = useState(null)
  const [toast, showToast] = useToast()
  const activeGrants = state.grants.filter((g) => g.status === 'active' && g.expires >= TODAY)

  return (
    <div className="page">
      <PageHead
        eyebrow={l('Patient-controlled record vault', 'Hifadhi ya rekodi inayodhibitiwa na mgonjwa')}
        title={l('Rehab passport', 'Pasipoti ya matibabu')}
        lead={l('Your records, treatment and recovery in one place. Share them with the people treating you, set an end date, and see every time they are opened.', 'Rekodi, matibabu na maendeleo yako mahali pamoja. Washirikishe wanaokutibu, weka tarehe ya mwisho, na uone kila mara zinapofunguliwa.')}
      />

      <div className="passport-strip card">
        <div className="pp-id">
          <div className="avatar lg" aria-hidden="true">GA</div>
          <div>
            <strong>{PATIENT.name}</strong>
            <div className="small muted">{PATIENT.age} {l('yrs', 'miaka')} · {PATIENT.town}</div>
            <div className="small">{l(PATIENT.condition, PATIENT.conditionSw)} · {fmtDate(PATIENT.surgeryDate, state.lang)}</div>
          </div>
        </div>
        <dl className="pp-stats">
          <div><dt>{l('Records', 'Rekodi')}</dt><dd>{state.records.length}</dd></div>
          <div><dt>{l('Care team with access', 'Timu yenye ruhusa')}</dt><dd>{activeGrants.length}</dd></div>
          <div><dt>{l('Sessions so far', 'Vipindi hadi sasa')}</dt><dd>{SESSIONS.length}</dd></div>
        </dl>
      </div>

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'records', label: l('Medical records', 'Rekodi za matibabu'), count: state.records.length },
          { id: 'access', label: l('Care team access', 'Ruhusa ya timu') },
          { id: 'log', label: l('Access history', 'Historia ya ufikiaji') },
          { id: 'treatment', label: l('Treatment history', 'Historia ya matibabu') },
          { id: 'progress', label: l('Recovery progress', 'Maendeleo') },
        ]}
      />

      {tab === 'records' && <Records onShare={setShareFor} toast={showToast} />}
      {tab === 'access' && <Access onNew={() => setShareFor('new')} toast={showToast} />}
      {tab === 'log' && <AccessLog />}
      {tab === 'treatment' && <Treatment />}
      {tab === 'progress' && <Progress />}

      {shareFor && <ShareModal preselect={shareFor === 'new' ? null : shareFor} onClose={() => setShareFor(null)} onDone={(msg) => { setShareFor(null); showToast(msg); setTab('access') }} />}
      {toast}
    </div>
  )
}

function Records({ onShare, toast }) {
  const { state, update, logEvent, l } = useStore()
  const fileRef = useRef(null)
  const [type, setType] = useState('xray')
  const [filter, setFilter] = useState('all')

  const onUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const rec = {
      id: 'r' + Date.now(), type, title: file.name.replace(/\.[^.]+$/, ''), date: TODAY,
      source: l('Uploaded by you', 'Imepakiwa na wewe'), size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
    }
    update((s) => ({ records: [rec, ...s.records] }))
    logEvent({ who: 'You', action: 'uploaded', item: rec.title })
    toast(l('Record added to your passport', 'Rekodi imeongezwa kwenye pasipoti yako'))
    e.target.value = ''
  }

  const download = (r) => {
    logEvent({ who: 'You', action: 'downloaded', item: r.title }, `You downloaded “${r.title}”.`)
    toast(l('Download recorded in your access history', 'Upakuaji umeandikwa kwenye historia yako'))
  }

  const sharedWith = (id) => state.grants.filter((g) => g.status === 'active' && g.expires >= TODAY && g.records.includes(id))
  const list = state.records.filter((r) => filter === 'all' || r.type === filter)

  return (
    <section className="tab-panel">
      <div className="upload card">
        <div className="upload-text">
          <Icon name="upload" size={26} />
          <div>
            <strong>{l('Add a record', 'Ongeza rekodi')}</strong>
            <div className="small muted">{l('Photo or PDF of an X-ray report, MRI report, referral, discharge summary or notes.', 'Picha au PDF ya ripoti ya X-ray, MRI, rufaa, muhtasari au maelezo.')}</div>
          </div>
        </div>
        <div className="upload-ctrl">
          <select id="rec-type" value={type} onChange={(e) => setType(e.target.value)} aria-label={l('Record type', 'Aina ya rekodi')}>
            {Object.entries(RECORD_TYPES).map(([k, v]) => <option key={k} value={k}>{l(v.en, v.sw)}</option>)}
          </select>
          <input ref={fileRef} id="rec-file" type="file" accept="image/*,.pdf" hidden onChange={onUpload} />
          <button className="btn primary" onClick={() => fileRef.current?.click()}><Icon name="upload" size={18} /> {l('Upload', 'Pakia')}</button>
        </div>
      </div>

      <div className="chips filter-chips">
        <button className={'chip' + (filter === 'all' ? ' hit' : '')} onClick={() => setFilter('all')}>{l('All', 'Zote')}</button>
        {Object.entries(RECORD_TYPES).map(([k, v]) => (
          <button key={k} className={'chip' + (filter === k ? ' hit' : '')} onClick={() => setFilter(k)}>{l(v.en, v.sw)}</button>
        ))}
      </div>

      <ul className="record-list">
        {list.map((r) => {
          const rt = RECORD_TYPES[r.type]
          const sw = sharedWith(r.id)
          return (
            <li key={r.id} className="record card">
              <span className={'rec-ico tone-' + rt.tone}><Icon name="file" /></span>
              <div className="rec-main">
                <span className={'tag tone-' + rt.tone}>{l(rt.en, rt.sw)}</span>
                <strong>{r.title}</strong>
                <div className="small muted">{fmtDate(r.date, state.lang)} · {r.source} · {r.size}</div>
                <div className="small rec-shared">
                  <Icon name="eye" size={15} />
                  {sw.length ? `${l('Shared with', 'Imeshirikiwa na')} ${sw.map((g) => g.who).join(', ')}` : l('Only you', 'Wewe pekee')}
                </div>
              </div>
              <div className="rec-actions">
                <button className="btn sm ghost" onClick={() => onShare(r.id)}><Icon name="share" size={16} /> {l('Share', 'Shiriki')}</button>
                <button className="btn sm ghost" onClick={() => download(r)}><Icon name="download" size={16} /> {l('Download', 'Pakua')}</button>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function Access({ onNew, toast }) {
  const { state, update, logEvent, l } = useStore()
  const [confirm, setConfirm] = useState(null)

  const revoke = (g) => {
    update((s) => ({ grants: s.grants.map((x) => (x.id === g.id ? { ...x, status: 'revoked' } : x)) }))
    logEvent({ who: 'You', action: 'revoked', item: `Access for ${g.who}` }, `Access for ${g.who} was revoked.`)
    setConfirm(null)
    toast(l(`${g.who} can no longer open your records`, `${g.who} hawezi tena kufungua rekodi zako`))
  }
  const extend = (g) => {
    const d = new Date(Math.max(new Date(g.expires), new Date()))
    d.setDate(d.getDate() + 30)
    const expires = d.toISOString().slice(0, 10)
    update((s) => ({ grants: s.grants.map((x) => (x.id === g.id ? { ...x, expires, status: 'active' } : x)) }))
    logEvent({ who: 'You', action: 'shared', item: `Extended access for ${g.who} to ${expires}` })
    toast(l('Access extended by 30 days', 'Ruhusa imeongezwa kwa siku 30'))
  }

  return (
    <section className="tab-panel">
      <div className="row-between">
        <p className="muted">{l('People only see the records you pick, until the date you set. Revoking stops future access straight away.', 'Watu wanaona rekodi unazochagua pekee, hadi tarehe unayoweka.')}</p>
        <button className="btn primary" onClick={onNew}><Icon name="plus" size={18} /> {l('Give access', 'Toa ruhusa')}</button>
      </div>
      <ul className="grant-list">
        {state.grants.map((g) => {
          const expired = g.status === 'active' && g.expires < TODAY
          const status = g.status === 'revoked' ? 'revoked' : expired || g.status === 'expired' ? 'expired' : 'active'
          return (
            <li key={g.id} className={'grant card ' + status}>
              <div className="grant-main">
                <div className="avatar" aria-hidden="true">{g.who.replace('Dr. ', '').split(' ').map((w) => w[0]).slice(0, 2).join('')}</div>
                <div>
                  <strong>{g.who}</strong>
                  <div className="small muted">{g.role}</div>
                </div>
                <span className={'pill ' + (status === 'active' ? 'ok' : status === 'expired' ? 'warn' : 'crit')}>
                  {status === 'active' ? l('Active', 'Hai') : status === 'expired' ? l('Expired', 'Imeisha') : l('Revoked', 'Imefutwa')}
                </span>
              </div>
              <dl className="grant-facts small">
                <div><dt>{l('Records', 'Rekodi')}</dt><dd>{g.records.length}</dd></div>
                <div><dt>{l('Until', 'Hadi')}</dt><dd>{fmtDate(g.expires, state.lang)}</dd></div>
                <div><dt>{l('Download', 'Kupakua')}</dt><dd>{g.download ? l('Allowed', 'Inaruhusiwa') : l('View only', 'Kuona tu')}</dd></div>
              </dl>
              <div className="grant-actions">
                {status === 'active' && <button className="btn sm danger" onClick={() => setConfirm(g)}>{l('Revoke', 'Futa ruhusa')}</button>}
                {status !== 'revoked' && <button className="btn sm ghost" onClick={() => extend(g)}>{l('Extend 30 days', 'Ongeza siku 30')}</button>}
              </div>
            </li>
          )
        })}
      </ul>
      {confirm && (
        <Modal title={l('Revoke access?', 'Futa ruhusa?')} onClose={() => setConfirm(null)} footer={
          <>
            <button className="btn ghost" onClick={() => setConfirm(null)}>{l('Keep access', 'Acha ruhusa')}</button>
            <button className="btn danger" onClick={() => revoke(confirm)}>{l('Revoke now', 'Futa sasa')}</button>
          </>
        }>
          <p>{l(`${confirm.who} will not be able to open your records from now on.`, `${confirm.who} hataweza kufungua rekodi zako kuanzia sasa.`)}</p>
          <p className="note">{l('Copies they already downloaded stay with them. Revoking stops future access only.', 'Nakala walizopakua tayari zinabaki nao. Kufuta kunazuia ufikiaji wa baadaye pekee.')}</p>
        </Modal>
      )}
    </section>
  )
}

function ShareModal({ preselect, onClose, onDone }) {
  const { state, update, logEvent, l } = useStore()
  const [who, setWho] = useState('Brian Otieno')
  const [role, setRole] = useState('Home physiotherapist')
  const [recs, setRecs] = useState(preselect ? [preselect] : [])
  const d = new Date(); d.setDate(d.getDate() + 30)
  const [expires, setExpires] = useState(d.toISOString().slice(0, 10))
  const [download, setDownload] = useState(false)

  const toggle = (id) => setRecs((r) => (r.includes(id) ? r.filter((x) => x !== id) : [...r, id]))
  const save = () => {
    const existing = state.grants.find((g) => g.who === who && g.status === 'active')
    const grant = { id: existing?.id || 'g' + Date.now(), who, role, records: [...new Set([...(existing?.records || []), ...recs])], expires, download, status: 'active' }
    update((s) => ({ grants: existing ? s.grants.map((g) => (g.id === existing.id ? grant : g)) : [grant, ...s.grants] }))
    logEvent({ who: 'You', action: 'shared', item: `${recs.length} record(s) → ${who} until ${expires}` }, `You shared ${recs.length} record(s) with ${who}.`)
    onDone(l(`Shared with ${who} until ${expires}`, `Imeshirikiwa na ${who} hadi ${expires}`))
  }

  return (
    <Modal title={l('Give access', 'Toa ruhusa')} onClose={onClose} footer={
      <>
        <button className="btn ghost" onClick={onClose}>{l('Cancel', 'Ghairi')}</button>
        <button className="btn primary" disabled={!recs.length || !who} onClick={save}>{l('Share', 'Shiriki')} {recs.length || ''}</button>
      </>
    }>
      <div className="stack">
        <div className="two">
          <label className="field"><span>{l('Person or facility', 'Mtu au kituo')}</span>
            <input id="share-who" value={who} onChange={(e) => setWho(e.target.value)} list="team" />
            <datalist id="team"><option>Brian Otieno</option><option>Dr. S. Njoroge</option><option>Hope Rehabilitation Centre</option><option>Lakeview Physio Clinic</option></datalist>
          </label>
          <label className="field"><span>{l('Role', 'Jukumu')}</span>
            <input id="share-role" value={role} onChange={(e) => setRole(e.target.value)} />
          </label>
        </div>
        <fieldset className="field">
          <legend>{l('Records to share', 'Rekodi za kushiriki')}</legend>
          <div className="check-list">
            {state.records.map((r) => (
              <label key={r.id} className="check">
                <input type="checkbox" checked={recs.includes(r.id)} onChange={() => toggle(r.id)} />
                <span>{r.title}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="two">
          <label className="field"><span>{l('Access ends on', 'Ruhusa inaisha')}</span>
            <input id="share-exp" type="date" min={TODAY} value={expires} onChange={(e) => setExpires(e.target.value)} />
          </label>
          <label className="check toggle-row">
            <input id="share-dl" type="checkbox" checked={download} onChange={(e) => setDownload(e.target.checked)} />
            <span>{l('Allow downloads', 'Ruhusu kupakua')}<small className="muted block">{l('You get an alert every time', 'Utapata arifa kila mara')}</small></span>
          </label>
        </div>
      </div>
    </Modal>
  )
}

const ACTION_TONE = { viewed: 'grey', uploaded: 'green', downloaded: 'yellow', shared: 'blue', blocked: 'crit', revoked: 'crit', expired: 'grey' }

function AccessLog() {
  const { state, l } = useStore()
  const [f, setF] = useState('all')
  const rows = state.log.filter((r) => f === 'all' || (f === 'out' ? ['downloaded', 'shared'].includes(r.action) : ['blocked', 'revoked', 'expired'].includes(r.action)))
  const actionLabel = (a) => l(a, { viewed: 'ameona', uploaded: 'amepakia', downloaded: 'amepakua', shared: 'ameshiriki', blocked: 'imezuiwa', revoked: 'imefutwa', expired: 'imeisha' }[a])
  return (
    <section className="tab-panel">
      <div className="chips filter-chips">
        <button className={'chip' + (f === 'all' ? ' hit' : '')} onClick={() => setF('all')}>{l('Everything', 'Kila kitu')}</button>
        <button className={'chip' + (f === 'out' ? ' hit' : '')} onClick={() => setF('out')}>{l('Downloads & shares', 'Upakuaji na kushiriki')}</button>
        <button className={'chip' + (f === 'sec' ? ' hit' : '')} onClick={() => setF('sec')}>{l('Blocked & revoked', 'Zilizozuiwa')}</button>
      </div>
      <div className="table-wrap card">
        <table className="log">
          <thead><tr><th>{l('When', 'Lini')}</th><th>{l('Who', 'Nani')}</th><th>{l('Action', 'Kitendo')}</th><th>{l('What', 'Nini')}</th><th>{l('Route', 'Njia')}</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="mono nowrap">{fmtWhen(r.at, state.lang)}</td>
                <td>{r.who === 'You' ? l('You', 'Wewe') : r.who}</td>
                <td><span className={'tag tone-' + ACTION_TONE[r.action]}>{actionLabel(r.action)}</span></td>
                <td>{r.item}</td>
                <td className="muted small nowrap">{r.route}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="note"><Icon name="alert" size={16} /> {l(
        'We record every view, download, export and share made through the app and website. Screenshots, phone photos of a screen and other copying outside the app cannot always be detected.',
        'Tunaandika kila kuona, kupakua na kushiriki kupitia programu na tovuti. Picha za skrini na kunakili nje ya programu haviwezi kugunduliwa kila mara.'
      )}</p>
    </section>
  )
}

function Treatment() {
  const { state, l } = useStore()
  return (
    <section className="tab-panel">
      <ol className="timeline">
        {[...SESSIONS].reverse().map((s) => (
          <li key={s.date}>
            <time className="mono">{fmtDate(s.date, state.lang)}</time>
            <div className="card tl-card">
              <strong>{s.type}</strong>
              <div className="small muted">{s.who}</div>
              <p>{s.note}</p>
            </div>
          </li>
        ))}
        <li>
          <time className="mono">{fmtDate('2026-09-01', state.lang)}</time>
          <div className="card tl-card"><strong>{l('Discharged from hospital', 'Aliruhusiwa kutoka hospitali')}</strong><div className="small muted">Rift Valley General Hospital</div></div>
        </li>
      </ol>
    </section>
  )
}

function Progress() {
  const { l } = useStore()
  return (
    <section className="tab-panel">
      <div className="progress-grid">
        <div className="card chart-card">
          <h3>{l('Knee bend (flexion)', 'Kukunja goti')}</h3>
          <p className="small muted">{l('Degrees. Goal for stairs and sitting: 110° or more.', 'Nyuzi. Lengo: 110° au zaidi.')}</p>
          <LineChart labels={PROGRESS.weeks} series={[{ label: 'Flexion', values: PROGRESS.flexion, cls: 's-primary' }]} min={60} max={130} unit="°" ticks={[60, 90, 110, 130]} />
        </div>
        <div className="card chart-card">
          <h3>{l('Pain on stairs', 'Maumivu kwenye ngazi')}</h3>
          <p className="small muted">{l('0 = no pain, 10 = worst imaginable.', '0 = hakuna maumivu, 10 = makali zaidi.')}</p>
          <LineChart labels={PROGRESS.weeks} series={[{ label: 'Pain', values: PROGRESS.pain, cls: 's-red' }]} min={0} max={10} ticks={[0, 5, 10]} />
        </div>
        <div className="card chart-card">
          <h3>{l('Daily function (LEFS)', 'Shughuli za kila siku (LEFS)')}</h3>
          <p className="small muted">{l('Lower Extremity Functional Scale, 0–80. Higher is better.', 'Kipimo cha uwezo wa miguu, 0–80. Juu ni bora.')}</p>
          <LineChart labels={PROGRESS.weeks} series={[{ label: 'LEFS', values: PROGRESS.lefs, cls: 's-blue' }]} min={0} max={80} ticks={[0, 40, 80]} />
        </div>
        <div className="card chart-card summary-card">
          <h3>{l('Since week 1', 'Tangu wiki ya 1')}</h3>
          <ul className="deltas">
            <li><span className="delta up">+{PROGRESS.flexion.at(-1) - PROGRESS.flexion[0]}°</span>{l('knee bend', 'kukunja goti')}</li>
            <li><span className="delta up">−{PROGRESS.pain[0] - PROGRESS.pain.at(-1)}</span>{l('points of pain', 'alama za maumivu')}</li>
            <li><span className="delta up">+{PROGRESS.lefs.at(-1) - PROGRESS.lefs[0]}</span>{l('LEFS points', 'alama za LEFS')}</li>
          </ul>
          <p className="small muted">{l('Measured by Brian Otieno at each visit. Pain is your own weekly rating.', 'Vimepimwa na Brian Otieno kila ziara.')}</p>
        </div>
      </div>
    </section>
  )
}

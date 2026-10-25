import { useState } from 'react'
import { useStore } from '../store.jsx'
import Icon from '../Icon.jsx'
import { SECURITY_ALERTS } from '../data.js'
import { PageHead } from '../ui.jsx'
import { fmtWhen } from '../App.jsx'

export default function Security() {
  const { state, l } = useStore()
  const [open, setOpen] = useState(SECURITY_ALERTS.map((a) => ({ ...a, status: 'open' })))
  const act = (id, status) => setOpen((xs) => xs.map((x) => (x.id === id ? { ...x, status } : x)))
  const counts = { critical: open.filter((a) => a.level === 'critical' && a.status === 'open').length, warning: open.filter((a) => a.level === 'warning' && a.status === 'open').length }

  const rules = [
    [l('Bulk download', 'Upakuaji wa wingi'), l('More than 5 imaging files in 60 seconds from one account', 'Zaidi ya faili 5 ndani ya sekunde 60'), l('Pause downloads, lock account, alert admin and patients', 'Simamisha, funga akaunti, julisha')],
    [l('Repeated sign-in failures', 'Kushindwa kuingia mara kwa mara'), l('3 or more failures in 5 minutes', 'Mara 3 au zaidi ndani ya dakika 5'), l('Require one-time PIN, notify patient', 'Hitaji PIN ya mara moja')],
    [l('Access after expiry', 'Ufikiaji baada ya muda kuisha'), l('Any request on an expired or revoked grant', 'Ombi lolote kwenye ruhusa iliyoisha'), l('Refuse and log', 'Kataa na andika')],
    [l('Unusual hours', 'Saa zisizo za kawaida'), l('Clinician access between 00:00 and 05:00', 'Kati ya saa 6 usiku na 11 alfajiri'), l('Flag for review', 'Weka alama kwa ukaguzi')],
  ]

  return (
    <div className="page">
      <PageHead
        eyebrow={l('Administrator view', 'Mwonekano wa msimamizi')}
        title={l('Security monitor', 'Ufuatiliaji wa usalama')}
        lead={l('Detects unusual downloads and repeated access attempts across the website, mobile web and partner access, and keeps a record of who did what and when.', 'Hugundua upakuaji usio wa kawaida na majaribio ya kuingia, na kuweka rekodi ya nani alifanya nini na lini.')}
      />

      <div className="sec-summary">
        <div className="card stat crit"><span className="stat-num">{counts.critical}</span><span>{l('Critical open', 'Hatari zilizo wazi')}</span></div>
        <div className="card stat warn"><span className="stat-num">{counts.warning}</span><span>{l('Warnings open', 'Tahadhari zilizo wazi')}</span></div>
        <div className="card stat"><span className="stat-num">{state.log.length}</span><span>{l('Events logged (sample patient)', 'Matukio yaliyoandikwa')}</span></div>
      </div>

      <ul className="alert-list">
        {open.map((a) => (
          <li key={a.id} className={'card sec-alert lvl-' + a.level + (a.status !== 'open' ? ' closed' : '')}>
            <div className="sec-alert-head">
              <span className={'pill ' + (a.level === 'critical' ? 'crit' : a.level === 'warning' ? 'warn' : 'info')}><Icon name="alert" size={14} /> {a.level}</span>
              <strong>{a.title}</strong>
              <time className="mono small muted">{fmtWhen(a.at, state.lang)}</time>
            </div>
            <p>{a.detail}</p>
            {a.status === 'open' ? (
              <div className="row-gap">
                <button className="btn sm" onClick={() => act(a.id, 'investigating')}>{l('Investigate', 'Chunguza')}</button>
                <button className="btn sm ghost" onClick={() => act(a.id, 'dismissed')}>{l('Mark as expected', 'Weka kama inatarajiwa')}</button>
              </div>
            ) : <span className="small muted">{a.status === 'investigating' ? l('Under investigation', 'Inachunguzwa') : l('Closed as expected activity', 'Imefungwa')}</span>}
          </li>
        ))}
      </ul>

      <section className="section">
        <h2 className="section-title">{l('Detection rules', 'Kanuni za ugunduzi')}</h2>
        <div className="table-wrap card">
          <table className="log">
            <thead><tr><th>{l('Rule', 'Kanuni')}</th><th>{l('Triggers when', 'Inaanzishwa wakati')}</th><th>{l('Response', 'Hatua')}</th></tr></thead>
            <tbody>{rules.map((r) => <tr key={r[0]}><td><strong>{r[0]}</strong></td><td>{r[1]}</td><td>{r[2]}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="note"><Icon name="alert" size={16} /> {l(
          'Monitoring covers every route the service supports: website, mobile web, SMS links and partner access. Screenshots, photos of a screen and other copying outside the service cannot always be detected, and patients are told this when they share.',
          'Ufuatiliaji unashughulikia kila njia ya huduma. Picha za skrini na kunakili nje ya huduma haviwezi kugunduliwa kila mara.'
        )}</p>
      </section>
    </div>
  )
}

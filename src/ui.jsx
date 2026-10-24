import { useEffect, useState } from 'react'
import Icon from './Icon.jsx'

export function PageHead({ eyebrow, title, lead, children }) {
  return (
    <div className="page-head">
      <div className="page-head-text">
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </div>
      {children && <div className="page-head-actions">{children}</div>}
    </div>
  )
}

export function Modal({ title, onClose, children, footer }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [onClose])
  return (
    <div className="modal-scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><Icon name="x" /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  )
}

export function useToast() {
  const [msg, setMsg] = useState(null)
  useEffect(() => {
    if (!msg) return
    const id = setTimeout(() => setMsg(null), 3200)
    return () => clearTimeout(id)
  }, [msg])
  const node = msg ? <div className="toast" role="status"><Icon name="check" size={18} /> {msg}</div> : null
  return [node, setMsg]
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => (
        <button key={t.id} role="tab" aria-selected={value === t.id} className={value === t.id ? 'on' : ''} onClick={() => onChange(t.id)}>
          {t.label}{t.count != null && <span className="count">{t.count}</span>}
        </button>
      ))}
    </div>
  )
}

// Small line chart drawn to one scale. series: [{ values, label, cls }]
export function LineChart({ labels, series, min, max, unit = '', height = 180, ticks }) {
  const W = 560, H = height, L = 38, R = 14, T = 14, B = 26
  const x = (i) => L + (i * (W - L - R)) / (labels.length - 1)
  const y = (v) => T + ((max - v) * (H - T - B)) / (max - min)
  const tickVals = ticks || [min, (min + max) / 2, max]
  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label={series.map((s) => s.label).join(', ')}>
        {tickVals.map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} className="grid" />
            <text x={L - 8} y={y(v) + 4} textAnchor="end" className="axis">{v}{unit}</text>
          </g>
        ))}
        {labels.map((lb, i) => (
          <text key={lb} x={x(i)} y={H - 6} textAnchor="middle" className="axis">{lb}</text>
        ))}
        {series.map((s) => {
          const pts = s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')
          const area = `${x(0)},${y(min)} ${pts} ${x(s.values.length - 1)},${y(min)}`
          const last = s.values.length - 1
          return (
            <g key={s.label} className={'series ' + (s.cls || '')}>
              <polygon points={area} className="area" />
              <polyline points={pts} className="line" />
              {s.values.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r={i === last ? 5 : 2.5} className={i === last ? 'end' : 'pt'} />)}
              <text x={x(last) - 8} y={y(s.values[last]) - 10} textAnchor="end" className="end-label">{s.values[last]}{unit}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export function Meter({ value, max, label }) {
  return (
    <div className="meter" role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label}>
      {Array.from({ length: max }, (_, i) => <span key={i} className={i < value ? 'used' : ''} />)}
    </div>
  )
}

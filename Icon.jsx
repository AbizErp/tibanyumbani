const P = {
  home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M10 21v-6h4v6" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  folder: <><path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2.5h8.5A1.5 1.5 0 0 1 21 9v9.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5Z" /><path d="M12 11v5M9.5 13.5h5" /></>,
  activity: <path d="M3 12h4l2.5-6 5 12 2.5-6H21" />,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.6-3.4 3.2-5.5 6.5-5.5s5.9 2.1 6.5 5.5" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c2 .7 3.2 2.5 3.5 5.2" /></>,
  wallet: <><rect x="3" y="6" width="18" height="14" rx="2" /><path d="M3 10h18" /><circle cx="16.5" cy="15" r="1.2" /><path d="M6 6V4.5h11V6" /></>,
  store: <><path d="M4 9.5 5.5 4h13L20 9.5" /><path d="M4 9.5c0 1.4 1.1 2.5 2.7 2.5s2.6-1.1 2.6-2.5c0 1.4 1.1 2.5 2.7 2.5s2.7-1.1 2.7-2.5c0 1.4 1 2.5 2.6 2.5S20 10.9 20 9.5" /><path d="M5.5 12v8h13v-8M10 20v-4.5h4V20" /></>,
  badge: <><circle cx="12" cy="9" r="5.5" /><path d="m9.7 9 1.6 1.6 3-3.2" /><path d="M8.5 13.8 7.5 21l4.5-2.5 4.5 2.5-1-7.2" /></>,
  shield: <><path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.2 7.5 9.5 4.4-1.3 7.5-4.9 7.5-9.5V6Z" /><path d="m9 12 2.2 2.2L15.5 10" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  bell: <><path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 1.5h-15Z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></>,
  signal: <path d="M4 20v-3M9 20v-7M14 20V9M19 20V4" />,
  knee: <><path d="M9 3c0 4 .5 6.5 2.5 8.5" /><path d="M11.5 11.5c-1.6 2.6-1.8 5.6-1 9.5" /><circle cx="12.6" cy="10.6" r="2.4" /><path d="M14.5 3c.2 3.2-.3 5.4-1 6.2M14.6 12.4c1 1.6 1.4 4.5 1.4 8.6" /></>,
  upload: <><path d="M12 15V4M7.5 8.5 12 4l4.5 4.5" /><path d="M4 15v4.5h16V15" /></>,
  download: <><path d="M12 4v11M7.5 10.5 12 15l4.5-4.5" /><path d="M4 15v4.5h16V15" /></>,
  share: <><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6" /></>,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></>,
  lock: <><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  play: <path d="M8 5.5v13l10.5-6.5Z" />,
  phone: <><rect x="7" y="2.5" width="10" height="19" rx="2" /><path d="M11 18.5h2" /></>,
  pin: <><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.3" /></>,
  star: <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8L3.5 9.7l5.9-.8Z" />,
  video: <><rect x="3" y="6.5" width="12.5" height="11" rx="2" /><path d="m15.5 10.5 5.5-3v9l-5.5-3" /></>,
  car: <><path d="M5 16.5V12l2-5h10l2 5v4.5" /><path d="M3.5 12h17v4.5h-17Z" /><circle cx="7.5" cy="18" r="1.5" /><circle cx="16.5" cy="18" r="1.5" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  alert: <><path d="M12 3.5 2.5 20h19Z" /><path d="M12 10v4.5M12 17.2v.3" /></>,
  file: <><path d="M6 3h8l4 4v14H6Z" /><path d="M14 3v4h4M9 12h6M9 15.5h6" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  chevron: <path d="m9 6 6 6-6 6" />,
  sms: <><path d="M4 5h16v11H9l-4 3.5V16H4Z" /><path d="M8 10.5h.01M12 10.5h.01M16 10.5h.01" /></>,
  heart: <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z" />,
  access: <><circle cx="12" cy="12" r="9.5" /><circle cx="12" cy="7.3" r="1.4" /><path d="M7.5 10.2 12 11l4.5-.8M12 11v3.2l-2.3 4.3M12 14.2l2.3 4.3" /></>,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" /></>,
  volume: <><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4Z" /><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" /></>,
  stop: <rect x="6.5" y="6.5" width="11" height="11" rx="1.5" />,
  pause: <path d="M8.5 5.5v13M15.5 5.5v13" />,
  globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5Z" /></>,
}

export default function Icon({ name, size = 20, className = '' }) {
  return (
    <svg className={'ico ' + className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {P[name] || null}
    </svg>
  )
}

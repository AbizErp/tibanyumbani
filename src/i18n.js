// Interface strings. Clinical instructions use professionally reviewed translations (see data.js).
const DICT = {
  en: {
    'nav.home': 'Home', 'nav.home.short': 'Home',
    'nav.find': 'Find a physiotherapist', 'nav.find.short': 'Find',
    'nav.passport': 'Rehab passport', 'nav.passport.short': 'Passport',
    'nav.coach': 'Exercise coach', 'nav.coach.short': 'Exercises',
    'nav.family': 'Family & caregivers',
    'nav.payments': 'Packages & payment',
    'nav.partners': 'Equipment & centres',
    'nav.physios': 'For physiotherapists',
    'nav.security': 'Security monitor',
    'nav.pro': 'For professionals',
    more: 'More', menu: 'Menu',
    online: 'Online', offline: 'Offline',
    lite: 'Lite mode', 'lite.hint': 'Lite mode turns off animations and decorative graphics to save data',
    alerts: 'Alerts', markRead: 'Mark all read', seeAccessLog: 'Open access history',
    demoNote: 'Prototype with sample data. Changes are saved only in this browser.',
    resetDemo: 'Reset sample data',
    footer: 'TibaNyumbani prototype · Sample data only · Medical records are handled under the Kenya Data Protection Act, 2019.',
  },
  sw: {
    'nav.home': 'Mwanzo', 'nav.home.short': 'Mwanzo',
    'nav.find': 'Tafuta mtaalamu', 'nav.find.short': 'Tafuta',
    'nav.passport': 'Pasipoti ya matibabu', 'nav.passport.short': 'Pasipoti',
    'nav.coach': 'Kocha wa mazoezi', 'nav.coach.short': 'Mazoezi',
    'nav.family': 'Familia na walezi',
    'nav.payments': 'Vifurushi na malipo',
    'nav.partners': 'Vifaa na vituo',
    'nav.physios': 'Kwa wataalamu wa viungo',
    'nav.security': 'Ufuatiliaji wa usalama',
    'nav.pro': 'Kwa wataalamu',
    more: 'Zaidi', menu: 'Menyu',
    online: 'Mtandaoni', offline: 'Nje ya mtandao',
    lite: 'Hali nyepesi', 'lite.hint': 'Hali nyepesi huzima michoro ili kuokoa data',
    alerts: 'Arifa', markRead: 'Weka zote zimesomwa', seeAccessLog: 'Fungua historia ya ufikiaji',
    demoNote: 'Mfano wa majaribio wenye data ya sampuli. Mabadiliko huhifadhiwa kwenye kivinjari hiki pekee.',
    resetDemo: 'Rudisha data ya sampuli',
    footer: 'Mfano wa TibaNyumbani · Data ya sampuli pekee · Rekodi za matibabu hushughulikiwa chini ya Sheria ya Ulinzi wa Data ya Kenya, 2019.',
  },
}

export function translate(lang, key) {
  return (DICT[lang] && DICT[lang][key]) || DICT.en[key] || key
}

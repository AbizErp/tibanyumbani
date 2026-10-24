// Sample data for the prototype. Every person, clinic and record here is invented.

export const PATIENT = {
  name: 'Martin Luther Abisai',
  age: 58,
  town: 'Nakuru',
  lat: -0.3031,
  lng: 36.08,
  phone: '0712 345 678',
  condition: 'Left total knee replacement',
  conditionSw: 'Upasuaji wa kubadilisha goti la kushoto',
  surgeryDate: '2026-08-28',
}

export const SPECIALTIES = [
  { id: 'knee', en: 'Knee & hip', sw: 'Goti na nyonga' },
  { id: 'spine', en: 'Back & neck', sw: 'Mgongo na shingo' },
  { id: 'neuro', en: 'Stroke & neuro', sw: 'Kiharusi na neva' },
  { id: 'sports', en: 'Sports injury', sw: 'Majeraha ya michezo' },
  { id: 'paeds', en: 'Children', sw: 'Watoto' },
  { id: 'elderly', en: 'Older adults', sw: 'Wazee' },
  { id: 'postop', en: 'After surgery', sw: 'Baada ya upasuaji' },
]

export const MODES = [
  { id: 'home', en: 'Home visit', sw: 'Ziara nyumbani' },
  { id: 'clinic', en: 'Clinic session', sw: 'Kliniki' },
  { id: 'video', en: 'Video call', sw: 'Simu ya video' },
]

export const TOWNS = [
  { name: 'Nakuru', lat: -0.3031, lng: 36.08 },
  { name: 'Nairobi', lat: -1.2864, lng: 36.8172 },
  { name: 'Kericho', lat: -0.3677, lng: 35.2831 },
  { name: 'Kisumu', lat: -0.0917, lng: 34.768 },
  { name: 'Eldoret', lat: 0.5143, lng: 35.2698 },
  { name: 'Mombasa', lat: -4.0435, lng: 39.6682 },
  { name: 'Naivasha', lat: -0.7172, lng: 36.431 },
  { name: 'Bomet', lat: -0.7813, lng: 35.3416 },
]

export const THERAPISTS = [
  {
    id: 't1', name: 'Rodney Abisai', initials: 'RA', reg: 'PCK/2014/0412', qual: 'BSc Physiotherapy (Moi)',
    years: 11, specialties: ['knee', 'postop', 'sports'], modes: ['home', 'clinic', 'video'],
    town: 'Nakuru', lat: -0.29, lng: 36.07, fees: { home: 3500, clinic: 2500, video: 1500 },
    rating: 4.9, reviews: 132, languages: ['English', 'Kiswahili', 'Dholuo'], available: true,
    next: 'Tue 27 Oct, 9:00', bio: 'Post-operative knee and hip rehab. Works with orthopaedic teams at two county hospitals.',
    bioSw: 'Urekebishaji wa goti na nyonga baada ya upasuaji.', verified: true,
  },
  {
    id: 't2', name: 'Faith Chebet', initials: 'FC', reg: 'PCK/2017/0788', qual: 'BSc Physiotherapy (KMTC/JKUAT)',
    years: 8, specialties: ['neuro', 'elderly', 'postop'], modes: ['home', 'video'],
    town: 'Kericho', lat: -0.37, lng: 35.29, fees: { home: 3000, clinic: 0, video: 1200 },
    rating: 4.8, reviews: 87, languages: ['English', 'Kiswahili', 'Kalenjin'], available: true,
    next: 'Mon 26 Oct, 14:00', bio: 'Stroke rehabilitation and falls prevention for older adults, at home.',
    bioSw: 'Urekebishaji baada ya kiharusi na kuzuia kuanguka kwa wazee.', verified: true,
  },
  {
    id: 't3', name: 'Kevin Mwangi', initials: 'KM', reg: 'PCK/2012/0219', qual: 'MSc Sports Physiotherapy',
    years: 14, specialties: ['sports', 'knee', 'spine'], modes: ['clinic', 'video', 'home'],
    town: 'Nairobi', lat: -1.29, lng: 36.79, fees: { home: 5000, clinic: 3500, video: 2000 },
    rating: 4.9, reviews: 210, languages: ['English', 'Kiswahili', 'Gikuyu'], available: false,
    next: 'Thu 5 Nov, 10:00', bio: 'ACL reconstruction, runners and return-to-sport testing.',
    bioSw: 'Majeraha ya michezo na kurudi uwanjani.', verified: true,
  },
  {
    id: 't4', name: 'Amina Hassan', initials: 'AH', reg: 'PCK/2019/1043', qual: 'BSc Physiotherapy (UoN)',
    years: 6, specialties: ['paeds', 'neuro'], modes: ['home', 'clinic'],
    town: 'Mombasa', lat: -4.05, lng: 39.67, fees: { home: 3200, clinic: 2200, video: 0 },
    rating: 4.7, reviews: 54, languages: ['English', 'Kiswahili'], available: true,
    next: 'Mon 26 Oct, 11:00', bio: 'Children with cerebral palsy and developmental delay. Home programmes for parents.',
    bioSw: 'Watoto wenye ulemavu wa ubongo na ucheleweshaji wa ukuaji.', verified: true,
  },
  {
    id: 't5', name: 'Dennis Kiprono', initials: 'DK', reg: 'PCK/2016/0655', qual: 'BSc Physiotherapy (Moi)',
    years: 9, specialties: ['spine', 'elderly', 'knee'], modes: ['home', 'clinic', 'video'],
    town: 'Eldoret', lat: 0.51, lng: 35.27, fees: { home: 2800, clinic: 2000, video: 1200 },
    rating: 4.6, reviews: 98, languages: ['English', 'Kiswahili', 'Kalenjin'], available: true,
    next: 'Wed 28 Oct, 8:30', bio: 'Low back pain, arthritis and mobility for farmers and older adults.',
    bioSw: 'Maumivu ya mgongo, baridi yabisi na uwezo wa kutembea.', verified: true,
  },
  {
    id: 't6', name: 'Lucy Wairimu', initials: 'LW', reg: 'PCK/2021/1290', qual: 'Diploma Physiotherapy (KMTC)',
    years: 4, specialties: ['knee', 'elderly', 'postop'], modes: ['home'],
    town: 'Naivasha', lat: -0.72, lng: 36.43, fees: { home: 2500, clinic: 0, video: 0 },
    rating: 4.8, reviews: 41, languages: ['English', 'Kiswahili', 'Gikuyu'], available: true,
    next: 'Tue 27 Oct, 15:00', bio: 'Home visits around Naivasha and Gilgil. Joint replacement aftercare.',
    bioSw: 'Ziara za nyumbani Naivasha na Gilgil.', verified: true,
  },
  {
    id: 't7', name: 'Peter Ouma', initials: 'PO', reg: 'Pending', qual: 'BSc Physiotherapy (Maseno)',
    years: 2, specialties: ['sports', 'spine'], modes: ['clinic', 'video'],
    town: 'Kisumu', lat: -0.1, lng: 34.76, fees: { home: 0, clinic: 1800, video: 1000 },
    rating: 4.5, reviews: 12, languages: ['English', 'Kiswahili', 'Dholuo'], available: true,
    next: 'Mon 26 Oct, 16:00', bio: 'Neck and back pain for office workers. Evening video sessions.',
    bioSw: 'Maumivu ya shingo na mgongo kwa wafanyakazi wa ofisini.', verified: false,
  },
]

export const RECORD_TYPES = {
  xray: { en: 'X-ray report', sw: 'Ripoti ya X-ray', tone: 'blue' },
  mri: { en: 'MRI report', sw: 'Ripoti ya MRI', tone: 'blue' },
  discharge: { en: 'Discharge summary', sw: 'Muhtasari wa kuruhusiwa', tone: 'green' },
  referral: { en: 'Referral', sw: 'Rufaa', tone: 'yellow' },
  notes: { en: 'Treatment notes', sw: 'Maelezo ya matibabu', tone: 'grey' },
}

export const INITIAL_RECORDS = [
  { id: 'r1', type: 'xray', title: 'Left knee X-ray, AP & lateral (pre-op)', date: '2026-07-14', source: 'Rift Valley General Hospital', size: '3.8 MB' },
  { id: 'r2', type: 'mri', title: 'MRI left knee: grade IV osteoarthritis', date: '2026-07-20', source: 'Highlands Imaging Centre', size: '1.2 MB' },
  { id: 'r3', type: 'discharge', title: 'Discharge summary: left TKR', date: '2026-09-01', source: 'Rift Valley General Hospital', size: '240 KB' },
  { id: 'r4', type: 'referral', title: 'Referral to home physiotherapy', date: '2026-09-01', source: 'Dr. S. Njoroge, Orthopaedics', size: '96 KB' },
  { id: 'r5', type: 'xray', title: 'Left knee X-ray (6 weeks post-op)', date: '2026-10-10', source: 'Rift Valley General Hospital', size: '3.1 MB' },
  { id: 'r6', type: 'notes', title: 'Assessment notes: session 5', date: '2026-10-20', source: 'Rodney Abisai, Physiotherapist', size: '58 KB' },
]

export const INITIAL_GRANTS = [
  { id: 'g1', who: 'Rodney Abisai', role: 'Home physiotherapist', records: ['r1', 'r3', 'r4', 'r5', 'r6'], expires: '2026-12-31', download: false, status: 'active' },
  { id: 'g2', who: 'Dr. S. Njoroge', role: 'Orthopaedic surgeon', records: ['r1', 'r2', 'r3', 'r5', 'r6'], expires: '2027-03-01', download: true, status: 'active' },
  { id: 'g3', who: 'Hope Rehabilitation Centre', role: 'Rehab centre', records: ['r3', 'r4'], expires: '2026-09-30', download: false, status: 'expired' },
]

export const INITIAL_LOG = [
  { id: 'l1', at: '2026-10-24T08:12:00', who: 'Rodney Abisai', action: 'viewed', item: 'Assessment notes: session 5', route: 'Web app' },
  { id: 'l2', at: '2026-10-23T19:40:00', who: 'You', action: 'uploaded', item: 'Assessment notes: session 5', route: 'Mobile web' },
  { id: 'l3', at: '2026-10-22T10:05:00', who: 'Dr. S. Njoroge', action: 'downloaded', item: 'Left knee X-ray (6 weeks post-op)', route: 'Web app' },
  { id: 'l4', at: '2026-10-21T14:31:00', who: 'Unknown device', action: 'blocked', item: '4 failed sign-in attempts', route: 'Web app' },
  { id: 'l5', at: '2026-10-11T09:00:00', who: 'You', action: 'shared', item: 'Left knee X-ray (6 weeks post-op) → Dr. S. Njoroge', route: 'Mobile web' },
  { id: 'l6', at: '2026-10-01T00:00:00', who: 'System', action: 'expired', item: 'Access for Hope Rehabilitation Centre', route: 'Automatic' },
]

export const SESSIONS = [
  { date: '2026-09-03', type: 'Initial home assessment', who: 'Rodney Abisai', note: 'Flexion 70°, pain 8/10 on stairs. Walking frame indoors.' },
  { date: '2026-09-10', type: 'Home session 2', who: 'Rodney Abisai', note: 'Started heel slides and quad sets. Ice after exercise.' },
  { date: '2026-09-24', type: 'Home session 3', who: 'Rodney Abisai', note: 'Moved from frame to two crutches. Flexion 90°.' },
  { date: '2026-10-08', type: 'Home session 4', who: 'Rodney Abisai', note: 'Added yellow band knee extension. One crutch outdoors.' },
  { date: '2026-10-20', type: 'Home session 5', who: 'Rodney Abisai', note: 'Flexion 118°. Sit-to-stand without hands. Plan: stairs.' },
]

// Weekly measurements since surgery
export const PROGRESS = {
  weeks: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
  pain: [8, 7, 6, 6, 5, 4, 3, 3], // 0-10 numeric pain rating
  flexion: [70, 82, 90, 98, 105, 112, 118, 122], // knee flexion, degrees
  lefs: [22, 28, 34, 40, 46, 52, 57, 61], // Lower Extremity Functional Scale, 0-80
}

export const EXERCISES = [
  { id: 'e1', name: 'Heel slides', nameSw: 'Kuteleza kisigino', sets: 2, reps: 15, hold: 0, band: null, cue: 'Lie on your back. Slide the heel towards your bottom until you feel a stretch, then slide back.', cueSw: 'Lala chali. Teleza kisigino kuelekea makalio hadi uhisi mvuto, kisha rudisha.', length: '0:42', mb: '1.9' },
  { id: 'e2', name: 'Quad sets', nameSw: 'Kukaza paja', sets: 3, reps: 10, hold: 5, band: null, cue: 'Leg straight. Press the back of the knee into the bed and hold.', cueSw: 'Nyoosha mguu. Bonyeza nyuma ya goti kitandani na ushikilie.', length: '0:35', mb: '1.5' },
  { id: 'e3', name: 'Straight leg raise', nameSw: 'Kuinua mguu ulionyooka', sets: 2, reps: 10, hold: 3, band: null, cue: 'Tighten the thigh first, then lift the straight leg to the height of the other knee.', cueSw: 'Kaza paja kwanza, kisha inua mguu ulionyooka hadi urefu wa goti lingine.', length: '0:48', mb: '2.1' },
  { id: 'e4', name: 'Seated knee extension', nameSw: 'Kunyoosha goti ukiwa umeketi', sets: 3, reps: 12, hold: 2, band: 'yellow', cue: 'Loop the yellow band around the ankle and chair leg. Straighten the knee slowly.', cueSw: 'Funga bendi ya njano kwenye kifundo na mguu wa kiti. Nyoosha goti polepole.', length: '0:51', mb: '2.3' },
  { id: 'e5', name: 'Sit to stand', nameSw: 'Kuketi na kusimama', sets: 2, reps: 8, hold: 0, band: null, cue: 'Use a firm chair. Feet behind knees, lean forward and stand without pushing on your hands.', cueSw: 'Tumia kiti imara. Inama mbele na usimame bila kusukuma kwa mikono.', length: '0:39', mb: '1.7' },
]

export const TUTORIALS = [
  { id: 'u1', title: 'Choosing a resistance band', titleSw: 'Kuchagua bendi ya mazoezi', kind: 'bands', length: '2:10' },
  { id: 'u2', title: 'Putting on a hinged knee brace', titleSw: 'Kuvaa kifaa cha goti', kind: 'brace', length: '1:45' },
  { id: 'u3', title: 'Walking safely with crutches on stairs', titleSw: 'Kutembea na magongo kwenye ngazi', kind: 'crutch', length: '2:30' },
  { id: 'u4', title: 'Using ice packs after exercise', titleSw: 'Kutumia barafu baada ya mazoezi', kind: 'ice', length: '1:20' },
]

export const BANDS = [
  { color: 'yellow', en: 'Yellow · light', sw: 'Njano · nyepesi', kg: '1.3 kg' },
  { color: 'red', en: 'Red · medium', sw: 'Nyekundu · wastani', kg: '1.7 kg' },
  { color: 'green', en: 'Green · heavy', sw: 'Kijani · nzito', kg: '2.1 kg' },
  { color: 'blue', en: 'Blue · extra heavy', sw: 'Bluu · nzito zaidi', kg: '2.6 kg' },
]

export const INITIAL_CAREGIVERS = [
  { id: 'c1', name: 'James Ouma', relation: 'Son', phone: '0722 *** 413', verified: true, scopes: ['appointments', 'reminders', 'documents', 'exercises'], added: '2026-09-02' },
]

export const SCOPES = [
  { id: 'appointments', en: 'Book and change appointments', sw: 'Kupanga na kubadilisha miadi' },
  { id: 'reminders', en: 'Receive reminders by SMS', sw: 'Kupokea vikumbusho kwa SMS' },
  { id: 'documents', en: 'Upload and organise documents', sw: 'Kupakia na kupanga nyaraka' },
  { id: 'exercises', en: 'Track the exercise schedule', sw: 'Kufuatilia ratiba ya mazoezi' },
  { id: 'payments', en: 'Make payments', sw: 'Kufanya malipo' },
  { id: 'view_records', en: 'View medical records and imaging', sw: 'Kuona rekodi za matibabu na picha' },
]

export const PACKAGES = [
  { id: 'p1', name: 'Single home session', nameSw: 'Kipindi kimoja nyumbani', sessions: 1, price: 3500, per: 3500, note: 'Assessment or follow-up, 60 minutes', noteSw: 'Tathmini au ufuatiliaji, dakika 60' },
  { id: 'p2', name: 'Knee & hip recovery', nameSw: 'Urejesho wa goti na nyonga', sessions: 8, price: 24000, per: 3000, note: '8 home sessions over 8–10 weeks, exercise coach included', noteSw: 'Vipindi 8 nyumbani kwa wiki 8–10', popular: true },
  { id: 'p3', name: 'Stroke rehabilitation', nameSw: 'Urekebishaji baada ya kiharusi', sessions: 12, price: 34800, per: 2900, note: '12 home sessions, caregiver training session included', noteSw: 'Vipindi 12 nyumbani, pamoja na mafunzo ya mlezi' },
  { id: 'p4', name: 'Video follow-up', nameSw: 'Ufuatiliaji kwa video', sessions: 1, price: 1500, per: 1500, note: '30-minute review of your home programme', noteSw: 'Dakika 30 za kukagua mazoezi yako' },
]

export const INSURERS = ['SHA (Social Health Authority)', 'Britam', 'Jubilee Health', 'AAR', 'CIC', 'Madison']

export const INITIAL_RECEIPTS = [
  { id: 'SJ84KQ2L7P', date: '2026-09-02', item: 'Knee & hip recovery (8 sessions)', amount: 24000, method: 'M-Pesa' },
]

export const SUPPLIERS = [
  { name: 'Mji Pharmacy & Surgicals', town: 'Nakuru CBD', km: 2.1, stock: ['Resistance bands', 'Knee braces', 'Crutches', 'Ice packs'] },
  { name: 'Afya Mobility Supplies', town: 'Nakuru, Section 58', km: 4.6, stock: ['Walking frames', 'Wheelchairs', 'Commode chairs'] },
  { name: 'Rift Orthopaedic Store', town: 'Naivasha', km: 68, stock: ['Hinged knee braces', 'Back supports', 'Splints'] },
]

export const CENTRES = [
  { name: 'Hope Rehabilitation Centre', town: 'Nakuru', km: 5.4, services: ['Hydrotherapy', 'Gym-based rehab', 'Inpatient stroke rehab'] },
  { name: 'Lakeview Physio Clinic', town: 'Nakuru, Milimani', km: 3.2, services: ['Clinic sessions', 'Sports rehab', 'Shockwave therapy'] },
  { name: 'Highlands Spinal & Neuro Unit', town: 'Kericho', km: 101, services: ['Spinal injury rehab', 'Occupational therapy'] },
]

export const SECURITY_ALERTS = [
  { id: 's1', level: 'critical', at: '2026-10-24T02:14:00', title: 'Bulk download stopped', detail: '14 imaging files requested in 38 seconds by clinician account CL-2291. Downloads paused, patients notified, account locked pending review.' },
  { id: 's2', level: 'warning', at: '2026-10-21T14:31:00', title: 'Repeated sign-in failures', detail: '4 failed attempts on patient account P-10482 from a new device in 3 minutes. One-time PIN required for the next sign-in.' },
  { id: 's3', level: 'warning', at: '2026-10-19T11:02:00', title: 'Access attempt after expiry', detail: 'Hope Rehabilitation Centre tried to open a discharge summary 19 days after access expired. Request refused.' },
  { id: 's4', level: 'info', at: '2026-10-18T09:45:00', title: 'Export by caregiver', detail: 'Caregiver C-118 exported an appointment list (no clinical records). Patient notified by SMS.' },
]

export function distanceKm(a, b) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(x)) * 1.3 // road distance is longer than straight line
}

// KES 40 per km beyond the first 5 km, rounded up to the nearest 50
export function travelFee(km) {
  if (km <= 5) return 0
  return Math.ceil(((km - 5) * 40) / 50) * 50
}

export const kes = (n) => 'KES ' + Math.round(n).toLocaleString('en-KE')

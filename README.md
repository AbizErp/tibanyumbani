# TibaNyumbani — Mobile Physiotherapy (prototype)

Home physiotherapy web app for Kenya: physiotherapist matching, patient-controlled
rehab passport with access control and audit log, home exercise coach, caregiver
access, M-Pesa / insurance packages, partners, physio portfolios and a security monitor.
English + Kiswahili, lite mode for low data.

All data is sample data, stored in the browser (localStorage). Payments, SMS and OTP are simulated.

## Run locally
    npm install
    npm run dev        # http://localhost:5173

## Deploy to Vercel
Option A — GitHub (recommended)
1. Push this folder to a new GitHub repo.
2. vercel.com → Add New → Project → import the repo.
3. Framework preset: Vite (auto-detected). Build: `npm run build`. Output: `dist`. Deploy.

Option B — CLI
    npm i -g vercel
    vercel          # first deploy (preview)
    vercel --prod   # production

## Project map
    src/data.js        sample therapists, records, exercises, packages, fees
    src/store.jsx      app state + localStorage + access-log helper
    src/i18n.js        English / Kiswahili interface strings
    src/pages/*.jsx    one file per screen
    src/index.css      design tokens (light/dark) and all styles

## Next steps for a real launch
- Backend + database (e.g. Supabase or Laravel API) with real auth and OTP
- Encrypted file storage for imaging; server-side audit log
- M-Pesa Daraja STK Push and SMS (Africa's Talking)
- Data Protection Act 2019 compliance: ODPC registration, consent records, DPIA

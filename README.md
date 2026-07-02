# Roll Call — Smart Attendance Management System

A React + Vite + Tailwind prototype of a QR-based attendance system with Student, Faculty, and Admin roles.

## Run locally
npm install
npm run dev

## Build for production
npm run build   # outputs to /dist

## Deploy
- Netlify Drop: drag the /dist folder onto https://app.netlify.com/drop
- Vercel: `vercel --prod` from this folder, or import this repo at vercel.com/new
- GitHub Pages / any static host: serve the /dist folder

## Wiring in real services (currently mocked)
- Auth: replace the Login component's onEnter handler with Firebase Auth (Google provider)
- Data: replace useState stores (students, sessions) with Firestore collections/listeners
- AI warnings: replace the setTimeout template in StudentView.generateWarning with a call to the Gemini API
- QR: swap PseudoQR for `qrcode.react`, and the manual code entry in the Scan tab for `html5-qrcode` camera scanning

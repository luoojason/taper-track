# Launch copy

## r/AntiDepressants

**Title:** I built an open-source symptom tracker for SSRI tapers — no AI advice, no schedule generator, just tracking

---

I've been working on a small open-source tool called taper-track. It's a local-first, privacy-first PWA for people tapering antidepressants under their prescriber's supervision.

**What it does:**
- Lets you enter the taper schedule your prescriber gave you (not generate one — your prescriber does that)
- Daily symptom log: mood, anxiety, sleep, physical symptoms (brain zaps, nausea, etc.), free-text notes
- Trend charts so you can see patterns and share them at your next appointment
- One-tap access to crisis resources (988, Crisis Text Line, Samaritans, etc.)
- PDF export for sharing with your prescriber
- Encrypted local storage — nothing leaves your device

**What it doesn't do:**
- It does not generate or recommend taper schedules
- No AI, no chatbot, no automated advice
- No accounts, no cloud, no telemetry
- No gamification, no streaks, no "keep going!" encouragement

It's open source — you can read every line of code and audit it yourself. I'd rather this be trusted for what it actually does than hyped for what it doesn't.

I've tried to follow Horowitz & Taylor 2019 for SSRI guidance and the JCPG 2025 guidelines for benzos in the deviation warnings (though these are informational only — the prescriber's plan is always authoritative).

Repo: [link]

I'm genuinely open to feedback, especially from people who have been through this process. I know this community has strong feelings about apps that overclaim, and I've tried to build something that doesn't.

---

## r/benzowithdrawal

**Title:** Open-source benzo taper tracker — local-first, no AI advice, crisis resources built in

---

I built a small open-source tool for tracking benzo tapers. It's called taper-track.

It's a PWA (installable on your phone, works offline) that:
- Holds the taper schedule your prescriber gave you
- Logs daily symptoms: mood, anxiety, sleep, physical symptoms
- Shows you trends over time — useful context for prescriber appointments
- Routes to crisis resources immediately if needed (988, Samaritans, Lifeline, findahelpline.com)
- Exports your data as PDF (prescriber-shareable) or encrypted JSON backup

It does NOT generate taper schedules. It does NOT give advice. The Ashton Manual, the JCPG 2025 guideline, and your prescriber are the authorities here — the app just helps you track.

All data stays on your device, encrypted with a passphrase you set. No cloud, no accounts.

Open source so you can audit it: [link]

If you've been through a benzo taper and have thoughts on what would actually be useful, I'd genuinely like to hear them.

---

## r/SurvivingAntidepressants

**Title:** Open-source local-first symptom tracker for tapers — audit the code yourself

---

I've read this subreddit's rules before posting.

I built a small open-source tool called taper-track. It's meant to be a private, local-first symptom tracker for people tapering antidepressants under prescriber supervision.

The tool:
- Accepts the schedule your prescriber gave you (it does NOT generate schedules)
- Logs mood, anxiety, sleep, physical symptoms daily
- Shows trend charts over time
- Surfaces crisis resources immediately when needed
- Exports a PDF for prescriber appointments

It does not recommend doses. It does not give medical advice. It has no AI. The only "intelligence" is a simple trend detection that says things like "your anxiety has trended up for 5 days" — no recommendations attached.

The guideline deviation warnings are based on Horowitz & Taylor 2019 (Lancet Psychiatry) and JCPG 2025. When a schedule entry deviates from those guidelines, the app shows a warning — but the user can still save the entry. The prescriber's plan is authoritative.

All data is stored locally, encrypted with your passphrase. Nothing leaves your device.

Open source: [link] — read it, audit it, open issues.

I'm not affiliated with any pharmaceutical company, app store, or health platform. This is a small personal project.

---

## HN Show HN

**Title:** Show HN: taper-track – open-source local-first PWA for tracking SSRI/benzo tapers

---

taper-track is a privacy-first PWA for people tapering antidepressants or benzodiazepines under prescriber supervision.

**Tech:** SvelteKit + TypeScript, IndexedDB encrypted with WebCrypto AES-GCM (PBKDF2 key derivation), Chart.js for trends, jsPDF for export. No backend — v1 is fully client-side.

**What it does:** Accepts the prescriber's taper schedule, logs daily symptoms (mood/anxiety/sleep/physical), shows trend charts, routes to crisis resources (988 etc.) when flagged, exports PDF for prescriber appointments, and exports/imports encrypted JSON backups.

**What it deliberately doesn't do:** No schedule generator, no AI advice, no telemetry, no accounts required.

Safety is load-bearing here. Crisis detection is mandatory, every schedule entry shows a disclaimer, and ideation → crisis screen routing is tested. Clinical references: Horowitz & Taylor 2019 (Lancet Psychiatry) for SSRIs, JCPG 2025 (PMC12463801) for benzos.

Repo: [link]

Open to feedback, especially on the crypto implementation and the crisis detection logic.

---

## r/selfhosted

**Title:** taper-track — open-source local-first PWA for SSRI/benzo taper tracking, no server required

---

Built a small PWA called taper-track. It's a symptom tracker for people tapering antidepressants or benzodiazepines.

**Local-first:** All data is stored in IndexedDB on the device, encrypted with WebCrypto AES-GCM using a user-set passphrase (PBKDF2, 100k iterations, SHA-256). Nothing is sent anywhere.

**No server required for v1:** It's a static SvelteKit build — deploy to GitHub Pages, Vercel, Netlify, or self-host on any static file server. Works fully offline as a PWA after first load.

**Self-hostable:** Clone the repo, `npm install && npm run build`, serve the `build/` folder. Done.

Features: taper schedule entry, daily symptom log, trend charts, crisis resources, PDF export, encrypted JSON backup/restore.

Open source (MIT): [link]

A v2 optional sync server is in the roadmap for people who want cross-device access, but v1 is fully local.

---

## Tweet thread

**Tweet 1:**
I built taper-track — an open-source, local-first symptom tracker for people tapering SSRIs or benzodiazepines under their prescriber's supervision.

No AI advice. No schedule generator. No telemetry. All data encrypted on your device.

**Tweet 2:**
What it does: follow the taper schedule your prescriber gave you, log daily symptoms (mood/anxiety/sleep/brain zaps/etc.), see trends over time, get to crisis resources in one tap.

What it doesn't do: tell you what dose to take. Your prescriber does that.

**Tweet 3:**
Built on SvelteKit. Encrypted IndexedDB with WebCrypto AES-GCM. Works offline as a PWA. Export as PDF (for your prescriber) or encrypted JSON backup (for you).

No backend in v1. No account required. Nothing leaves your device.

**Tweet 4:**
Guideline references: Horowitz & Taylor 2019 (Lancet Psychiatry) for SSRIs, JCPG 2025 for benzos. The app flags schedule deviations as warnings — but the prescriber's plan is always authoritative.

Crisis routing (988, Samaritans, Lifeline, findahelpline.com) is built in and mandatory.

**Tweet 5:**
Open source under MIT: [link]

If you've been through a taper and want to give feedback, or if you're a clinician who wants to audit the safety logic, I'd genuinely like to hear from you.

taper-track is a tracking tool, not medical advice. If you're in crisis: call or text 988 (US).

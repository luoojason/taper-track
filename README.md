# taper-track

A privacy-first, local-first tool for tracking your prescriber's SSRI or benzodiazepine taper plan.

All data stays on your device. No account required. No cloud. No telemetry. Open source under MIT.

## What this is

A structured way to:
- Follow the taper schedule your prescriber gave you
- Log daily symptoms (mood, sleep, anxiety, physical symptoms)
- Notice patterns (anxiety trending up after a dose reduction)
- Share a clean summary with your prescriber at appointments
- Get to crisis resources in one tap if you need them

## What this is NOT

- **Not a taper schedule generator.** It does not tell you how to taper. Your prescriber does that.
- **Not medical advice.** Nothing in this app should change how you follow your prescriber's plan.
- **Not an AI chatbot.** There is no AI in this app, no chatbot, no automated recommendations.
- **Not a community platform.** There are no shared schedules, no forums, no comparison to other users.
- **Not a diagnostic tool.** It does not diagnose withdrawal, depression, anxiety, or anything else.

## Safety

taper-track is a tracking tool, not medical advice.

If you are in crisis, call or text **988** (US) or your local emergency number.

See [DISCLAIMER.md](DISCLAIMER.md) for the full safety statement.

## Privacy

All your data is stored locally in an encrypted database on your device. We have no servers. We collect nothing. See [PRIVACY.md](PRIVACY.md) for full details.

## Clinical references

The guideline validation logic draws on published clinical literature. See [CLINICAL_REFERENCES.md](CLINICAL_REFERENCES.md).

## Tech stack

- SvelteKit + TypeScript
- IndexedDB (via `idb`), encrypted with WebCrypto AES-GCM
- Chart.js for trend charts
- jsPDF for prescriber-shareable export
- PWA — installable on iOS/Android, works fully offline

## Contributing

Issues and PRs welcome. Please read the safety constraints in the codebase before proposing new features — some things are deliberately out of scope.

## License

MIT. See [LICENSE](LICENSE).

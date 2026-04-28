# Privacy Policy

taper-track stores all your data locally on your device. There are no servers, no accounts, and no way to access your information.

## What is stored

- Your onboarding information: medication class, starting dose, taper start date, prescriber end date or target dose
- Your prescriber's taper schedule (as you entered it)
- Your daily symptom logs: sleep hours, mood, anxiety, physical symptoms, free-text notes
- Your country/region preference (for crisis resources)

**Ideation responses:** The app routes you to crisis resources if you answer yes to the crisis question, but does not store a "yes" answer in the symptom log. Only the fact that you submitted a log is stored, not the ideation flag itself.

## Where it is stored

Everything is stored in your browser's IndexedDB database, on your device only. The data is encrypted using AES-GCM (WebCrypto API) with a key derived from the passphrase you set during onboarding via PBKDF2 (100,000 iterations, SHA-256). Without your passphrase, the data cannot be read.

## What is NOT collected

- No usage analytics
- No telemetry
- No error reporting to external services
- No crash logs sent anywhere
- No identifiers of any kind
- No IP addresses
- Nothing leaves your device unless you explicitly use the Export feature

## Export

The Export feature lets you:
- Download a PDF summary for your prescriber (unencrypted — treat it like a medical document)
- Download an encrypted JSON backup (encrypted with your passphrase — safe to store anywhere)

Exports are generated entirely on your device. Nothing is uploaded.

## Clearing your data

You can clear all data from the Export page. This is irreversible unless you have an encrypted JSON backup.

## Open source

The full source code is available on GitHub. Any user or clinician can verify these privacy claims by reading the code.

## No backend

taper-track v1 has no backend server. Your data never leaves your device.

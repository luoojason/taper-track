import { getDB } from './index.js';
import { encryptData, decryptData } from './crypto.js';
import type { OnboardingData, ScheduleEntry, SymptomLog } from '../types.js';

let passphrase = '';

export function setPassphrase(p: string): void {
	passphrase = p;
}

export function getPassphrase(): string {
	return passphrase;
}

export async function saveOnboarding(data: OnboardingData): Promise<void> {
	const db = await getDB();
	const encrypted = await encryptData(passphrase, JSON.stringify(data));
	await db.put('onboarding', encrypted, 'onboarding');
}

export async function getOnboarding(): Promise<OnboardingData | null> {
	const db = await getDB();
	const encrypted = await db.get('onboarding', 'onboarding');
	if (!encrypted) return null;
	const json = await decryptData(passphrase, encrypted);
	return JSON.parse(json) as OnboardingData;
}

export async function saveScheduleEntry(entry: ScheduleEntry): Promise<void> {
	const db = await getDB();
	const encrypted = await encryptData(passphrase, JSON.stringify(entry));
	await db.put('schedule_entries', encrypted, entry.id);
}

export async function getScheduleEntries(): Promise<ScheduleEntry[]> {
	const db = await getDB();
	const all = await db.getAll('schedule_entries');
	const decrypted = await Promise.all(
		all.map(async (enc) => JSON.parse(await decryptData(passphrase, enc)) as ScheduleEntry)
	);
	return decrypted.sort((a, b) => a.changeDate.localeCompare(b.changeDate));
}

export async function deleteScheduleEntry(id: string): Promise<void> {
	const db = await getDB();
	await db.delete('schedule_entries', id);
}

export async function saveSymptomLog(log: SymptomLog): Promise<void> {
	const db = await getDB();
	const encrypted = await encryptData(passphrase, JSON.stringify(log));
	await db.put('symptom_logs', encrypted, log.id);
}

export async function getSymptomLogs(): Promise<SymptomLog[]> {
	const db = await getDB();
	const all = await db.getAll('symptom_logs');
	const decrypted = await Promise.all(
		all.map(async (enc) => JSON.parse(await decryptData(passphrase, enc)) as SymptomLog)
	);
	return decrypted.sort((a, b) => a.date.localeCompare(b.date));
}

export async function clearAllData(): Promise<void> {
	const db = await getDB();
	await db.clear('onboarding');
	await db.clear('schedule_entries');
	await db.clear('symptom_logs');
}

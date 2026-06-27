import { getDB } from './index.js';
import { encryptData, decryptData } from './crypto.js';
import type { OnboardingData, ScheduleEntry, SymptomLog } from '../types.js';

const SESSION_KEY = 'tt_pp';
let passphrase = '';

export function setPassphrase(p: string): void {
	passphrase = p;
	if (typeof sessionStorage !== 'undefined') {
		if (p) sessionStorage.setItem(SESSION_KEY, p);
		else sessionStorage.removeItem(SESSION_KEY);
	}
}

export function getPassphrase(): string {
	if (!passphrase && typeof sessionStorage !== 'undefined') {
		passphrase = sessionStorage.getItem(SESSION_KEY) ?? '';
	}
	return passphrase;
}

export async function saveOnboarding(data: OnboardingData): Promise<void> {
	const db = await getDB();
	const encrypted = await encryptData(getPassphrase(), JSON.stringify(data));
	await db.put('onboarding', encrypted, 'onboarding');
}

export async function getOnboarding(): Promise<OnboardingData | null> {
	const db = await getDB();
	const encrypted = await db.get('onboarding', 'onboarding');
	if (!encrypted) return null;
	const json = await decryptData(getPassphrase(), encrypted);
	return JSON.parse(json) as OnboardingData;
}

export async function saveScheduleEntry(entry: ScheduleEntry): Promise<void> {
	const db = await getDB();
	const encrypted = await encryptData(getPassphrase(), JSON.stringify(entry));
	await db.put('schedule_entries', encrypted, entry.id);
}

export async function getScheduleEntries(): Promise<ScheduleEntry[]> {
	const db = await getDB();
	const all = await db.getAll('schedule_entries');
	const decrypted = await Promise.all(
		all.map(async (enc) => JSON.parse(await decryptData(getPassphrase(), enc)) as ScheduleEntry)
	);
	return decrypted.sort((a, b) => a.changeDate.localeCompare(b.changeDate));
}

export async function deleteScheduleEntry(id: string): Promise<void> {
	const db = await getDB();
	await db.delete('schedule_entries', id);
}

export async function saveSymptomLog(log: SymptomLog): Promise<void> {
	const db = await getDB();
	const encrypted = await encryptData(getPassphrase(), JSON.stringify(log));
	await db.put('symptom_logs', encrypted, log.id);
}

export async function getSymptomLogs(): Promise<SymptomLog[]> {
	const db = await getDB();
	const all = await db.getAll('symptom_logs');
	const decrypted = await Promise.all(
		all.map(async (enc) => JSON.parse(await decryptData(getPassphrase(), enc)) as SymptomLog)
	);
	return decrypted.sort((a, b) => a.date.localeCompare(b.date));
}

export async function clearAllData(): Promise<void> {
	const db = await getDB();
	await db.clear('onboarding');
	await db.clear('schedule_entries');
	await db.clear('symptom_logs');
}

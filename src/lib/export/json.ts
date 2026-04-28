import { encryptData, decryptData } from '../db/crypto.js';
import { getOnboarding, getScheduleEntries, getSymptomLogs, clearAllData, saveOnboarding, saveScheduleEntry, saveSymptomLog } from '../db/store.js';
import type { ExportData } from '../types.js';

export async function exportEncryptedJSON(passphrase: string): Promise<string> {
	const [onboarding, scheduleEntries, symptomLogs] = await Promise.all([
		getOnboarding(),
		getScheduleEntries(),
		getSymptomLogs()
	]);

	const data: ExportData = {
		version: '1',
		onboarding,
		scheduleEntries,
		symptomLogs,
		exportedAt: new Date().toISOString()
	};

	return encryptData(passphrase, JSON.stringify(data));
}

export async function importEncryptedJSON(passphrase: string, encrypted: string): Promise<void> {
	const json = await decryptData(passphrase, encrypted);
	const data = JSON.parse(json) as ExportData;

	await clearAllData();

	if (data.onboarding) {
		await saveOnboarding(data.onboarding);
	}
	for (const entry of data.scheduleEntries) {
		await saveScheduleEntry(entry);
	}
	for (const log of data.symptomLogs) {
		await saveSymptomLog(log);
	}
}

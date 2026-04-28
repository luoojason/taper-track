import { describe, it, expect } from 'vitest';
import { encryptData, decryptData } from '../../src/lib/db/crypto.js';
import type { SymptomLog, OnboardingData, ScheduleEntry, ExportData } from '../../src/lib/types.js';

// Tests the serialisation layer directly — IndexedDB is not available in Node.

function makeLog(i: number): SymptomLog {
	return {
		id: `log-${i}`,
		date: `2026-0${i}-01`,
		sleepHours: 7,
		mood: 6,
		anxiety: 4,
		physicalSymptoms: ['nausea'],
		notes: `note ${i}`,
		createdAt: new Date().toISOString()
	};
}

const PASSPHRASE = 'test-export-passphrase-123';

describe('JSON export round-trip', () => {
	it('serialises ExportData, encrypts, decrypts, and parses back identically', async () => {
		const logs = [makeLog(1), makeLog(2), makeLog(3)];
		const data: ExportData = {
			version: '1',
			onboarding: null,
			scheduleEntries: [],
			symptomLogs: logs,
			exportedAt: '2026-04-27T00:00:00.000Z'
		};

		const encrypted = await encryptData(PASSPHRASE, JSON.stringify(data));
		const decrypted = await decryptData(PASSPHRASE, encrypted);
		const restored = JSON.parse(decrypted) as ExportData;

		expect(restored.version).toBe('1');
		expect(restored.symptomLogs).toHaveLength(3);
		expect(restored.symptomLogs[0]).toEqual(logs[0]);
		expect(restored.symptomLogs[1]).toEqual(logs[1]);
		expect(restored.symptomLogs[2]).toEqual(logs[2]);
	});

	it('throws when decrypted with wrong passphrase', async () => {
		const data: ExportData = {
			version: '1',
			onboarding: null,
			scheduleEntries: [],
			symptomLogs: [makeLog(1)],
			exportedAt: new Date().toISOString()
		};
		const encrypted = await encryptData(PASSPHRASE, JSON.stringify(data));
		await expect(decryptData('wrong-passphrase', encrypted)).rejects.toThrow();
	});

	it('preserves schedule entries in round-trip', async () => {
		const entry: ScheduleEntry = {
			id: 'e1',
			fromDose: 20,
			toDose: 18,
			changeDate: '2026-03-01',
			createdAt: new Date().toISOString()
		};
		const data: ExportData = {
			version: '1',
			onboarding: null,
			scheduleEntries: [entry],
			symptomLogs: [],
			exportedAt: new Date().toISOString()
		};
		const encrypted = await encryptData(PASSPHRASE, JSON.stringify(data));
		const restored = JSON.parse(await decryptData(PASSPHRASE, encrypted)) as ExportData;
		expect(restored.scheduleEntries[0]).toEqual(entry);
	});
});

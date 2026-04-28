import { describe, it, expect } from 'vitest';
import { detectTrend } from '../../src/lib/guidelines/patterns.js';
import type { SymptomLog } from '../../src/lib/types.js';

function makeLog(date: string, mood: number, anxiety: number, sleepHours: number): SymptomLog {
	return {
		id: date,
		date,
		mood,
		anxiety,
		sleepHours,
		physicalSymptoms: [],
		notes: '',
		createdAt: new Date().toISOString()
	};
}

describe('detectTrend', () => {
	it('detects upward anxiety trend over 5 days', () => {
		const logs = [
			makeLog('2026-01-01', 6, 6, 7),
			makeLog('2026-01-02', 6, 7, 7),
			makeLog('2026-01-03', 5, 7, 6),
			makeLog('2026-01-04', 5, 8, 6),
			makeLog('2026-01-05', 5, 8, 6)
		];
		const result = detectTrend(logs, 'anxiety', 5);
		expect(result.trending).toBe('up');
		expect(result.message).not.toBeNull();
	});

	it('returns stable when fewer than required days', () => {
		const logs = [makeLog('2026-01-01', 6, 5, 7), makeLog('2026-01-02', 6, 5, 7)];
		const result = detectTrend(logs, 'anxiety', 5);
		expect(result.trending).toBe('stable');
		expect(result.message).toBeNull();
	});

	it('detects downward mood trend', () => {
		const logs = [
			makeLog('2026-01-01', 8, 3, 7),
			makeLog('2026-01-02', 7, 3, 7),
			makeLog('2026-01-03', 6, 4, 7),
			makeLog('2026-01-04', 5, 4, 6),
			makeLog('2026-01-05', 4, 5, 6)
		];
		const result = detectTrend(logs, 'mood', 5);
		expect(result.trending).toBe('down');
	});

	it('returns stable for flat series', () => {
		const logs = [
			makeLog('2026-01-01', 6, 5, 7),
			makeLog('2026-01-02', 6, 5, 7),
			makeLog('2026-01-03', 6, 5, 7),
			makeLog('2026-01-04', 6, 5, 7),
			makeLog('2026-01-05', 6, 5, 7)
		];
		const result = detectTrend(logs, 'anxiety', 5);
		expect(result.trending).toBe('stable');
		expect(result.message).toBeNull();
	});

	it('uses only the last N logs from a longer series', () => {
		const logs = [
			makeLog('2026-01-01', 6, 9, 4),
			makeLog('2026-01-02', 6, 9, 4),
			makeLog('2026-01-03', 6, 5, 7),
			makeLog('2026-01-04', 6, 5, 7),
			makeLog('2026-01-05', 6, 5, 7),
			makeLog('2026-01-06', 6, 5, 7),
			makeLog('2026-01-07', 6, 5, 7)
		];
		const result = detectTrend(logs, 'anxiety', 5);
		// Last 5 are all flat at 5 — should be stable
		expect(result.trending).toBe('stable');
	});
});

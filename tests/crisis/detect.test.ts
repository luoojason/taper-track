import { describe, it, expect } from 'vitest';
import { isCrisis, hasIdeation, shouldShowHoldNudge } from '../../src/lib/crisis/detect.js';
import type { SymptomLog } from '../../src/lib/types.js';

function makeLog(overrides: Partial<SymptomLog & { ideation: boolean }> = {}): SymptomLog & { ideation: boolean } {
	return {
		id: '1',
		date: '2026-01-01',
		sleepHours: 7,
		mood: 6,
		anxiety: 4,
		physicalSymptoms: [],
		notes: '',
		createdAt: new Date().toISOString(),
		ideation: false,
		...overrides
	};
}

describe('isCrisis', () => {
	it('returns true when all crisis conditions are met', () => {
		expect(isCrisis(makeLog({ mood: 2, sleepHours: 2, anxiety: 9, ideation: true }))).toBe(true);
	});

	it('returns false when ideation is false even if other scores are severe', () => {
		expect(isCrisis(makeLog({ mood: 2, sleepHours: 2, anxiety: 9, ideation: false }))).toBe(false);
	});

	it('returns false when mood is above threshold', () => {
		expect(isCrisis(makeLog({ mood: 4, sleepHours: 2, anxiety: 9, ideation: true }))).toBe(false);
	});

	it('returns false when sleep is not below threshold', () => {
		expect(isCrisis(makeLog({ mood: 2, sleepHours: 3, anxiety: 9, ideation: true }))).toBe(false);
	});

	it('returns false when anxiety is below threshold', () => {
		expect(isCrisis(makeLog({ mood: 2, sleepHours: 2, anxiety: 7, ideation: true }))).toBe(false);
	});
});

describe('hasIdeation', () => {
	it('returns true when ideation is true regardless of other scores', () => {
		expect(hasIdeation({ ideation: true })).toBe(true);
	});

	it('returns false when ideation is false', () => {
		expect(hasIdeation({ ideation: false })).toBe(false);
	});

	it('returns true for high-mood log with ideation', () => {
		expect(hasIdeation(makeLog({ mood: 7, sleepHours: 7, anxiety: 2, ideation: true }))).toBe(true);
	});
});

describe('shouldShowHoldNudge', () => {
	it('returns false when fewer than 3 logs', () => {
		const logs = [makeLog({ mood: 2, anxiety: 8 })];
		expect(shouldShowHoldNudge(logs)).toBe(false);
	});

	it('returns true when last 3 logs all exceed thresholds', () => {
		const logs = [
			makeLog({ mood: 2, anxiety: 8 }),
			makeLog({ mood: 3, anxiety: 9 }),
			makeLog({ mood: 2, anxiety: 8 })
		];
		expect(shouldShowHoldNudge(logs)).toBe(true);
	});

	it('returns false when recent logs are within thresholds', () => {
		const logs = [
			makeLog({ mood: 6, anxiety: 4 }),
			makeLog({ mood: 7, anxiety: 3 }),
			makeLog({ mood: 5, anxiety: 5 })
		];
		expect(shouldShowHoldNudge(logs)).toBe(false);
	});
});

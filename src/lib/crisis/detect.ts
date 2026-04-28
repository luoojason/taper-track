import type { SymptomLog } from '../types.js';

export function hasIdeation(log: { ideation: boolean }): boolean {
	return log.ideation === true;
}

export function isCrisis(log: Pick<SymptomLog, 'mood' | 'anxiety' | 'sleepHours'> & { ideation: boolean }): boolean {
	return log.mood <= 3 && log.sleepHours < 3 && log.anxiety >= 8 && log.ideation === true;
}

export function shouldShowHoldNudge(
	logs: SymptomLog[],
	thresholds: { moodBelow: number; anxietyAbove: number } = { moodBelow: 4, anxietyAbove: 7 }
): boolean {
	if (logs.length < 3) return false;
	const recent = logs.slice(-3);
	return recent.every((l) => l.mood < thresholds.moodBelow || l.anxiety > thresholds.anxietyAbove);
}

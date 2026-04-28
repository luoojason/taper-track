import type { MedicationClass } from '../types.js';

export interface ValidationResult {
	warning: string | null;
}

const MAX_REDUCTION_PCT = 25;
const MIN_INTERVAL_DAYS = 14;

export function validateStep(
	fromDose: number,
	toDose: number,
	daysSinceLast: number,
	_medicationClass: MedicationClass
): ValidationResult {
	if (fromDose <= 0 || toDose < 0) return { warning: null };

	const reductionPct = ((fromDose - toDose) / fromDose) * 100;
	const warnings: string[] = [];

	if (reductionPct > MAX_REDUCTION_PCT) {
		warnings.push(
			`This reduction is ${reductionPct.toFixed(0)}% of the current dose. Published guidelines suggest reductions of 5–10% per step to minimise withdrawal symptoms (Horowitz & Taylor 2019).`
		);
	}

	if (daysSinceLast < MIN_INTERVAL_DAYS && daysSinceLast > 0) {
		warnings.push(
			`This step is ${daysSinceLast} days after the previous one. Published guidelines suggest waiting at least 2–4 weeks between reductions.`
		);
	}

	return { warning: warnings.length > 0 ? warnings.join(' ') : null };
}

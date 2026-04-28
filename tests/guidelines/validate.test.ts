import { describe, it, expect } from 'vitest';
import { validateStep } from '../../src/lib/guidelines/validate.js';

describe('validateStep', () => {
	it('warns when reduction exceeds 25%', () => {
		// 20mg → 14mg = 30% reduction, 14 days
		const result = validateStep(20, 14, 14, 'SSRI');
		expect(result.warning).not.toBeNull();
		expect(result.warning).toContain('30%');
	});

	it('returns no warning for 10% reduction over 14 days', () => {
		// 20mg → 18mg = 10% reduction, 14 days
		const result = validateStep(20, 18, 14, 'SSRI');
		expect(result.warning).toBeNull();
	});

	it('warns when interval is less than 14 days', () => {
		// 20mg → 18mg = 10%, but only 7 days
		const result = validateStep(20, 18, 7, 'SSRI');
		expect(result.warning).not.toBeNull();
		expect(result.warning).toContain('7 days');
	});

	it('warns for both rapid reduction and short interval combined', () => {
		// 20mg → 12mg = 40%, 5 days — both violations
		const result = validateStep(20, 12, 5, 'benzodiazepine');
		expect(result.warning).not.toBeNull();
	});

	it('returns no warning when interval is zero (first step)', () => {
		const result = validateStep(20, 18, 0, 'SSRI');
		expect(result.warning).toBeNull();
	});

	it('returns no warning for exact 25% boundary reduction', () => {
		// 20mg → 15mg = exactly 25%, not over
		const result = validateStep(20, 15, 14, 'SSRI');
		expect(result.warning).toBeNull();
	});
});

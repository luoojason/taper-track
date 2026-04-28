import type { SymptomLog } from '../types.js';

export type TrendDirection = 'up' | 'down' | 'stable';

export interface TrendResult {
	trending: TrendDirection;
	message: string | null;
}

function slope(values: number[]): number {
	const n = values.length;
	if (n < 2) return 0;
	const xMean = (n - 1) / 2;
	const yMean = values.reduce((a, b) => a + b, 0) / n;
	let num = 0;
	let den = 0;
	for (let i = 0; i < n; i++) {
		num += (i - xMean) * (values[i] - yMean);
		den += (i - xMean) ** 2;
	}
	return den === 0 ? 0 : num / den;
}

export function detectTrend(
	logs: SymptomLog[],
	metric: 'mood' | 'anxiety' | 'sleepHours',
	days = 5
): TrendResult {
	if (logs.length < days) return { trending: 'stable', message: null };

	const recent = logs.slice(-days);
	const values = recent.map((l) => l[metric]);
	const m = slope(values);
	const THRESHOLD = 0.15;

	if (m > THRESHOLD) {
		const message =
			metric === 'anxiety'
				? `Your anxiety has trended up for ${days} days.`
				: metric === 'mood'
					? `Your mood has trended up for ${days} days.`
					: `Your sleep has been improving for ${days} days.`;
		return { trending: 'up', message };
	}

	if (m < -THRESHOLD) {
		const message =
			metric === 'anxiety'
				? `Your anxiety has been lower for ${days} days.`
				: metric === 'mood'
					? `Your mood has trended down for ${days} days.`
					: `Your sleep has been shorter for ${days} days.`;
		return { trending: 'down', message };
	}

	return { trending: 'stable', message: null };
}

<script lang="ts">
	import { onMount } from 'svelte';
	import { getSymptomLogs, getScheduleEntries, getOnboarding } from '$lib/db/store.js';
	import { detectTrend } from '$lib/guidelines/patterns.js';
	import { shouldShowHoldNudge } from '$lib/crisis/detect.js';
	import type { SymptomLog, ScheduleEntry } from '$lib/types.js';

	let logs: SymptomLog[] = [];
	let schedule: ScheduleEntry[] = [];
	let loaded = false;
	let hasOnboarding = false;
	let canvas: HTMLCanvasElement;

	type TrendAlert = { message: string; direction: 'up' | 'down' };
	let trendAlerts: TrendAlert[] = [];
	let showHoldNudge = false;

	onMount(async () => {
		try {
			const ob = await getOnboarding();
			hasOnboarding = !!ob;
			logs = await getSymptomLogs();
			schedule = await getScheduleEntries();
		} catch { /* DB not ready */ }

		const moodT = detectTrend(logs, 'mood', 5);
		const anxT = detectTrend(logs, 'anxiety', 5);
		const sleepT = detectTrend(logs, 'sleepHours', 5);

		trendAlerts = [
			moodT.message ? { message: moodT.message, direction: moodT.trending as 'up' | 'down' } : null,
			anxT.message ? { message: anxT.message, direction: anxT.trending as 'up' | 'down' } : null,
			sleepT.message ? { message: sleepT.message, direction: sleepT.trending as 'up' | 'down' } : null
		].filter((a): a is TrendAlert => a !== null);

		showHoldNudge = shouldShowHoldNudge(logs);
		loaded = true;

		if (logs.length >= 2) {
			const { Chart, registerables } = await import('chart.js');
			Chart.register(...registerables);
			const labels = logs.map((l) => l.date);
			const doseChangeDates = new Set(schedule.map((e) => e.changeDate));
			new Chart(canvas, {
				type: 'line',
				data: {
					labels,
					datasets: [
						{ label: 'Mood', data: logs.map((l) => l.mood), borderColor: '#4a6741', backgroundColor: 'transparent', tension: 0.3, pointRadius: labels.map((d) => (doseChangeDates.has(d) ? 6 : 3)), pointStyle: labels.map((d) => (doseChangeDates.has(d) ? 'triangle' : 'circle')) },
						{ label: 'Anxiety', data: logs.map((l) => l.anxiety), borderColor: '#d97706', backgroundColor: 'transparent', tension: 0.3, pointRadius: 3 },
						{ label: 'Sleep (h)', data: logs.map((l) => l.sleepHours), borderColor: '#6b6560', backgroundColor: 'transparent', tension: 0.3, pointRadius: 3 }
					]
				},
				options: {
					responsive: true,
					plugins: { legend: { position: 'bottom' }, tooltip: { mode: 'index' } },
					scales: { x: { ticks: { maxTicksLimit: 10 } }, y: { min: 0, max: 12 } }
				}
			});
		}
	});

	$: recentLogs = logs.slice(-14).slice().reverse();
</script>

<svelte:head><title>Dashboard — taper-track</title></svelte:head>

<div class="dashboard">
	<h1>Dashboard</h1>

	{#if !loaded}
		<p class="muted">Loading…</p>
	{:else if !hasOnboarding}
		<div class="empty-state">
			<p>Welcome. Set up your taper to get started.</p>
			<a href="/onboarding" class="btn-primary">Set up</a>
		</div>
	{:else if logs.length === 0}
		<div class="empty-state">
			<p>No symptom logs yet.</p>
			<a href="/log" class="btn-primary">Log today</a>
		</div>
	{:else}
		{#if showHoldNudge}
			<div class="hold-nudge">
				<strong>Symptoms are higher than your baseline.</strong>
				Many people pause their taper at this point and consult their prescriber.
				Consider whether to reach out.
			</div>
		{/if}

		{#if trendAlerts.length > 0}
			<div class="trend-alerts">
				{#each trendAlerts as alert}
					<div class="trend-card" class:trend-concern={alert.direction === 'up'}>{alert.message}</div>
				{/each}
			</div>
		{/if}

		<div class="chart-section">
			<h2>Trends <span class="chart-legend">(▲ = dose change day)</span></h2>
			<div class="chart-wrap">
				<canvas bind:this={canvas}></canvas>
			</div>
		</div>

		<div class="recent-section">
			<h2>Recent logs</h2>
			<div class="log-list">
				{#each recentLogs as log}
					<div class="log-row">
						<span class="log-date">{log.date}</span>
						<span class="log-stat">Mood {log.mood}/10</span>
						<span class="log-stat">Anxiety {log.anxiety}/10</span>
						<span class="log-stat">Sleep {log.sleepHours}h</span>
						{#if log.physicalSymptoms.length > 0}
							<span class="log-physical">{log.physicalSymptoms.join(', ')}</span>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<div class="quick-actions">
		<a href="/log" class="btn-primary">Log today</a>
		<a href="/schedule" class="btn-secondary">Schedule</a>
		<a href="/export" class="btn-secondary">Export</a>
	</div>
</div>

<style>
	.dashboard { max-width: 800px; }
	h1 { color: var(--color-primary); }
	h2 { font-size: 1rem; font-weight: 600; margin-bottom: var(--space-3); }
	.muted { color: var(--color-text-muted); }
	.empty-state { padding: var(--space-8) 0; }
	.empty-state p { color: var(--color-text-muted); margin-bottom: var(--space-4); }
	.hold-nudge {
		background: var(--color-warning-bg); border: 1px solid var(--color-warning-border);
		border-radius: var(--radius); padding: var(--space-4); margin-bottom: var(--space-6); font-size: 0.9rem;
	}
	.trend-alerts { display: flex; flex-direction: column; gap: var(--space-2); margin-bottom: var(--space-6); }
	.trend-card {
		background: white; border: 1px solid var(--color-border);
		border-left: 3px solid var(--color-primary);
		border-radius: var(--radius); padding: var(--space-3) var(--space-4); font-size: 0.9rem;
	}
	.trend-card.trend-concern { border-left-color: #d97706; }
	.chart-section { margin-bottom: var(--space-8); }
	.chart-legend { font-size: 0.75rem; font-weight: 400; color: var(--color-text-muted); }
	.chart-wrap { background: white; border: 1px solid var(--color-border); border-radius: var(--radius); padding: var(--space-4); }
	.recent-section { margin-bottom: var(--space-8); }
	.log-list { display: flex; flex-direction: column; gap: var(--space-2); }
	.log-row {
		display: flex; flex-wrap: wrap; gap: var(--space-3); align-items: center;
		background: white; border: 1px solid var(--color-border);
		border-radius: var(--radius); padding: var(--space-3); font-size: 0.85rem;
	}
	.log-date { font-weight: 500; min-width: 100px; }
	.log-stat { color: var(--color-text-muted); }
	.log-physical { color: var(--color-text-muted); font-size: 0.8rem; }
	.quick-actions { display: flex; gap: var(--space-3); flex-wrap: wrap; }
	.btn-primary {
		background: var(--color-primary); color: white; border: none;
		padding: var(--space-3) var(--space-6); border-radius: var(--radius);
		cursor: pointer; font-size: 1rem; font-weight: 500; text-decoration: none; display: inline-block;
	}
	.btn-secondary {
		background: white; color: var(--color-text); border: 1px solid var(--color-border);
		padding: var(--space-3) var(--space-6); border-radius: var(--radius);
		text-decoration: none; display: inline-block; font-size: 1rem;
	}
</style>

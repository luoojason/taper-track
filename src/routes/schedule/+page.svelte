<script lang="ts">
	import { onMount } from 'svelte';
	import { saveScheduleEntry, getScheduleEntries, deleteScheduleEntry, getOnboarding } from '$lib/db/store.js';
	import { validateStep } from '$lib/guidelines/validate.js';
	import type { ScheduleEntry, MedicationClass } from '$lib/types.js';

	let entries: ScheduleEntry[] = [];
	let medClass: MedicationClass = 'SSRI';
	let doseUnit = 'mg';
	let fromDose = '';
	let toDose = '';
	let changeDate = '';
	let entryNotes = '';
	let warning = '';
	let saving = false;

	const DISCLAIMER = 'This tool tracks the plan you and your prescriber agreed on. Do not change your dose without consulting your prescriber. Stopping psychiatric medication suddenly can cause serious harm, including seizures (benzodiazepines) or severe withdrawal (SSRIs).';

	onMount(async () => {
		try {
			const ob = await getOnboarding();
			if (ob) { medClass = ob.medicationClass; doseUnit = ob.doseUnit; }
			entries = await getScheduleEntries();
		} catch { /* DB not ready */ }
	});

	function checkWarning() {
		if (!fromDose || !toDose || !changeDate) { warning = ''; return; }
		const from = parseFloat(fromDose);
		const to = parseFloat(toDose);
		let days = 0;
		if (entries.length > 0) {
			const last = new Date(entries[entries.length - 1].changeDate);
			days = Math.round((new Date(changeDate).getTime() - last.getTime()) / 86400000);
		}
		warning = validateStep(from, to, days, medClass).warning ?? '';
	}

	$: fromDose, toDose, changeDate, checkWarning();

	async function addEntry() {
		if (!fromDose || !toDose || !changeDate) return;
		saving = true;
		try {
			const entry: ScheduleEntry = {
				id: crypto.randomUUID(),
				fromDose: parseFloat(fromDose),
				toDose: parseFloat(toDose),
				changeDate,
				notes: entryNotes || undefined,
				createdAt: new Date().toISOString()
			};
			await saveScheduleEntry(entry);
			entries = await getScheduleEntries();
			fromDose = ''; toDose = ''; changeDate = ''; entryNotes = ''; warning = '';
		} finally { saving = false; }
	}

	async function remove(id: string) {
		await deleteScheduleEntry(id);
		entries = await getScheduleEntries();
	}
</script>

<svelte:head><title>Taper schedule — taper-track</title></svelte:head>

<div class="schedule-page">
	<h1>Taper schedule</h1>
	<div class="disclaimer-banner">{DISCLAIMER}</div>

	<div class="form-card">
		<h2>Add a step</h2>
		<div class="field-row">
			<div class="field">
				<label for="from">From ({doseUnit})</label>
				<input id="from" type="number" min="0" step="0.5" bind:value={fromDose} placeholder="20" />
			</div>
			<div class="arrow">→</div>
			<div class="field">
				<label for="to">To ({doseUnit})</label>
				<input id="to" type="number" min="0" step="0.5" bind:value={toDose} placeholder="15" />
			</div>
		</div>
		<div class="field">
			<label for="change-date">Change date</label>
			<input id="change-date" type="date" bind:value={changeDate} />
		</div>
		<div class="field">
			<label for="entry-notes">Notes (optional)</label>
			<input id="entry-notes" type="text" bind:value={entryNotes} placeholder="e.g. Switch to liquid formulation" />
		</div>
		{#if warning}
			<div class="warning-box"><strong>Guideline note:</strong> {warning} <em>Your prescriber's plan is authoritative — you can still save this step.</em></div>
		{/if}
		<button class="btn-primary" disabled={!fromDose || !toDose || !changeDate || saving} on:click={addEntry}>
			{saving ? 'Saving…' : 'Add step'}
		</button>
	</div>

	{#if entries.length > 0}
		<h2>Your schedule</h2>
		<div class="entry-list">
			{#each entries as e}
				<div class="entry-row">
					<span class="entry-date">{e.changeDate}</span>
					<span class="entry-dose">{e.fromDose} {doseUnit} → {e.toDose} {doseUnit}</span>
					{#if e.notes}<span class="entry-notes">{e.notes}</span>{/if}
					<button class="btn-remove" on:click={() => remove(e.id)} aria-label="Remove">×</button>
				</div>
			{/each}
		</div>
	{:else}
		<p class="empty">No schedule steps yet. Add your first step above.</p>
	{/if}
</div>

<style>
	.schedule-page { max-width: 600px; }
	h1 { color: var(--color-primary); }
	.disclaimer-banner {
		background: var(--color-warning-bg); border: 1px solid var(--color-warning-border);
		border-radius: var(--radius); padding: var(--space-3) var(--space-4);
		font-size: 0.85rem; margin-bottom: var(--space-6);
	}
	.form-card {
		background: white; border: 1px solid var(--color-border);
		border-radius: var(--radius); padding: var(--space-6); margin-bottom: var(--space-6);
	}
	h2 { font-size: 1rem; margin-bottom: var(--space-4); }
	.field { margin-bottom: var(--space-3); }
	.field label { display: block; font-size: 0.9rem; font-weight: 500; margin-bottom: var(--space-1); }
	.field input { width: 100%; padding: var(--space-2) var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius); font-size: 1rem; }
	.field-row { display: flex; align-items: flex-end; gap: var(--space-3); }
	.field-row .field { flex: 1; }
	.arrow { padding-bottom: 10px; font-size: 1.2rem; color: var(--color-text-muted); flex-shrink: 0; }
	.warning-box {
		background: var(--color-warning-bg); border: 1px solid var(--color-warning-border);
		border-radius: var(--radius); padding: var(--space-3); font-size: 0.85rem; margin-bottom: var(--space-3);
	}
	.btn-primary {
		background: var(--color-primary); color: white; border: none;
		padding: var(--space-2) var(--space-6); border-radius: var(--radius);
		cursor: pointer; font-size: 0.95rem; font-weight: 500;
	}
	.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
	.entry-list { display: flex; flex-direction: column; gap: var(--space-2); }
	.entry-row {
		display: flex; align-items: center; gap: var(--space-3);
		background: white; border: 1px solid var(--color-border);
		border-radius: var(--radius); padding: var(--space-3); font-size: 0.9rem;
	}
	.entry-date { color: var(--color-text-muted); min-width: 100px; }
	.entry-dose { font-weight: 500; flex: 1; }
	.entry-notes { color: var(--color-text-muted); font-size: 0.85rem; }
	.btn-remove { background: none; border: none; cursor: pointer; color: var(--color-text-muted); font-size: 1.2rem; padding: 0 var(--space-1); }
	.empty { color: var(--color-text-muted); font-size: 0.9rem; }
</style>

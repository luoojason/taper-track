<script lang="ts">
	import { goto } from '$app/navigation';
	import { saveSymptomLog, getPassphrase } from '$lib/db/store.js';
	import { hasIdeation, isCrisis } from '$lib/crisis/detect.js';
	import type { SymptomLog, PhysicalSymptom } from '$lib/types.js';

	let sleepHours = 7;
	let mood = 5;
	let anxiety = 5;
	let notes = '';
	let ideation = false;
	let submitting = false;
	let error = '';

	const PHYSICAL_OPTIONS: { id: PhysicalSymptom; label: string }[] = [
		{ id: 'brain-zaps', label: 'Brain zaps' },
		{ id: 'nausea', label: 'Nausea' },
		{ id: 'dizziness', label: 'Dizziness' },
		{ id: 'headache', label: 'Headache' },
		{ id: 'gi-issues', label: 'GI issues' },
		{ id: 'irritability', label: 'Irritability' },
		{ id: 'sweating', label: 'Sweating' },
		{ id: 'tinnitus', label: 'Tinnitus' }
	];

	let selectedPhysical: Set<PhysicalSymptom> = new Set();

	function togglePhysical(id: PhysicalSymptom) {
		if (selectedPhysical.has(id)) { selectedPhysical.delete(id); } else { selectedPhysical.add(id); }
		selectedPhysical = selectedPhysical;
	}

	async function submit() {
		submitting = true;
		error = '';
		if (!getPassphrase()) {
			error = 'Session expired — please re-enter your passphrase to continue.';
			submitting = false;
			return;
		}
		try {
			const logEntry: SymptomLog = {
				id: crypto.randomUUID(),
				date: new Date().toISOString().split('T')[0],
				sleepHours,
				mood,
				anxiety,
				physicalSymptoms: [...selectedPhysical],
				notes,
				createdAt: new Date().toISOString()
			};
			if (hasIdeation({ ideation }) || isCrisis({ ...logEntry, ideation })) {
				await goto('/crisis');
				return;
			}
			await saveSymptomLog(logEntry);
			await goto('/dashboard');
		} catch {
			error = 'Failed to save. Please try again.';
			submitting = false;
		}
	}
</script>

<svelte:head><title>Log symptoms — taper-track</title></svelte:head>

<div class="log-page">
	<h1>Log today</h1>
	<p class="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

	<div class="section">
		<label for="sleep">Sleep last night</label>
		<div class="range-row">
			<input id="sleep" type="range" min="0" max="12" step="0.5" bind:value={sleepHours} />
			<span class="range-val">{sleepHours}h</span>
		</div>
	</div>

	<div class="section">
		<label for="mood">Mood <span class="scale-hint">(1 = very low, 10 = very good)</span></label>
		<div class="range-row">
			<input id="mood" type="range" min="1" max="10" step="1" bind:value={mood} />
			<span class="range-val">{mood}/10</span>
		</div>
	</div>

	<div class="section">
		<label for="anxiety">Anxiety <span class="scale-hint">(1 = none, 10 = very high)</span></label>
		<div class="range-row">
			<input id="anxiety" type="range" min="1" max="10" step="1" bind:value={anxiety} />
			<span class="range-val">{anxiety}/10</span>
		</div>
	</div>

	<fieldset class="section section-fieldset">
		<legend>Physical symptoms</legend>
		<div class="checklist">
			{#each PHYSICAL_OPTIONS as opt}
				<label class="check-label" class:active={selectedPhysical.has(opt.id)}>
					<input type="checkbox" checked={selectedPhysical.has(opt.id)} on:change={() => togglePhysical(opt.id)} />
					{opt.label}
				</label>
			{/each}
		</div>
	</fieldset>

	<div class="section">
		<label for="notes">Notes (optional)</label>
		<textarea id="notes" bind:value={notes} rows="3" placeholder="Any other observations…"></textarea>
	</div>

	<div class="crisis-question">
		<p class="crisis-q-label">Are you having thoughts of harming yourself?</p>
		<div class="crisis-q-options">
			<label class="crisis-option" class:selected={!ideation}>
				<input type="radio" name="ideation" value={false} bind:group={ideation} /> No
			</label>
			<label class="crisis-option crisis-yes" class:selected={ideation}>
				<input type="radio" name="ideation" value={true} bind:group={ideation} /> Yes
			</label>
		</div>
		{#if ideation}
			<p class="ideation-notice">Submitting will take you to crisis resources. <a href="/crisis">Go there now</a>.</p>
		{/if}
	</div>

	{#if error}<p class="error">{error}</p>{/if}

	<button class="btn-primary" disabled={submitting} on:click={submit}>
		{submitting ? 'Saving…' : 'Save log'}
	</button>
</div>

<style>
	.log-page { max-width: 560px; }
	h1 { color: var(--color-primary); }
	.date { color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: var(--space-6); }
	.section { margin-bottom: var(--space-6); }
	.section > label { display: block; font-weight: 500; margin-bottom: var(--space-2); }
	.scale-hint { font-weight: 400; font-size: 0.8rem; color: var(--color-text-muted); }
	.range-row { display: flex; align-items: center; gap: var(--space-3); }
	.range-row input[type="range"] { flex: 1; }
	.range-val { min-width: 3rem; font-weight: 600; color: var(--color-primary); }
	.section-fieldset { border: none; padding: 0; margin: 0; }
	.section-fieldset legend { font-weight: 500; margin-bottom: var(--space-2); }
	.checklist { display: flex; flex-wrap: wrap; gap: var(--space-2); }
	.check-label {
		display: flex; align-items: center; gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--color-border); border-radius: 20px;
		cursor: pointer; font-size: 0.9rem; background: white;
	}
	.check-label.active { background: var(--color-primary-light); border-color: var(--color-primary); }
	textarea {
		width: 100%; padding: var(--space-3);
		border: 1px solid var(--color-border); border-radius: var(--radius);
		font-size: 1rem; font-family: inherit; resize: vertical;
	}
	.crisis-question {
		background: var(--color-bg); border: 1px solid var(--color-border);
		border-radius: var(--radius); padding: var(--space-4); margin-bottom: var(--space-6);
	}
	.crisis-q-label { font-weight: 500; margin: 0 0 var(--space-3); }
	.crisis-q-options { display: flex; gap: var(--space-3); }
	.crisis-option {
		flex: 1; display: flex; align-items: center; justify-content: center;
		gap: var(--space-2); padding: var(--space-3);
		border: 1px solid var(--color-border); border-radius: var(--radius);
		cursor: pointer; font-size: 1rem; background: white;
	}
	.crisis-option.selected { border-color: var(--color-primary); background: var(--color-primary-light); }
	.crisis-option.crisis-yes.selected { border-color: var(--color-crisis); background: var(--color-crisis-bg); }
	.ideation-notice { margin-top: var(--space-3); font-size: 0.9rem; color: var(--color-text-muted); }
	.ideation-notice a { color: var(--color-crisis); }
	.btn-primary {
		background: var(--color-primary); color: white; border: none;
		padding: var(--space-3) var(--space-8); border-radius: var(--radius);
		cursor: pointer; font-size: 1rem; font-weight: 500;
	}
	.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
	.error { color: var(--color-crisis); font-size: 0.9rem; }
</style>

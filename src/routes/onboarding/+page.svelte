<script lang="ts">
	import { goto } from '$app/navigation';
	import { saveOnboarding, setPassphrase } from '$lib/db/store.js';
	import type { OnboardingData, MedicationClass, Country } from '$lib/types.js';

	let step = 1;
	let disclaimerChecked = false;

	let medicationClass: MedicationClass = 'SSRI';
	let medicationName = '';
	let startingDose = '';
	let doseUnit = 'mg';
	let taperStartDate = '';
	let prescriberEndDate = '';
	let targetFinalDose = '';
	let country: Country = 'US';
	let prescriberContact = '';

	let passphrase = '';
	let passphraseConfirm = '';
	let passphraseError = '';
	let saving = false;
	let saveError = '';

	const DISCLAIMER_TEXT = `This tool tracks the plan you and your prescriber agreed on. Do not change your dose without consulting your prescriber. Stopping psychiatric medication suddenly can cause serious harm, including seizures (benzodiazepines) or severe withdrawal (SSRIs and SNRIs).\n\ntaper-track does not generate taper schedules, provide medical advice, or replace your prescriber's guidance. All data is stored encrypted on your device only.`;

	async function finish() {
		passphraseError = '';
		if (passphrase.length < 8) { passphraseError = 'Passphrase must be at least 8 characters.'; return; }
		if (passphrase !== passphraseConfirm) { passphraseError = 'Passphrases do not match.'; return; }
		saving = true;
		try {
			setPassphrase(passphrase);
			const data: OnboardingData = {
				medicationClass,
				medicationName,
				startingDose: parseFloat(startingDose),
				doseUnit,
				taperStartDate,
				prescriberEndDate: prescriberEndDate || undefined,
				targetFinalDose: targetFinalDose ? parseFloat(targetFinalDose) : undefined,
				country,
				prescriberContact: prescriberContact || undefined,
				disclaimerAcknowledged: true,
				createdAt: new Date().toISOString()
			};
			await saveOnboarding(data);
			await goto('/dashboard');
		} catch {
			saveError = 'Failed to save. Please try again.';
		} finally {
			saving = false;
		}
	}
</script>

<svelte:head><title>Get started — taper-track</title></svelte:head>

<div class="onboarding">
	<h1>Get started</h1>

	{#if step === 1}
		<h2>Before we begin</h2>
		<div class="disclaimer-full">
			<p style="white-space: pre-line">{DISCLAIMER_TEXT}</p>
			<p><strong>If you are in crisis right now:</strong> call or text <strong>988</strong> (US), or visit <a href="/crisis">crisis resources</a>.</p>
		</div>
		<label class="checkbox-label">
			<input type="checkbox" bind:checked={disclaimerChecked} />
			I understand this is a tracking tool, not medical advice. I will not change my dose without consulting my prescriber.
		</label>
		<div class="actions">
			<button class="btn-primary" disabled={!disclaimerChecked} on:click={() => (step = 2)}>Continue</button>
		</div>

	{:else if step === 2}
		<h2>Your medication</h2>
		<fieldset class="field field-fieldset">
			<legend class="field-legend">Medication class</legend>
			<div class="radio-group">
				<label class="radio-label"><input type="radio" bind:group={medicationClass} value="SSRI" /> SSRI / Antidepressant</label>
				<label class="radio-label"><input type="radio" bind:group={medicationClass} value="benzodiazepine" /> Benzodiazepine</label>
			</div>
		</fieldset>
		<div class="field">
			<label for="med-name">Medication name (optional)</label>
			<input id="med-name" type="text" bind:value={medicationName} placeholder="e.g. sertraline, diazepam" />
		</div>
		<div class="field-row">
			<div class="field">
				<label for="start-dose">Starting dose</label>
				<input id="start-dose" type="number" min="0" step="0.5" bind:value={startingDose} placeholder="20" />
			</div>
			<div class="field field-unit">
				<label for="dose-unit">Unit</label>
				<input id="dose-unit" type="text" bind:value={doseUnit} placeholder="mg" />
			</div>
		</div>
		<div class="field">
			<label for="start-date">Taper start date</label>
			<input id="start-date" type="date" bind:value={taperStartDate} />
		</div>
		<div class="field">
			<label for="end-date">Target end date (optional)</label>
			<input id="end-date" type="date" bind:value={prescriberEndDate} />
		</div>
		<div class="field">
			<label for="final-dose">Target final dose in {doseUnit} (optional)</label>
			<input id="final-dose" type="number" min="0" step="0.5" bind:value={targetFinalDose} />
		</div>
		<div class="actions">
			<button class="btn-secondary" on:click={() => (step = 1)}>Back</button>
			<button class="btn-primary" disabled={!startingDose || !taperStartDate} on:click={() => (step = 3)}>Continue</button>
		</div>

	{:else if step === 3}
		<h2>Your details</h2>
		<div class="field">
			<label for="country">Country (for crisis resources)</label>
			<select id="country" bind:value={country}>
				<option value="US">United States</option>
				<option value="UK">United Kingdom</option>
				<option value="CA">Canada</option>
				<option value="AU">Australia</option>
				<option value="INTL">International / Other</option>
			</select>
		</div>
		<div class="field">
			<label for="prescriber">Prescriber contact (optional — shown on crisis screen)</label>
			<input id="prescriber" type="text" bind:value={prescriberContact} placeholder="e.g. Dr Smith: 555-0100" />
		</div>
		<div class="actions">
			<button class="btn-secondary" on:click={() => (step = 2)}>Back</button>
			<button class="btn-primary" on:click={() => (step = 4)}>Continue</button>
		</div>

	{:else if step === 4}
		<h2>Set your passphrase</h2>
		<p class="field-hint">Your data is encrypted with this passphrase. Store it somewhere safe — if you lose it, your data cannot be recovered.</p>
		<div class="field">
			<label for="pass">Passphrase (min 8 characters)</label>
			<input id="pass" type="password" bind:value={passphrase} autocomplete="new-password" />
		</div>
		<div class="field">
			<label for="pass2">Confirm passphrase</label>
			<input id="pass2" type="password" bind:value={passphraseConfirm} autocomplete="new-password" />
		</div>
		{#if passphraseError}<p class="error">{passphraseError}</p>{/if}
		{#if saveError}<p class="error">{saveError}</p>{/if}
		<div class="actions">
			<button class="btn-secondary" on:click={() => (step = 3)}>Back</button>
			<button class="btn-primary" disabled={saving} on:click={finish}>{saving ? 'Saving…' : 'Finish setup'}</button>
		</div>
	{/if}

	<div class="step-indicator">Step {step} of 4</div>
</div>

<style>
	.onboarding { max-width: 560px; }
	h1 { color: var(--color-primary); }
	h2 { margin-bottom: var(--space-4); }
	.disclaimer-full {
		background: var(--color-warning-bg);
		border: 1px solid var(--color-warning-border);
		border-radius: var(--radius);
		padding: var(--space-4);
		margin-bottom: var(--space-4);
		font-size: 0.9rem;
		line-height: 1.6;
	}
	.disclaimer-full p { margin: 0 0 var(--space-3); }
	.disclaimer-full p:last-child { margin-bottom: 0; }
	.checkbox-label {
		display: flex;
		gap: var(--space-3);
		align-items: flex-start;
		cursor: pointer;
		font-size: 0.9rem;
		margin-bottom: var(--space-6);
	}
	.checkbox-label input { margin-top: 3px; flex-shrink: 0; }
	.field { margin-bottom: var(--space-4); }
	.field label { display: block; font-size: 0.9rem; font-weight: 500; margin-bottom: var(--space-1); }
	.field input, .field select {
		width: 100%;
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		font-size: 1rem;
		background: white;
	}
	.field-row { display: flex; gap: var(--space-3); }
	.field-row .field { flex: 1; }
	.field-unit { max-width: 100px; }
	.field-hint { font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: var(--space-4); }
	.field-fieldset { border: none; padding: 0; margin: 0 0 var(--space-4); }
	.field-legend { font-size: 0.9rem; font-weight: 500; margin-bottom: var(--space-1); }
	.radio-group { display: flex; gap: var(--space-4); flex-wrap: wrap; }
	.radio-label { display: flex; gap: var(--space-2); align-items: center; cursor: pointer; }
	.actions { display: flex; gap: var(--space-3); margin-top: var(--space-6); }
	.btn-primary {
		background: var(--color-primary); color: white; border: none;
		padding: var(--space-3) var(--space-6); border-radius: var(--radius);
		cursor: pointer; font-size: 1rem; font-weight: 500;
	}
	.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
	.btn-secondary {
		background: white; color: var(--color-text); border: 1px solid var(--color-border);
		padding: var(--space-3) var(--space-6); border-radius: var(--radius);
		cursor: pointer; font-size: 1rem;
	}
	.error { color: var(--color-crisis); font-size: 0.9rem; }
	.step-indicator { margin-top: var(--space-6); font-size: 0.8rem; color: var(--color-text-muted); }
</style>

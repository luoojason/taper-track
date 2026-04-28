<script lang="ts">
	import { onMount } from 'svelte';
	import { CRISIS_RESOURCES, COUNTRY_NAMES } from '$lib/crisis/resources.js';
	import { getOnboarding } from '$lib/db/store.js';
	import type { Country } from '$lib/types.js';

	let country: Country = 'US';
	let prescriberContact: string | undefined;
	let loaded = false;

	onMount(async () => {
		try {
			const ob = await getOnboarding();
			if (ob) { country = ob.country; prescriberContact = ob.prescriberContact; }
		} catch { /* DB not yet set up */ }
		loaded = true;
	});

	$: resources = CRISIS_RESOURCES[country] ?? CRISIS_RESOURCES['INTL'];
	$: intl = CRISIS_RESOURCES['INTL'];
</script>

<svelte:head><title>Crisis Resources — taper-track</title></svelte:head>

<div class="crisis-page">
	<h1>You don't have to face this alone</h1>
	<p class="crisis-sub">Reach out now. These lines are free, confidential, and available 24/7.</p>

	{#if loaded}
		<div class="resources">
			<h2>{COUNTRY_NAMES[country]}</h2>
			{#each resources as r}
				<div class="resource-card">
					<div class="resource-name">{r.name}</div>
					{#if r.phone}
						<a href="tel:{r.phone.replace(/\s/g, '')}" class="resource-action">Call {r.phone}</a>
					{/if}
					{#if r.note}<div class="resource-note">{r.note}</div>{/if}
					{#if r.url}
						<a href={r.url} target="_blank" rel="noopener noreferrer" class="resource-link">{r.url.replace('https://', '')}</a>
					{/if}
				</div>
			{/each}

			{#if country !== 'INTL'}
				<div class="resource-card intl-card">
					<div class="resource-name">{intl[0].name}</div>
					{#if intl[0].note}<div class="resource-note">{intl[0].note}</div>{/if}
					{#if intl[0].url}
						<a href={intl[0].url} target="_blank" rel="noopener noreferrer" class="resource-link">findahelpline.com</a>
					{/if}
				</div>
			{/if}
		</div>

		{#if prescriberContact}
			<div class="prescriber-card">
				<div class="prescriber-label">Your prescriber</div>
				<div>{prescriberContact}</div>
			</div>
		{/if}
	{/if}

	<div class="country-select">
		<label for="country-sel">Show resources for: </label>
		<select id="country-sel" bind:value={country}>
			{#each Object.entries(COUNTRY_NAMES) as [code, name]}
				<option value={code}>{name}</option>
			{/each}
		</select>
	</div>

	<div class="emergency-note">
		If you are in immediate danger, call your local emergency number (911 in the US).
	</div>

	<a href="/dashboard" class="return-link">Return to tracking</a>
</div>

<style>
	.crisis-page { max-width: 600px; }
	h1 { font-size: 1.8rem; color: var(--color-text); margin-bottom: var(--space-2); }
	.crisis-sub { color: var(--color-text-muted); margin-bottom: var(--space-6); }
	h2 { font-size: 0.85rem; font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-3); }
	.resources { display: flex; flex-direction: column; gap: var(--space-3); margin-bottom: var(--space-4); }
	.resource-card {
		background: white; border: 1px solid var(--color-border);
		border-radius: var(--radius); padding: var(--space-4);
		display: flex; flex-direction: column; gap: var(--space-2);
	}
	.resource-name { font-weight: 600; font-size: 1rem; }
	.resource-action {
		display: inline-block; background: var(--color-primary); color: white;
		text-decoration: none; padding: var(--space-2) var(--space-4);
		border-radius: var(--radius); font-weight: 600; font-size: 1.1rem; align-self: flex-start;
	}
	.resource-note { font-size: 0.9rem; color: var(--color-text-muted); }
	.resource-link { font-size: 0.85rem; color: var(--color-primary); }
	.intl-card { background: var(--color-bg); }
	.prescriber-card {
		background: var(--color-primary-light); border: 1px solid var(--color-primary);
		border-radius: var(--radius); padding: var(--space-4); margin-bottom: var(--space-4);
	}
	.prescriber-label { font-size: 0.85rem; font-weight: 600; color: var(--color-primary); margin-bottom: var(--space-1); }
	.country-select { display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-6); font-size: 0.9rem; }
	.country-select select { padding: var(--space-1) var(--space-2); border: 1px solid var(--color-border); border-radius: var(--radius); background: white; }
	.emergency-note {
		font-size: 0.85rem; color: var(--color-text-muted);
		border-top: 1px solid var(--color-border); padding-top: var(--space-4); margin-bottom: var(--space-4);
	}
	.return-link { color: var(--color-text-muted); font-size: 0.9rem; }
</style>

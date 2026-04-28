<script lang="ts">
</script>

<svelte:head>
	<title>taper-track</title>
</svelte:head>

<div class="home">
	<h1>taper-track</h1>
	<p class="subtitle">A private, local-first tool to track your prescriber's taper plan.</p>

	<div class="disclaimer-box">
		<strong>This tool is not medical advice.</strong> It helps you follow the plan you and your prescriber agreed on.
		Do not change your dose without consulting your prescriber.
	</div>

	<div class="actions">
		<a href="/onboarding" class="btn-primary">Get started</a>
		<a href="/dashboard" class="btn-secondary">Go to dashboard</a>
	</div>
</div>

<style>
	.home { max-width: 600px; }
	h1 { font-size: 2rem; color: var(--color-primary); }
	.subtitle { font-size: 1.1rem; color: var(--color-text-muted); margin-bottom: var(--space-6); }
	.disclaimer-box {
		background: var(--color-warning-bg);
		border: 1px solid var(--color-warning-border);
		border-radius: var(--radius);
		padding: var(--space-4);
		margin-bottom: var(--space-6);
		font-size: 0.9rem;
	}
	.actions { display: flex; gap: var(--space-4); flex-wrap: wrap; }
	.btn-primary {
		background: var(--color-primary);
		color: white;
		padding: var(--space-3) var(--space-6);
		border-radius: var(--radius);
		text-decoration: none;
		font-weight: 500;
	}
	.btn-secondary {
		background: white;
		color: var(--color-primary);
		border: 1px solid var(--color-primary);
		padding: var(--space-3) var(--space-6);
		border-radius: var(--radius);
		text-decoration: none;
	}
</style>

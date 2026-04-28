<script lang="ts">
	import '../app.css';
	import Footer from '$lib/components/Footer.svelte';
</script>

<div class="app-shell">
	<nav class="nav">
		<a href="/" class="nav-brand">taper-track</a>
		<div class="nav-links">
			<a href="/dashboard">Dashboard</a>
			<a href="/log">Log today</a>
			<a href="/schedule">Schedule</a>
			<a href="/export">Export</a>
			<a href="/crisis" class="nav-crisis">Crisis resources</a>
		</div>
	</nav>

	<main class="main">
		<slot />
	</main>

	<Footer />
</div>

<style>
	.app-shell {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
	.nav {
		background: white;
		border-bottom: 1px solid var(--color-border);
		padding: var(--space-3) var(--space-6);
		display: flex;
		align-items: center;
		gap: var(--space-6);
		flex-wrap: wrap;
	}
	.nav-brand {
		font-weight: 600;
		text-decoration: none;
		color: var(--color-primary);
		font-size: 1.1rem;
	}
	.nav-links {
		display: flex;
		gap: var(--space-4);
		flex-wrap: wrap;
	}
	.nav-links a {
		text-decoration: none;
		color: var(--color-text-muted);
		font-size: 0.9rem;
	}
	.nav-links a:hover { color: var(--color-text); }
	.nav-crisis {
		color: var(--color-crisis) !important;
		font-weight: 500;
	}
	.main {
		flex: 1;
		padding: var(--space-6);
		max-width: 900px;
		width: 100%;
		margin: 0 auto;
	}
</style>

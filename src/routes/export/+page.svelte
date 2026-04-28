<script lang="ts">
	import { getOnboarding, getScheduleEntries, getSymptomLogs, clearAllData, setPassphrase, getPassphrase } from '$lib/db/store.js';
	import { generatePDF } from '$lib/export/pdf.js';
	import { exportEncryptedJSON, importEncryptedJSON } from '$lib/export/json.js';

	let busy = false;
	let importPassphrase = '';
	let importFile: File | null = null;
	let status = '';
	let error = '';

	function download(blob: Blob, filename: string) {
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url; a.download = filename; a.click();
		URL.revokeObjectURL(url);
	}

	async function exportPDF() {
		busy = true; status = ''; error = '';
		try {
			const [onboarding, scheduleEntries, symptomLogs] = await Promise.all([
				getOnboarding(), getScheduleEntries(), getSymptomLogs()
			]);
			const blob = await generatePDF({ version: '1', onboarding, scheduleEntries, symptomLogs, exportedAt: new Date().toISOString() });
			download(blob, `taper-track-${new Date().toISOString().split('T')[0]}.pdf`);
			status = 'PDF downloaded.';
		} catch { error = 'PDF export failed. Please try again.'; }
		finally { busy = false; }
	}

	async function exportJSON() {
		busy = true; status = ''; error = '';
		try {
			const pp = getPassphrase();
			if (!pp) { error = 'Please re-enter your passphrase first (session expired).'; busy = false; return; }
			const json = await exportEncryptedJSON(pp);
			download(new Blob([json], { type: 'application/json' }), `taper-track-backup-${new Date().toISOString().split('T')[0]}.json`);
			status = 'Encrypted backup downloaded.';
		} catch { error = 'Export failed. Please try again.'; }
		finally { busy = false; }
	}

	async function importJSON() {
		if (!importFile || !importPassphrase) return;
		busy = true; status = ''; error = '';
		try {
			const text = await importFile.text();
			setPassphrase(importPassphrase);
			await importEncryptedJSON(importPassphrase, text);
			status = 'Import successful. Your data has been restored.';
		} catch { error = 'Import failed. Check your passphrase and that the file is a valid taper-track backup.'; }
		finally { busy = false; }
	}

	async function clearAll() {
		if (!confirm('Delete all data from this device? This cannot be undone without a backup.')) return;
		busy = true;
		try { await clearAllData(); status = 'All data cleared.'; }
		finally { busy = false; }
	}

	function handleFile(e: Event) {
		importFile = (e.target as HTMLInputElement).files?.[0] ?? null;
	}
</script>

<svelte:head><title>Export — taper-track</title></svelte:head>

<div class="export-page">
	<h1>Export &amp; backup</h1>
	<p class="intro">Your data belongs to you. Nothing leaves your device without your action.</p>

	<div class="card">
		<h2>Share with your prescriber</h2>
		<p>PDF summary of your taper schedule and symptom history.</p>
		<button class="btn-primary" disabled={busy} on:click={exportPDF}>Download PDF</button>
	</div>

	<div class="card">
		<h2>Encrypted backup</h2>
		<p>Encrypted JSON backup, secured with your passphrase. Safe to store anywhere.</p>
		<button class="btn-secondary" disabled={busy} on:click={exportJSON}>Download encrypted backup (.json)</button>
	</div>

	<div class="card">
		<h2>Restore from backup</h2>
		<div class="field">
			<label for="import-pass">Passphrase used when backup was created</label>
			<input id="import-pass" type="password" bind:value={importPassphrase} autocomplete="current-password" />
		</div>
		<div class="field">
			<label for="import-file">Backup file (.json)</label>
			<input id="import-file" type="file" accept=".json" on:change={handleFile} />
		</div>
		<button class="btn-secondary" disabled={busy || !importFile || !importPassphrase} on:click={importJSON}>Restore backup</button>
	</div>

	<div class="card danger-card">
		<h2>Clear all data</h2>
		<p>Permanently delete all data from this device. Irreversible without a backup.</p>
		<button class="btn-danger" disabled={busy} on:click={clearAll}>Clear all data</button>
	</div>

	{#if status}<p class="msg-ok">{status}</p>{/if}
	{#if error}<p class="msg-err">{error}</p>{/if}
</div>

<style>
	.export-page { max-width: 600px; }
	h1 { color: var(--color-primary); }
	.intro { color: var(--color-text-muted); margin-bottom: var(--space-6); }
	.card {
		background: white; border: 1px solid var(--color-border);
		border-radius: var(--radius); padding: var(--space-6); margin-bottom: var(--space-4);
	}
	h2 { font-size: 1rem; margin-bottom: var(--space-2); }
	p { font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: var(--space-4); }
	.field { margin-bottom: var(--space-3); }
	.field label { display: block; font-size: 0.9rem; font-weight: 500; margin-bottom: var(--space-1); }
	.field input { width: 100%; padding: var(--space-2) var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius); font-size: 1rem; }
	.btn-primary {
		background: var(--color-primary); color: white; border: none;
		padding: var(--space-2) var(--space-6); border-radius: var(--radius); cursor: pointer; font-size: 0.95rem; font-weight: 500;
	}
	.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
	.btn-secondary {
		background: white; color: var(--color-text); border: 1px solid var(--color-border);
		padding: var(--space-2) var(--space-6); border-radius: var(--radius); cursor: pointer; font-size: 0.95rem;
	}
	.btn-secondary:disabled { opacity: 0.4; cursor: not-allowed; }
	.btn-danger {
		background: var(--color-crisis-bg); color: var(--color-crisis); border: 1px solid #fca5a5;
		padding: var(--space-2) var(--space-6); border-radius: var(--radius); cursor: pointer; font-size: 0.95rem;
	}
	.btn-danger:disabled { opacity: 0.4; cursor: not-allowed; }
	.danger-card { border-color: #fca5a5; }
	.msg-ok { color: var(--color-primary); font-size: 0.9rem; margin-top: var(--space-4); }
	.msg-err { color: var(--color-crisis); font-size: 0.9rem; margin-top: var(--space-4); }
</style>

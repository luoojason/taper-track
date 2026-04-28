import { describe, it, expect } from 'vitest';
import { encryptData, decryptData } from '../../src/lib/db/crypto.js';

describe('crypto round-trip', () => {
	it('encrypts and decrypts a UTF-8 string identically', async () => {
		const passphrase = 'test-passphrase-123';
		const plaintext = 'Hello, taper-track! 🌿 Special chars: <>&"\'';
		const encrypted = await encryptData(passphrase, plaintext);
		const decrypted = await decryptData(passphrase, encrypted);
		expect(decrypted).toBe(plaintext);
	});

	it('produces different ciphertext on each call (random IV)', async () => {
		const passphrase = 'same-passphrase';
		const plaintext = 'same plaintext';
		const enc1 = await encryptData(passphrase, plaintext);
		const enc2 = await encryptData(passphrase, plaintext);
		expect(enc1).not.toBe(enc2);
	});

	it('throws on wrong passphrase', async () => {
		const encrypted = await encryptData('correct-passphrase', 'secret data');
		await expect(decryptData('wrong-passphrase', encrypted)).rejects.toThrow();
	});

	it('throws on corrupted ciphertext', async () => {
		const encrypted = await encryptData('passphrase', 'data');
		const corrupted = encrypted.slice(0, -4) + 'XXXX';
		await expect(decryptData('passphrase', corrupted)).rejects.toThrow();
	});
});

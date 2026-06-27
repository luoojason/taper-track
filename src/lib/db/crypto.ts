const PBKDF2_ITERATIONS = 100_000;
const SALT_BYTES = 16;
const IV_BYTES = 12;

async function deriveKey(passphrase: string, salt: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
	const enc = new TextEncoder();
	const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, [
		'deriveKey'
	]);
	return crypto.subtle.deriveKey(
		{ name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
		keyMaterial,
		{ name: 'AES-GCM', length: 256 },
		false,
		['encrypt', 'decrypt']
	);
}

function randomBytes(n: number): Uint8Array<ArrayBuffer> {
	const buf = new Uint8Array(new ArrayBuffer(n));
	crypto.getRandomValues(buf);
	return buf;
}

export async function encryptData(passphrase: string, plaintext: string): Promise<string> {
	const salt = randomBytes(SALT_BYTES);
	const iv = randomBytes(IV_BYTES);
	const key = await deriveKey(passphrase, salt);
	const enc = new TextEncoder();
	const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plaintext));
	const combined = new Uint8Array(salt.byteLength + iv.byteLength + ciphertext.byteLength);
	combined.set(salt, 0);
	combined.set(iv, SALT_BYTES);
	combined.set(new Uint8Array(ciphertext), SALT_BYTES + IV_BYTES);
	let binary = '';
	const CHUNK = 8192;
	for (let i = 0; i < combined.length; i += CHUNK) {
		binary += String.fromCharCode(...combined.subarray(i, i + CHUNK));
	}
	return btoa(binary);
}

export async function decryptData(passphrase: string, encoded: string): Promise<string> {
	const combined = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
	const salt = combined.slice(0, SALT_BYTES);
	const iv = combined.slice(SALT_BYTES, SALT_BYTES + IV_BYTES);
	const ciphertext = combined.slice(SALT_BYTES + IV_BYTES);
	const key = await deriveKey(passphrase, salt);
	const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
	return new TextDecoder().decode(plaintext);
}

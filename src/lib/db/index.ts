import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'taper-track';
const DB_VERSION = 1;

type TaperDBSchema = {
	onboarding: { key: 'onboarding'; value: string };
	schedule_entries: { key: string; value: string };
	symptom_logs: { key: string; value: string };
};

export type TaperDB = IDBPDatabase<TaperDBSchema>;

let dbPromise: Promise<TaperDB> | null = null;

export function getDB(): Promise<TaperDB> {
	if (!dbPromise) {
		dbPromise = openDB<TaperDBSchema>(DB_NAME, DB_VERSION, {
			upgrade(db) {
				if (!db.objectStoreNames.contains('onboarding')) {
					db.createObjectStore('onboarding');
				}
				if (!db.objectStoreNames.contains('schedule_entries')) {
					db.createObjectStore('schedule_entries');
				}
				if (!db.objectStoreNames.contains('symptom_logs')) {
					db.createObjectStore('symptom_logs');
				}
			}
		}) as Promise<TaperDB>;
	}
	return dbPromise;
}

export function resetDB(): void {
	dbPromise = null;
}

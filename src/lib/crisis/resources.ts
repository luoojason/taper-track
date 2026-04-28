import type { Country } from '../types.js';

export interface CrisisResource {
	name: string;
	phone?: string;
	sms?: string;
	url?: string;
	note?: string;
}

export const CRISIS_RESOURCES: Record<Country, CrisisResource[]> = {
	US: [
		{
			name: '988 Suicide & Crisis Lifeline',
			phone: '988',
			sms: '988',
			url: 'https://988lifeline.org',
			note: 'Call or text, 24/7'
		},
		{
			name: 'Crisis Text Line',
			sms: '741741',
			url: 'https://www.crisistextline.org',
			note: 'Text HOME to 741741'
		}
	],
	UK: [
		{
			name: 'Samaritans',
			phone: '116 123',
			url: 'https://www.samaritans.org',
			note: 'Free, 24/7'
		}
	],
	CA: [
		{
			name: '988 Suicide Crisis Helpline',
			phone: '988',
			sms: '988',
			url: 'https://988.ca',
			note: 'Call or text, 24/7'
		}
	],
	AU: [
		{
			name: 'Lifeline',
			phone: '13 11 14',
			url: 'https://www.lifeline.org.au',
			note: '24/7 crisis support'
		}
	],
	INTL: [
		{
			name: 'Find a Helpline',
			url: 'https://findahelpline.com',
			note: 'Directory of crisis lines worldwide'
		}
	]
};

export const COUNTRY_NAMES: Record<Country, string> = {
	US: 'United States',
	UK: 'United Kingdom',
	CA: 'Canada',
	AU: 'Australia',
	INTL: 'International / Other'
};

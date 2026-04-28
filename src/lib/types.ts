export type MedicationClass = 'SSRI' | 'benzodiazepine';

export type Country = 'US' | 'UK' | 'CA' | 'AU' | 'INTL';

export interface OnboardingData {
	medicationClass: MedicationClass;
	medicationName: string;
	startingDose: number;
	doseUnit: string;
	taperStartDate: string;
	prescriberEndDate?: string;
	targetFinalDose?: number;
	country: Country;
	prescriberContact?: string;
	disclaimerAcknowledged: true;
	createdAt: string;
}

export interface ScheduleEntry {
	id: string;
	fromDose: number;
	toDose: number;
	changeDate: string;
	notes?: string;
	createdAt: string;
}

export type PhysicalSymptom =
	| 'brain-zaps'
	| 'nausea'
	| 'dizziness'
	| 'headache'
	| 'gi-issues'
	| 'irritability'
	| 'sweating'
	| 'tinnitus';

export interface SymptomLog {
	id: string;
	date: string;
	sleepHours: number;
	mood: number;
	anxiety: number;
	physicalSymptoms: PhysicalSymptom[];
	notes: string;
	createdAt: string;
}

export interface ExportData {
	version: '1';
	onboarding: OnboardingData | null;
	scheduleEntries: ScheduleEntry[];
	symptomLogs: SymptomLog[];
	exportedAt: string;
}

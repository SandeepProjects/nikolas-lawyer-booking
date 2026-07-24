export interface ConsultationService {
  id: string;
  name: string;
  shortName: string;
  description: string;
  durationMinutes: number;
  price: number;
  suitableFor: string;
}

export const PRACTICE_CONFIG = {
  displayName: 'Nikolas Leontides',
  descriptor: 'Legal consultation',
  timezone: 'Europe/Nicosia',
  timezoneLabel: 'Cyprus time (Europe/Nicosia)',
  openingMinute: 9 * 60,
  closingMinute: 17 * 60,
  slotIntervalMinutes: 30,
  bookingWindowDays: 28,
  services: [
    {
      id: 'initial-consultation',
      name: 'Initial consultation',
      shortName: 'Initial',
      description: 'A focused first conversation to understand the matter and identify practical next steps.',
      durationMinutes: 30,
      price: 80,
      suitableFor: 'New enquiries and early guidance'
    },
    {
      id: 'document-review',
      name: 'Document review',
      shortName: 'Documents',
      description: 'Time reserved to discuss a contract, agreement or other document after preliminary review.',
      durationMinutes: 45,
      price: 120,
      suitableFor: 'Contracts and written material'
    },
    {
      id: 'full-consultation',
      name: 'Full legal consultation',
      shortName: 'Full session',
      description: 'A longer appointment for context, options, questions and an agreed direction.',
      durationMinutes: 60,
      price: 160,
      suitableFor: 'Complex matters requiring more time'
    },
    {
      id: 'follow-up',
      name: 'Follow-up session',
      shortName: 'Follow-up',
      description: 'A concise progress review for clients who have already completed an initial consultation.',
      durationMinutes: 30,
      price: 70,
      suitableFor: 'Existing matters and next-step reviews'
    }
  ] satisfies ConsultationService[],
  legalAreas: [
    'General enquiry',
    'Contract or document',
    'Business matter',
    'Property matter',
    'Family or personal matter',
    'Follow-up appointment'
  ]
} as const;

export type PracticeService = (typeof PRACTICE_CONFIG.services)[number];

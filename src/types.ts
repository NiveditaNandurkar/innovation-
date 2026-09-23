export type EventType =
  | 'Hackathon'
  | 'Workshop'
  | 'Tech Talk'
  | 'Competition'
  | 'Seminar';

export type EventStatus = 'Open' | 'Upcoming' | 'Ongoing' | 'Filled' | 'Past';

export interface EventData {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  type: EventType;
  shortDescription: string;
  description: string;
  organizer: string;
  status: EventStatus;
  tags: string[];
  featured?: boolean;
  posterUrl?: string;
  backdropUrl?: string;
  trailerVideoUrl?: string;
  accentColor?: string;
  duration?: string;
  tagline?: string;
}

export interface Certificate {
  id: string;
  participantName: string;
  eventName: string;
  eventDate: string;
  issuedOn: string;
  organizer: string;
  usn?: string;
}

export interface Registration {
  id: string;
  fullName: string;
  email: string;
  college: string;
  phone: string;
  eventId: string;
  eventName: string;
  registeredOn: string;
}

export const EVENT_TYPES: EventType[] = [
  'Hackathon',
  'Workshop',
  'Tech Talk',
  'Competition',
  'Seminar',
];
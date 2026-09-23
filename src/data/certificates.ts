import type { Certificate } from '../types';
import { EVENTS } from './events';

export interface StudentRecord {
  usn: string;
  name: string;
  department: string;
  college: string;
}

export const TEST_STUDENTS: StudentRecord[] = [
  {
    usn: 'CM24075',
    name: 'Aarav Mehta',
    department: 'Computer Science & Engineering',
    college: 'INNOVENTA Institute of Technology',
  },
  {
    usn: 'IT22081',
    name: 'Priya Sharma',
    department: 'Information Technology',
    college: 'INNOVENTA Institute of Technology',
  },
  {
    usn: 'EC23114',
    name: 'Rahul Verma',
    department: 'Electronics & Communication',
    college: 'INNOVENTA Institute of Technology',
  },
];

export const TEST_USNS = TEST_STUDENTS.map((s) => s.usn);

export const CERTIFICATES: Certificate[] = [
  {
    id: 'INNOVENTA-2026-001',
    participantName: 'Aarav Mehta',
    usn: 'CM24075',
    eventName: 'Web3 Innovators Hackathon',
    eventDate: '2026-11-28',
    issuedOn: '2026-12-01',
    organizer: 'INNOVENTA',
  },
  {
    id: 'INNOVENTA-2026-002',
    participantName: 'Priya Sharma',
    usn: 'IT22081',
    eventName: 'CodeQuest Programming Championship',
    eventDate: '2026-12-05',
    issuedOn: '2026-12-08',
    organizer: 'INNOVENTA',
  },
  {
    id: 'INNOVENTA-2026-003',
    participantName: 'Rahul Verma',
    usn: 'EC23114',
    eventName: 'Cyber Shield Security Seminar',
    eventDate: '2026-12-07',
    issuedOn: '2026-12-09',
    organizer: 'INNOVENTA',
  },
  {
    id: 'INNOVENTA-2026-004',
    participantName: 'Sneha Iyer',
    usn: 'CS22045',
    eventName: 'UI/UX Design Sprint Workshop',
    eventDate: '2026-11-30',
    issuedOn: '2026-12-02',
    organizer: 'INNOVENTA',
  },
  {
    id: 'INNOVENTA-2026-005',
    participantName: 'Kabir Nair',
    usn: 'AI23012',
    eventName: 'Future of AI Tech Talk',
    eventDate: '2026-12-02',
    issuedOn: '2026-12-04',
    organizer: 'INNOVENTA',
  },
];

export const CERTIFICATE_ID_PREFIX = 'INNOVENTA-2026';

export function findCertificate(id: string): Certificate | undefined {
  const normalized = id.trim().toUpperCase();
  return CERTIFICATES.find(
    (cert) =>
      cert.id.toUpperCase() === normalized ||
      (cert.usn && cert.usn.toUpperCase() === normalized),
  );
}

export function findStudentByUSN(usn: string): StudentRecord | undefined {
  const norm = usn.trim().toUpperCase();
  return TEST_STUDENTS.find((s) => s.usn.toUpperCase() === norm);
}

export function generateCertificate(usn: string, eventId: string): Certificate | null {
  const cleanUsn = usn.trim().toUpperCase();
  if (!cleanUsn) return null;

  const event = EVENTS.find((e) => e.id === eventId) || EVENTS[0];
  const knownStudent = findStudentByUSN(cleanUsn);
  
  // Format an official certificate ID
  const hash = Math.abs(
    cleanUsn.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0) % 900 + 100
  );
  const certId = `INNOVENTA-2026-${cleanUsn.replace(/[^A-Z0-9]/g, '')}-${hash}`;

  const studentName = knownStudent
    ? knownStudent.name
    : `Student (${cleanUsn})`;

  return {
    id: certId,
    participantName: studentName,
    usn: cleanUsn,
    eventName: event.name,
    eventDate: event.date,
    issuedOn: new Date().toISOString().split('T')[0],
    organizer: 'INNOVENTA Academic Board',
  };
}
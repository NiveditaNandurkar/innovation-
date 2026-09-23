import type { Certificate } from '../types';
import { useLocalStorage } from './useLocalStorage';

export function useSavedCertificates() {
  return useLocalStorage<Certificate[]>('innoventa_saved_certificates', []);
}
import type { Certificate } from '../types';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateCertificateSvg(cert: Certificate): string {
  const issued = new Date(cert.issuedOn).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const eventDate = new Date(cert.eventDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const corner =
    '<circle cx="26" cy="26" r="3" fill="#ff2d40"/><circle cx="26" cy="26" r="9" fill="none" stroke="#ff2d40" stroke-width="1.5"/><path d="M26 10v32M10 26h32" stroke="#ff2d40" stroke-width="1.5"/>';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1131" viewBox="0 0 1600 1131">
  <defs>
    <radialGradient id="bg" cx="50%" cy="38%" r="75%">
      <stop offset="0%" stop-color="#0e1730"/>
      <stop offset="60%" stop-color="#080d1c"/>
      <stop offset="100%" stop-color="#04060e"/>
    </radialGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ff2d40"/>
      <stop offset="100%" stop-color="#3f8cff"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f7d06a"/>
      <stop offset="100%" stop-color="#e8b23a"/>
    </linearGradient>
    <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="6" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="1600" height="1131" fill="url(#bg)"/>
  <rect x="40" y="40" width="1520" height="1051" rx="28" fill="none" stroke="#2a3a6b" stroke-width="2"/>
  <rect x="58" y="58" width="1484" height="1015" rx="18" fill="rgba(20,32,66,0.45)" stroke="rgba(120,160,255,0.25)" stroke-width="1"/>
  <text x="800" y="180" text-anchor="middle" font-family="Georgia, serif" font-size="34" fill="#93a1c3" letter-spacing="14">INNOVENTA</text>
  <text x="800" y="250" text-anchor="middle" font-family="Georgia, serif" font-size="64" font-weight="bold" fill="#eef2ff">Certificate of Participation</text>
  <text x="800" y="300" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#ff2d40">THIS CERTIFICATE IS PROUDLY PRESENTED TO</text>
  <text x="800" y="420" text-anchor="middle" font-family="Georgia, serif" font-size="76" font-weight="bold" fill="url(#gold)" filter="url(#glow)">${escapeXml(cert.participantName)}</text>
  ${cert.usn ? `<text x="800" y="458" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="600" fill="#93a1c3" letter-spacing="3">USN: ${escapeXml(cert.usn)}</text>` : ''}
  <line x1="112" y1="480" x2="1488" y2="480" stroke="url(#accent)" stroke-width="2"/>
  <text x="800" y="535" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" fill="#d6def7">for outstanding participation in</text>
  <text x="800" y="595" text-anchor="middle" font-family="Georgia, serif" font-size="40" font-weight="bold" fill="#eef2ff">${escapeXml(cert.eventName)}</text>
  <text x="800" y="655" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#93a1c3">held on ${escapeXml(eventDate)} &nbsp;·&nbsp; ${escapeXml(cert.organizer)}</text>
  <text x="800" y="880" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#93a1c3">Certificate ID: ${escapeXml(cert.id)}</text>
  <g transform="translate(112,860)">${corner}</g>
  <g transform="translate(1488-112,860)">${corner}</g>
  <path d="M150 880h250" stroke="rgba(120,160,255,0.5)" stroke-width="1"/>
  <text x="275" y="905" text-anchor="middle" font-family="Georgia, serif" font-size="20" fill="#eef2ff">Authorized Signatory</text>
  <path d="M1200 880h250" stroke="rgba(120,160,255,0.5)" stroke-width="1"/>
  <text x="1325" y="905" text-anchor="middle" font-family="Georgia, serif" font-size="20" fill="#eef2ff">INNOVENTA 2026</text>
  <text x="800" y="1040" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#5c6a90" letter-spacing="4">ISSUED ${escapeXml(issued)}</text>
</svg>`;
}

export function downloadCertificate(cert: Certificate): void {
  const svg = generateCertificateSvg(cert);
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${cert.id}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
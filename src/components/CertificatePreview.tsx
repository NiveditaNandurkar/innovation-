import type { Certificate } from '../types';
import { generateCertificateSvg } from '../utils/certificate';

export function CertificatePreview({ certificate }: { certificate: Certificate }) {
  return (
    <div className="cert-frame" style={{ width: '100%' }}>
      <svg
        viewBox="0 0 1600 1131"
        style={{ width: '100%', height: 'auto', display: 'block' }}
        role="img"
        aria-label={`Certificate awarded to ${certificate.participantName} for ${certificate.eventName}`}
        dangerouslySetInnerHTML={{
          __html: generateCertificateSvg(certificate).replace(/^<\?xml[^>]*\?>/, ''),
        }}
      />
    </div>
  );
}
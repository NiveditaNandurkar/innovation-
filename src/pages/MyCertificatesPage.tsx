import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Certificate } from '../types';
import { useSavedCertificates } from '../hooks/useSavedCertificates';
import { useToast } from '../providers/ToastProvider';
import { downloadCertificate } from '../utils/certificate';
import { Modal } from '../components/Modal';
import { CertificatePreview } from '../components/CertificatePreview';
import { EmptyState } from '../components/Shared';
import { Icon } from '../components/icons';
import { WebCorner } from '../components/SpiderBits';

export function MyCertificatesPage() {
  const [saved, setSaved] = useSavedCertificates();
  const [viewing, setViewing] = useState<Certificate | null>(null);
  const { success: notify, error: notifyError } = useToast();

  const handleRemove = (cert: Certificate) => {
    setSaved((prev) => {
      const next = prev.filter((c) => c.id !== cert.id);
      if (next.length === prev.length) {
        notifyError('Certificate could not be found in your collection.');
        return prev;
      }
      notify(`Removed ${cert.id} from My Certificates.`);
      return next;
    });
  };

  const handleDownload = (cert: Certificate) => {
    downloadCertificate(cert);
    notify(`Downloading ${cert.id}.svg`);
  };

  return (
    <div className="stack" style={{ gap: 26 }}>
      <div style={{ textAlign: 'center', position: 'relative', maxWidth: 640, marginInline: 'auto' }}>
        <div
          style={{ position: 'absolute', top: -70, right: -60, pointerEvents: 'none' }}
          aria-hidden="true"
        >
          <WebCorner size={160} color="var(--blue)" opacity={0.3} />
        </div>
        <p className="eyebrow">My Certificates</p>
        <h1 className="display-title">
          Your <span className="accent">Collection</span>
        </h1>
        <p className="subtitle" style={{ marginInline: 'auto' }}>
          Certificates you've saved are stored on this device and ready to view or download any time.
        </p>
      </div>

      {saved.length === 0 ? (
        <EmptyState
          icon="award"
          title="No saved certificates"
          message="Head to the Certificate Portal, verify a certificate ID, and press “Add to My Certificates” to build your collection."
        />
      ) : (
        <motion.div
          className="saved-grid"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        >
          <AnimatePresence>
            {saved.map((cert) => (
              <motion.article
                key={cert.id}
                className="event-card glass glass-hover"
                layout
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  show: { opacity: 1, y: 0 },
                  exit: { opacity: 0, scale: 0.95 },
                }}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              >
                <div className="spread wrap" style={{ gap: 8 }}>
                  <span className="chip chip--ok">
                    <Icon name="check" size={14} />
                    Verified ✓
                  </span>
                </div>

                <div>
                  <p className="muted" style={{ margin: '0 0 2px', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                    Participant
                  </p>
                  <h3 className="event-card__title" style={{ fontSize: '1.15rem' }}>
                    {cert.participantName}
                  </h3>
                </div>

                <div className="stack" style={{ gap: 8 }}>
                  <CertMeta label="Event" value={cert.eventName} />
                  <CertMeta label="Event Date" value={formatReadable(cert.eventDate)} />
                  <CertMeta label="Certificate ID" value={cert.id} />
                </div>

                <div className="row wrap" style={{ gap: 8, marginTop: 'auto' }}>
                  <button
                    type="button"
                    className="btn btn--sm btn--ghost"
                    onClick={() => setViewing(cert)}
                  >
                    <Icon name="eye" size={15} />
                    View
                  </button>
                  <button
                    type="button"
                    className="btn btn--sm btn--solid-blue"
                    onClick={() => handleDownload(cert)}
                  >
                    <Icon name="download" size={15} />
                    Download
                  </button>
                  <button
                    type="button"
                    className="btn btn--sm btn--red"
                    onClick={() => handleRemove(cert)}
                    aria-label={`Remove ${cert.id}`}
                  >
                    <Icon name="trash" size={15} />
                    Remove
                  </button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <Modal
        open={viewing !== null}
        onClose={() => setViewing(null)}
        label="Saved certificate"
        panelClassName="cert-view-panel"
      >
        {viewing && (
          <div className="stack" style={{ gap: 18, padding: 'clamp(20px, 3vw, 30px)' }}>
            <div className="spread">
              <span className="chip chip--ok">
                <Icon name="check" size={14} />
                Certificate Verified ✓
              </span>
              <button
                type="button"
                className="icon-btn"
                aria-label="Close certificate"
                onClick={() => setViewing(null)}
              >
                <Icon name="close" size={18} />
              </button>
            </div>
            <CertificatePreview certificate={viewing} />
            <div className="row wrap" style={{ gap: 8 }}>
              <button
                type="button"
                className="btn btn--sm btn--solid-red"
                onClick={() => handleDownload(viewing)}
              >
                <Icon name="download" size={15} />
                Download Certificate
              </button>
              <button
                type="button"
                className="btn btn--sm btn--ghost"
                onClick={() => setViewing(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function CertMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="muted" style={{ margin: 0, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
        {label}
      </p>
      <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem' }}>{value}</p>
    </div>
  );
}

function formatReadable(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Certificate } from '../types';
import {
  findCertificate,
  generateCertificate,
  TEST_STUDENTS,
} from '../data/certificates';
import { EVENTS } from '../data/events';
import { useSavedCertificates } from '../hooks/useSavedCertificates';
import { useToast } from '../providers/ToastProvider';
import { downloadCertificate } from '../utils/certificate';
import { Icon } from './icons';
import { WebCorner } from './SpiderBits';
import { CertificatePreview } from './CertificatePreview';

type PortalMode = 'generate' | 'verify';
type PortalState = 'idle' | 'loading' | 'empty' | 'valid' | 'notfound';

export function CertificatePortal() {
  const [mode, setMode] = useState<PortalMode>('generate');
  const [selectedEventId, setSelectedEventId] = useState<string>(EVENTS[0].id);
  const [usnInput, setUsnInput] = useState('');
  const [idInput, setIdInput] = useState('');
  const [state, setState] = useState<PortalState>('idle');
  const [result, setResult] = useState<Certificate | null>(null);
  const [saved, setSaved] = useSavedCertificates();
  const { success: notify, info: notifyInfo } = useToast();
  const usnInputRef = useRef<HTMLInputElement>(null);
  const idInputRef = useRef<HTMLInputElement>(null);

  const isSaved = useMemo(
    () => result !== null && saved.some((c) => c.id === result.id),
    [saved, result],
  );

  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUsn = usnInput.trim();
    if (!cleanUsn) {
      setState('empty');
      usnInputRef.current?.focus();
      return;
    }
    setState('loading');
    setResult(null);

    window.setTimeout(() => {
      const generated = generateCertificate(cleanUsn, selectedEventId);
      if (generated) {
        setResult(generated);
        setState('valid');
        notify(`Certificate generated for ${cleanUsn}!`);
      } else {
        setState('notfound');
      }
    }, 900);
  };

  const handleVerifyId = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = idInput.trim();
    if (!cleanId) {
      setState('empty');
      idInputRef.current?.focus();
      return;
    }
    setState('loading');
    setResult(null);

    window.setTimeout(() => {
      const match = findCertificate(cleanId);
      if (match) {
        setResult(match);
        setState('valid');
      } else {
        setState('notfound');
      }
    }, 850);
  };

  const handleReset = () => {
    setUsnInput('');
    setIdInput('');
    setResult(null);
    setState('idle');
    if (mode === 'generate') {
      usnInputRef.current?.focus();
    } else {
      idInputRef.current?.focus();
    }
  };

  const handleAdd = () => {
    if (!result) return;
    if (isSaved) {
      notifyInfo('This certificate is already saved in My Certificates.');
      return;
    }
    setSaved((prev) => [...prev, result]);
    notify(`Certificate ${result.id} saved to My Certificates.`);
  };

  const handleDownload = () => {
    if (!result) return;
    downloadCertificate(result);
    notify(`Downloading certificate ${result.id}.svg`);
  };

  return (
    <div className="stack" style={{ gap: 28 }}>
      {/* Hero Header with Spider-Man and Blue Glow Aesthetics */}
      <div
        style={{
          textAlign: 'center',
          position: 'relative',
          maxWidth: 780,
          marginInline: 'auto',
          paddingTop: 10,
        }}
      >
        <div
          style={{ position: 'absolute', top: -60, left: -60, pointerEvents: 'none' }}
          aria-hidden="true"
        >
          <WebCorner size={180} color="var(--blue)" opacity={0.35} />
        </div>
        <div
          style={{ position: 'absolute', top: -40, right: -60, pointerEvents: 'none' }}
          aria-hidden="true"
        >
          <WebCorner size={140} color="var(--red)" opacity={0.25} strokeWidth={1.2} />
        </div>

        <p className="eyebrow">Certificate Portal Generator</p>
        <h1 className="display-title">
          {mode === 'generate' ? (
            <>
              Generate your <span className="accent">Certificate</span>
            </>
          ) : (
            <>
              Verify your <span className="accent">Certificate</span>
            </>
          )}
        </h1>
        <p className="subtitle" style={{ marginInline: 'auto', maxWidth: '58ch' }}>
          {mode === 'generate'
            ? 'Select your completed INNOVENTA event, enter your Student USN, and generate an authenticated certificate with cryptographic verification.'
            : 'Enter an existing Certificate ID or Student USN to validate against the official INNOVENTA registry.'}
        </p>

        {/* Mode Selector Tabs */}
        <div className="portal-tabs" role="tablist">
          <button
            type="button"
            className={`portal-tab ${mode === 'generate' ? 'is-active' : ''}`}
            role="tab"
            aria-selected={mode === 'generate'}
            onClick={() => {
              setMode('generate');
              setState('idle');
              setResult(null);
            }}
          >
            <Icon name="award" size={17} />
            Generate Certificate
          </button>
          <button
            type="button"
            className={`portal-tab ${mode === 'verify' ? 'is-active' : ''}`}
            role="tab"
            aria-selected={mode === 'verify'}
            onClick={() => {
              setMode('verify');
              setState('idle');
              setResult(null);
            }}
          >
            <Icon name="shield" size={17} />
            Verify by ID
          </button>
        </div>
      </div>

      {/* Generator / Search Form */}
      {mode === 'generate' ? (
        <form className="glass portal-form-card" onSubmit={handleGenerate}>
          <div className="portal-form-grid">
            {/* Event Selector Dropdown */}
            <div className="form-group" style={{ flex: '1 1 320px' }}>
              <label htmlFor="event-select" className="form-label">
                <Icon name="calendar" size={15} />
                Select Event
              </label>
              <div className="custom-select-wrap">
                <select
                  id="event-select"
                  className="portal-select"
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                >
                  {EVENTS.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.name} ({evt.type})
                    </option>
                  ))}
                </select>
                <span className="select-arrow-icon">
                  <Icon name="chevronDown" size={16} />
                </span>
              </div>
            </div>

            {/* USN Number Input */}
            <div className="form-group" style={{ flex: '1 1 260px' }}>
              <label htmlFor="usn-input" className="form-label">
                <Icon name="shield" size={15} />
                College USN Number
              </label>
              <div className="search-box">
                <span className="search-icon">
                  <Icon name="users" size={17} />
                </span>
                <input
                  id="usn-input"
                  ref={usnInputRef}
                  className="search-input"
                  type="text"
                  placeholder="e.g. CM24075"
                  value={usnInput}
                  onChange={(e) => {
                    setUsnInput(e.target.value.toUpperCase());
                    if (state === 'empty') setState('idle');
                  }}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Generate Action Button */}
            <div className="form-group-btn">
              <button type="submit" className="btn btn--solid-red portal-action-btn">
                <Icon name="bolt" size={18} />
                Generate Certificate
              </button>
            </div>
          </div>

          {/* Test USN Number Quick Chips */}
          <div className="portal-test-chips-wrap">
            <span className="muted" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
              Test USNs:
            </span>
            {TEST_STUDENTS.map((student) => (
              <button
                key={student.usn}
                type="button"
                className="test-usn-chip"
                onClick={() => {
                  setUsnInput(student.usn);
                  if (state === 'empty') setState('idle');
                }}
                title={`${student.name} — ${student.department}`}
              >
                <code>{student.usn}</code>
                <span className="chip-name">({student.name.split(' ')[0]})</span>
              </button>
            ))}
          </div>
        </form>
      ) : (
        <form className="glass portal-form-card" onSubmit={handleVerifyId}>
          <div className="row wrap" style={{ gap: 12, alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: '1 1 360px' }}>
              <label htmlFor="cert-id-input" className="form-label">
                <Icon name="shield" size={15} />
                Certificate ID or USN
              </label>
              <div className="search-box">
                <span className="search-icon">
                  <Icon name="award" size={18} />
                </span>
                <input
                  id="cert-id-input"
                  ref={idInputRef}
                  className="search-input"
                  type="text"
                  placeholder="e.g. INNOVENTA-2026-001 or CM24075"
                  value={idInput}
                  onChange={(e) => {
                    setIdInput(e.target.value);
                    if (state === 'empty') setState('idle');
                  }}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
            </div>

            <button type="submit" className="btn btn--solid-red portal-action-btn">
              <Icon name="search" size={17} />
              Verify Certificate
            </button>
          </div>

          <div className="portal-test-chips-wrap" style={{ marginTop: 14 }}>
            <span className="muted" style={{ fontSize: '0.82rem' }}>
              Try sample IDs:
            </span>
            <button
              type="button"
              className="test-usn-chip"
              onClick={() => setIdInput('INNOVENTA-2026-001')}
            >
              <code>INNOVENTA-2026-001</code>
            </button>
            <button
              type="button"
              className="test-usn-chip"
              onClick={() => setIdInput('INNOVENTA-2026-002')}
            >
              <code>INNOVENTA-2026-002</code>
            </button>
          </div>
        </form>
      )}

      {/* Result & Feedback States */}
      <AnimatePresence mode="wait">
        {state === 'loading' && (
          <motion.div
            key="loading"
            className="glass loading-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="spinner" aria-hidden="true" />
            <p className="subtitle" style={{ margin: 0 }} role="status">
              {mode === 'generate'
                ? 'Validating USN & generating official certificate…'
                : 'Searching INNOVENTA registry…'}
            </p>
          </motion.div>
        )}

        {state === 'empty' && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="alert alert--danger" role="alert">
              <Icon name="alert" size={18} />
              <span>
                <strong>
                  {mode === 'generate'
                    ? 'Please enter a valid College USN number.'
                    : 'Please enter a Certificate ID or USN.'}
                </strong>{' '}
                Use one of the test USNs provided above (e.g. <code>CM24075</code>).
              </span>
            </div>
          </motion.div>
        )}

        {state === 'notfound' && (
          <motion.div
            key="notfound"
            className="glass result-panel"
            style={{ padding: '40px 24px', textAlign: 'center' }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 240, damping: 24 }}
          >
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              style={{
                width: 78,
                height: 78,
                marginInline: 'auto',
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                background: 'var(--danger-soft)',
                color: 'var(--danger)',
                marginBottom: 18,
              }}
            >
              <Icon name="alert" size={38} />
            </motion.div>
            <h2 className="display-title" style={{ fontSize: '1.6rem' }}>
              Certificate Record Not Found
            </h2>
            <p className="subtitle" style={{ marginInline: 'auto', maxWidth: '48ch' }}>
              No record found matching “{mode === 'generate' ? usnInput : idInput}”. Try using one of
              the test USN numbers: <code>CM24075</code>, <code>IT22081</code>, or{' '}
              <code>EC23114</code>.
            </p>
            <div className="row" style={{ justifyContent: 'center', marginTop: 14 }}>
              <button type="button" className="btn btn--ghost" onClick={handleReset}>
                <Icon name="refresh" size={16} />
                Try again
              </button>
            </div>
          </motion.div>
        )}

        {state === 'valid' && result && (
          <motion.div
            key="valid"
            className="glass-strong result-panel result-panel--ok"
            style={{ padding: 'clamp(20px, 3.5vw, 36px)' }}
            initial={{ opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 230, damping: 24 }}
          >
            <div className="spread wrap" style={{ gap: 10, marginBottom: 20 }}>
              <span className="chip chip--ok">
                <Icon name="check" size={15} />
                Status: Certificate Verified ✓
              </span>
              <span className="chip chip--blue">{result.id}</span>
            </div>

            <div className="spread" style={{ gap: 28, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <div style={{ position: 'relative', flex: '1 1 360px', minWidth: 280 }}>
                <CertificatePreview certificate={result} />
              </div>

              <div className="stack" style={{ flex: '1 1 320px', gap: 16 }}>
                <div>
                  <h2 className="display-title" style={{ fontSize: '1.5rem', marginBottom: 4 }}>
                    Certificate Verified ✓
                  </h2>
                  <p className="muted" style={{ fontSize: '0.88rem', margin: 0 }}>
                    Official INNOVENTA credential with verified cryptographic watermark.
                  </p>
                </div>

                <div className="stack" style={{ gap: 12 }}>
                  <CertRow label="Participant" value={result.participantName} icon="users" />
                  {result.usn && <CertRow label="College USN" value={result.usn} icon="shield" />}
                  <CertRow label="Event" value={result.eventName} icon="calendar" />
                  <CertRow label="Event Date" value={formatReadable(result.eventDate)} icon="clock" />
                  <CertRow label="Certificate ID" value={result.id} icon="award" />
                </div>

                <div className="stack" style={{ gap: 10, marginTop: 12 }}>
                  <button
                    type="button"
                    className="btn btn--solid-red"
                    onClick={handleDownload}
                  >
                    <Icon name="download" size={17} />
                    Download Certificate (.SVG)
                  </button>
                  <button
                    type="button"
                    className={`btn ${isSaved ? 'btn--ghost' : 'btn--solid-blue'}`}
                    onClick={handleAdd}
                  >
                    <Icon name="award" size={17} />
                    {isSaved ? 'Saved to My Certificates ✓' : 'Add to My Certificates'}
                  </button>
                  <button type="button" className="btn btn--ghost" onClick={handleReset}>
                    <Icon name="refresh" size={16} />
                    Verify / Generate Another
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CertRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: 'users' | 'calendar' | 'clock' | 'shield' | 'award';
}) {
  return (
    <div className="row" style={{ gap: 12, alignItems: 'center' }}>
      <span
        style={{
          width: 36,
          height: 36,
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          borderRadius: 10,
          background: 'var(--blue-soft)',
          color: 'var(--blue)',
        }}
      >
        <Icon name={icon} size={18} />
      </span>
      <div style={{ minWidth: 0 }}>
        <p
          className="muted"
          style={{
            margin: 0,
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          {label}
        </p>
        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.98rem' }}>{value}</p>
      </div>
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
import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { EventData, Registration } from '../types';
import { EVENTS } from '../data/events';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from '../providers/ToastProvider';
import { validateRegistration, hasErrors, type RegistrationErrors } from '../utils/validation';
import { Modal, Drawer } from './Modal';
import { Icon } from './icons';

interface RegistrationModalProps {
  event: EventData | null;
  onClose: () => void;
}

interface FormState {
  fullName: string;
  email: string;
  college: string;
  phone: string;
  eventId: string;
}

const EMPTY_FORM: FormState = { fullName: '', email: '', college: '', phone: '', eventId: '' };

export function RegistrationModal({ event, onClose }: RegistrationModalProps) {
  const [form, setForm] = useState<FormState>(() =>
    event ? { ...EMPTY_FORM, eventId: event.id } : { ...EMPTY_FORM },
  );
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [success, setSuccess] = useState<Registration | null>(null);
  const [, setRegistrations] = useLocalStorage<Registration[]>('innoventa_registrations', []);
  const { success: notify, error: notifyError } = useToast();

  const selectedEvent = useMemo(
    () => EVENTS.find((e) => e.id === form.eventId) ?? null,
    [form.eventId],
  );

  const setField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateRegistration(form);
    if (hasErrors(validation)) {
      setErrors(validation);
      notifyError('Please fix the highlighted fields to continue.');
      const firstKey = (['fullName', 'email', 'college', 'phone', 'eventId'] as const).find(
        (k) => validation[k],
      );
      if (firstKey) {
        document.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      }
      return;
    }
    const record: Registration = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      college: form.college.trim(),
      phone: form.phone.trim(),
      eventId: form.eventId,
      eventName: selectedEvent?.name ?? '',
      registeredOn: new Date().toISOString(),
    };
    setRegistrations((prev) => [...prev, record]);
    setSuccess(record);
    notify(`You're registered for ${record.eventName}! We can't wait to see you there.`);
  };

  const handleDone = () => {
    onClose();
  };

  const body = success ? (
    <div className="stack" style={{ gap: 22, textAlign: 'center', alignItems: 'center', padding: '26px 4px' }}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        style={{
          width: 74,
          height: 74,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          background: 'var(--ok-soft)',
          color: 'var(--ok)',
          boxShadow: '0 0 34px var(--ok-soft)',
        }}
      >
        <Icon name="check" size={40} />
      </motion.div>
      <h2 className="display-title" style={{ fontSize: '1.6rem' }}>
        You're in!
      </h2>
      <p className="subtitle" style={{ margin: 0 }}>
        Your registration for the event below has been recorded successfully.
      </p>
      <div className="glass" style={{ padding: '16px 18px', minWidth: 'min(100%,320px)' }}>
        <div className="row" style={{ justifyContent: 'center', gap: 8 }}>
          <Icon name="users" size={18} />
          <strong>{success.eventName}</strong>
        </div>
        <p className="muted" style={{ margin: '6px 0 0', fontSize: '0.84rem' }}>
          Confirmation ID: <code>{success.id.slice(0, 10)}…</code>
        </p>
      </div>
      <button type="button" className="btn btn--solid-red" onClick={handleDone}>
        Done
        <Icon name="check" size={16} />
      </button>
    </div>
  ) : (
    <form onSubmit={handleSubmit} noValidate>
      <div className="spread" style={{ alignItems: 'flex-start', marginBottom: 6 }}>
        <div>
          <p className="eyebrow" style={{ marginBottom: 4 }}>Event Registration</p>
          <h2 className="display-title" style={{ fontSize: '1.55rem' }}>
            {selectedEvent?.name ?? 'Register'}
          </h2>
        </div>
        <button
          type="button"
          className="icon-btn"
          aria-label="Close registration form"
          onClick={onClose}
        >
          <Icon name="close" size={19} />
        </button>
      </div>

      <div className="field">
        <label htmlFor="reg-event">Event</label>
        <select
          id="reg-event"
          name="eventId"
          value={form.eventId}
          onChange={(e) => setField('eventId', e.target.value)}
          aria-invalid={errors.eventId ? true : undefined}
          aria-describedby={errors.eventId ? 'err-eventId' : undefined}
        >
          <option value="">Select an event…</option>
          {EVENTS.map((e) => {
            const disabled = e.status === 'Filled' || e.status === 'Past';
            return (
              <option key={e.id} value={e.id} disabled={disabled}>
                {e.name}{disabled ? ' (filled)' : ''}
              </option>
            );
          })}
        </select>
        {errors.eventId && (
          <span id="err-eventId" className="field-error" role="alert">
            <Icon name="alert" size={14} />
            {errors.eventId}
          </span>
        )}
      </div>

      <Input
        id="reg-name"
        label="Full Name"
        name="fullName"
        placeholder="e.g. Miles Morales"
        value={form.fullName}
        error={errors.fullName}
        onChange={(v) => setField('fullName', v)}
      />
      <Input
        id="reg-email"
        label="Email"
        name="email"
        type="email"
        placeholder="you@college.edu"
        value={form.email}
        error={errors.email}
        onChange={(v) => setField('email', v)}
      />
      <Input
        id="reg-college"
        label="College"
        name="college"
        placeholder="Your university or institute"
        value={form.college}
        error={errors.college}
        onChange={(v) => setField('college', v)}
      />
      <Input
        id="reg-phone"
        label="Phone Number"
        name="phone"
        type="tel"
        placeholder="e.g. +91 98765 43210"
        value={form.phone}
        error={errors.phone}
        onChange={(v) => setField('phone', v)}
      />

      <button type="submit" className="btn btn--solid-red btn--block" style={{ marginTop: 6 }}>
        Confirm Registration
        <Icon name="send" size={16} />
      </button>
      <p className="muted" style={{ fontSize: '0.8rem', marginTop: 12, marginBottom: 0, textAlign: 'center' }}>
        This prototype stores registrations locally on your device.
      </p>
    </form>
  );

  return (
    <>
      <div className="modal-details center-panel">
        <Modal open={true} onClose={onClose} label="Event registration form">
          <div style={{ padding: 'clamp(20px, 3.5vw, 30px)' }}>{body}</div>
        </Modal>
      </div>
      <div className="modal-details drawer">
        <Drawer open={true} onClose={onClose} label="Event registration form">
          <div style={{ padding: 'clamp(20px, 3.5vw, 26px)' }}>{body}</div>
        </Drawer>
      </div>
    </>
  );
}

function Input({
  id,
  label,
  name,
  type = 'text',
  placeholder,
  value,
  error,
  onChange,
}: {
  id: string;
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        autoComplete="off"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `err-${name}` : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      <AnimatePresence>
        {error && (
          <motion.span
            id={`err-${name}`}
            className="field-error"
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Icon name="alert" size={14} />
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
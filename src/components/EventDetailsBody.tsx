import type { EventData } from '../types';
import { Icon } from './icons';
import { StatusChip, TypePill } from './Shared';
import { WebCorner } from './SpiderBits';
import { formatDate } from '../utils/date';

export function EventDetailsBody({
  event,
  onRegister,
  onClose,
}: {
  event: EventData;
  onRegister: (event: EventData) => void;
  onClose: () => void;
}) {
  const openForRegistration = event.status === 'Open' || event.status === 'Upcoming';
  const closedRecently = event.status === 'Filled' || event.status === 'Past';

  return (
    <div className="stack" style={{ gap: 18 }}>
      <div className="spread" style={{ alignItems: 'flex-start', gap: 12 }}>
        <div className="row wrap" style={{ gap: 8 }}>
          <TypePill type={event.type} />
          <StatusChip status={event.status} />
        </div>
        <button
          type="button"
          className="icon-btn"
          aria-label="Close event details"
          onClick={onClose}
        >
          <Icon name="close" size={19} />
        </button>
      </div>

      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -30, opacity: 0.5 }} aria-hidden="true">
          <WebCorner size={150} color="var(--blue)" opacity={0.25} />
        </div>
        <h2 className="display-title">{event.name}</h2>
      </div>

      <div className="glass" style={{ padding: '14px 16px' }}>
        <div className="row wrap" style={{ gap: 8 }}>
          <span className="meta-pill"><Icon name="calendar" size={15} />{formatDate(event.date)}</span>
          <span className="meta-pill"><Icon name="clock" size={15} />{event.time}</span>
          <span className="meta-pill"><Icon name="pin" size={15} />{event.venue}</span>
          <span className="meta-pill"><Icon name="users" size={15} />{event.organizer}</span>
        </div>
      </div>

      <div>
        <p className="subtitle" style={{ fontSize: '1rem' }}>{event.description}</p>
      </div>

      <div className="row wrap" style={{ gap: 8 }}>
        {event.tags.map((tag) => (
          <span key={tag} className="chip chip--blue">{tag}</span>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: 18, marginTop: 4 }}>
        {openForRegistration ? (
          <button
            type="button"
            className="btn btn--solid-red btn--block"
            onClick={() => onRegister(event)}
          >
            Register for this event
            <Icon name="arrowRight" size={17} />
          </button>
        ) : (
          <div className="alert alert--info" role="status">
            <Icon name="info" size={18} />
            <span>
              {closedRecently
                ? `Registration is currently ${event.status.toLowerCase()} for this event.`
                : 'Registration for this event is not available yet.'}
            </span>
          </div>
        )}
        <p className="muted" style={{ fontSize: '0.8rem', marginTop: 12, marginBottom: 0 }}>
          Registrations are stored locally for this prototype.
        </p>
      </div>
    </div>
  );
}
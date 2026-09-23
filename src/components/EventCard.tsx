import { motion } from 'framer-motion';
import type { EventData } from '../types';
import { Icon } from './icons';
import { StatusChip, TypePill } from './Shared';
import { WebCorner } from './SpiderBits';
import { formatDate } from '../utils/date';

interface EventCardProps {
  event: EventData;
  onViewDetails: (event: EventData) => void;
}

export function EventCard({ event, onViewDetails }: EventCardProps) {
  return (
    <motion.article
      className="event-card glass glass-hover"
      layout
      variants={{
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
    >
      <div className="card-webbing" aria-hidden="true">
        <WebCorner size={120} color="var(--red)" opacity={0.35} strokeWidth={1.1} />
        <WebCorner size={110} color="var(--blue)" opacity={0.3} strokeWidth={1.1} />
      </div>

      <div className="event-card__head">
        <TypePill type={event.type} />
        <StatusChip status={event.status} />
      </div>

      <h3 className="event-card__title">{event.name}</h3>
      <p className="event-card__desc">{event.shortDescription}</p>

      <div className="event-card__meta">
        <span className="meta-pill">
          <Icon name="calendar" size={14} />
          {formatDate(event.date)}
        </span>
        <span className="meta-pill">
          <Icon name="clock" size={14} />
          {event.time}
        </span>
        <span className="meta-pill">
          <Icon name="pin" size={14} />
          {event.venue}
        </span>
      </div>

      <div className="event-card__foot">
        <span className="muted" style={{ fontSize: '0.8rem' }}>
          Organized by {event.organizer}
        </span>
        <button
          type="button"
          className="btn btn--sm btn--solid-red"
          onClick={() => onViewDetails(event)}
        >
          View Details
          <Icon name="arrowRight" size={15} />
        </button>
      </div>
    </motion.article>
  );
}
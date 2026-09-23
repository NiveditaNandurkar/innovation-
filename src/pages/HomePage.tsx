import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { EventData } from '../types';
import { FEATURED_EVENTS } from '../data/events';
import { EventCarousel } from '../components/EventCarousel';
import { EventList } from '../components/EventList';
import { EventDetailModal } from '../components/EventDetailModal';
import { RegistrationModal } from '../components/RegistrationModal';
import { WebCorner } from '../components/SpiderBits';
import { Icon } from '../components/icons';

export function HomePage() {
  const [detailsEvent, setDetailsEvent] = useState<EventData | null>(null);
  const [registerEvent, setRegisterEvent] = useState<EventData | null>(null);

  return (
    <div className="page">
      <section className="hero">
        <div
          className="hero__web"
          style={{ top: -60, right: -40, pointerEvents: 'none' }}
          aria-hidden="true"
        >
          <WebCorner size={300} color="var(--red)" opacity={0.16} strokeWidth={1.2} />
        </div>
        <div
          className="hero__web"
          style={{ bottom: -40, left: -40, pointerEvents: 'none', transform: 'rotate(180deg)' }}
          aria-hidden="true"
        >
          <WebCorner size={220} color="var(--blue)" opacity={0.14} strokeWidth={1.2} />
        </div>

        <div className="shell hero__content stack" style={{ gap: 14 }}>
          <p className="eyebrow">INNOVENTA · Technical Recruitment Round 1</p>
          <h1 className="display-title" style={{ maxWidth: '18ch' }}>
            Where innovators <span className="accent">level up</span>
          </h1>
          <p className="subtitle" style={{ fontSize: '1.05rem' }}>
            Discover hackathons, workshops, tech talks, competitions, and seminars — register in a
            tap, and verify your certificate in seconds.
          </p>
          <div className="row wrap" style={{ gap: 10, marginTop: 4 }}>
            <button
              type="button"
              className="btn btn--solid-red"
              onClick={() =>
                document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Explore Events
              <Icon name="chevronDown" size={17} />
            </button>
            <Link className="btn btn--ghost" to="/certificates">
              <Icon name="shield" size={17} />
              Verify a Certificate
            </Link>
          </div>
        </div>
      </section>

      <section className="shell section" id="featured">
        <h2 className="section-title" style={{ marginBottom: 22 }}>
          Featured Events
        </h2>
        <EventCarousel
          events={FEATURED_EVENTS}
          onViewDetails={setDetailsEvent}
          onRegister={setRegisterEvent}
        />
      </section>

      <section className="shell section" id="events" style={{ paddingTop: 8 }}>
        <h2 className="section-title" style={{ marginBottom: 22 }}>
          All Events
        </h2>
        <EventList onViewDetails={setDetailsEvent} />
      </section>

      <EventDetailModal
        event={detailsEvent}
        onClose={() => setDetailsEvent(null)}
        onRegister={(event) => {
          setDetailsEvent(null);
          setRegisterEvent(event);
        }}
      />
      {registerEvent && (
        <RegistrationModal event={registerEvent} onClose={() => setRegisterEvent(null)} />
      )}
    </div>
  );
}
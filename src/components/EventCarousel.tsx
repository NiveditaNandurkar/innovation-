import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { EventData } from '../types';
import { Icon } from './icons';
import { StatusChip, TypePill } from './Shared';
import { CinematicEventPlayer } from './CinematicEventPlayer';
import { formatDate } from '../utils/date';

interface EventCarouselProps {
  events: EventData[];
  onViewDetails: (event: EventData) => void;
  onRegister?: (event: EventData) => void;
}

export function EventCarousel({ events, onViewDetails, onRegister }: EventCarouselProps) {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [expandedEvent, setExpandedEvent] = useState<EventData | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const [reducedMotion] = useState<boolean>(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  const maxIndex = Math.max(0, events.length - 1);
  const clamped = Math.min(index, maxIndex);
  const activeEvent = events[clamped] || events[0];

  const goTo = useCallback(
    (next: number) => {
      setIndex(Math.min(maxIndex, Math.max(0, next)));
    },
    [maxIndex],
  );

  const next = useCallback(
    () => goTo(index >= maxIndex ? 0 : index + 1),
    [goTo, index, maxIndex],
  );

  const prev = useCallback(
    () => goTo(index <= 0 ? maxIndex : index - 1),
    [goTo, index, maxIndex],
  );

  // Auto advance every 6s unless paused by hover or expanded modal
  useEffect(() => {
    if (isHovered || reducedMotion || expandedEvent !== null) return;
    const timer = window.setInterval(next, 6000);
    return () => window.clearInterval(timer);
  }, [isHovered, reducedMotion, expandedEvent, next]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (expandedEvent) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    }
  };

  // Subtle 3D mouse parallax tilt on active center card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: xPct * 12, y: -yPct * 10 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      className="cinematic-carousel-wrapper"
      role="region"
      aria-label="Cinematic Event Carousel"
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Dynamic atmospheric background blur derived from the currently active event */}
      <div className="cinematic-backdrop-ambience" aria-hidden="true">
        {activeEvent?.backdropUrl && (
          <div
            className="cinematic-ambient-image"
            style={{ backgroundImage: `url(${activeEvent.backdropUrl})` }}
          />
        )}
        <div
          className="cinematic-ambient-orb orb-primary"
          style={{
            background: activeEvent?.accentColor || 'var(--red)',
          }}
        />
        <div
          className="cinematic-ambient-orb orb-secondary"
          style={{
            background: 'var(--blue)',
          }}
        />
        <div className="cinematic-ambient-mesh" />
      </div>

      {/* 3D Perspective Stage */}
      <div className="cinematic-stage-3d">
        <div className="cinematic-cards-container">
          {events.map((event, i) => {
            const diff = i - clamped;
            const isCenter = diff === 0;
            const isLeft = diff < 0;
            const absDiff = Math.abs(diff);

            // Hide cards beyond 2 positions to maximize GPU efficiency
            if (absDiff > 2) return null;

            // Compute 3D coverflow transforms
            let xOffset = 0;
            let rotateY = 0;
            let scale = 1;
            let opacity = 1;
            let zIndex = 10;
            let blur = 0;

            if (isCenter) {
              xOffset = 0;
              rotateY = tilt.x;
              scale = 1;
              opacity = 1;
              zIndex = 10;
              blur = 0;
            } else if (absDiff === 1) {
              xOffset = isLeft ? -280 : 280;
              rotateY = isLeft ? 26 : -26;
              scale = 0.84;
              opacity = 0.52;
              zIndex = 8;
              blur = 2.5;
            } else if (absDiff === 2) {
              xOffset = isLeft ? -490 : 490;
              rotateY = isLeft ? 36 : -36;
              scale = 0.70;
              opacity = 0.24;
              zIndex = 6;
              blur = 5;
            }

            return (
              <motion.article
                key={event.id}
                layoutId={`carousel-card-${event.id}`}
                className={`cinematic-card-3d ${isCenter ? 'is-center' : 'is-side'}`}
                style={{
                  zIndex,
                  filter: `blur(${blur}px)`,
                }}
                animate={{
                  x: expandedEvent ? (isCenter ? 0 : isLeft ? -400 : 400) : xOffset,
                  rotateY: expandedEvent ? 0 : rotateY,
                  scale: expandedEvent ? (isCenter ? 1.05 : 0.75) : scale,
                  opacity: expandedEvent ? (isCenter ? 1 : 0) : opacity,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 220,
                  damping: 26,
                  mass: 0.9,
                }}
                onClick={() => {
                  if (isCenter) {
                    setExpandedEvent(event);
                  } else {
                    goTo(i);
                  }
                }}
                role="button"
                tabIndex={isCenter ? 0 : -1}
                aria-label={`Event: ${event.name}`}
              >
                {/* Poster / Media Area with glass overlay */}
                <div className="cinematic-card-poster-wrap">
                  {event.posterUrl ? (
                    <img
                      src={event.posterUrl}
                      alt={event.name}
                      className="cinematic-card-poster-img"
                      loading="lazy"
                    />
                  ) : (
                    <div className="cinematic-card-poster-fallback">
                      <Icon name="award" size={48} />
                    </div>
                  )}

                  {/* Gradient shadow overlay for text contrast */}
                  <div className="cinematic-poster-gradient" />

                  {/* Glass highlight sheen animation */}
                  <div className="cinematic-glass-sheen" />

                  {/* Category and Status Chips */}
                  <div className="cinematic-card-top-chips">
                    <TypePill type={event.type} />
                    <StatusChip status={event.status} />
                  </div>

                  {/* Play / Preview glowing button for Center card */}
                  {isCenter && (
                    <motion.button
                      type="button"
                      className="cinematic-center-play-trigger"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedEvent(event);
                      }}
                      aria-label="Expand event trailer and details"
                    >
                      <div className="play-pulse-ring" />
                      <Icon name="play" size={24} />
                    </motion.button>
                  )}
                </div>

                {/* Card Glass Content Panel */}
                <div className="cinematic-card-content">
                  <div className="cinematic-card-header">
                    <span className="cinematic-card-index">
                      {String(i + 1).padStart(2, '0')} / {String(events.length).padStart(2, '0')}
                    </span>
                    {event.duration && (
                      <span className="cinematic-card-duration">
                        <Icon name="clock" size={13} />
                        {event.duration}
                      </span>
                    )}
                  </div>

                  <h3 className="cinematic-card-title display-title">{event.name}</h3>

                  <p className="cinematic-card-desc">{event.shortDescription}</p>

                  <div className="cinematic-card-meta-row">
                    <span className="meta-pill">
                      <Icon name="calendar" size={14} />
                      {formatDate(event.date)}
                    </span>
                    <span className="meta-pill">
                      <Icon name="pin" size={14} />
                      {event.venue}
                    </span>
                  </div>

                  {/* Bottom Action Row */}
                  <div className="cinematic-card-action-bar">
                    <button
                      type="button"
                      className="btn btn--solid-red cinematic-btn-expand"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedEvent(event);
                      }}
                    >
                      <Icon name="play" size={16} />
                      Watch Preview
                    </button>

                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(event);
                      }}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* Sleek Glass Navigation Controls */}
      <div className="cinematic-carousel-controls">
        <div className="cinematic-nav-buttons">
          <button
            type="button"
            className="cinematic-arrow-btn"
            aria-label="Previous event"
            onClick={prev}
          >
            <Icon name="arrowLeft" size={20} />
          </button>
          <button
            type="button"
            className="cinematic-arrow-btn"
            aria-label="Next event"
            onClick={next}
          >
            <Icon name="arrowRight" size={20} />
          </button>
        </div>

        {/* Dynamic Pagination Dots */}
        <div className="cinematic-pagination-dots" role="tablist" aria-label="Event pagination">
          {events.map((evt, i) => (
            <button
              key={evt.id}
              type="button"
              className={`cinematic-dot ${i === clamped ? 'is-active' : ''}`}
              style={{
                background:
                  i === clamped ? activeEvent?.accentColor || 'var(--red)' : undefined,
              }}
              aria-label={`Go to slide ${i + 1}: ${evt.name}`}
              aria-selected={i === clamped}
              role="tab"
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>

      {/* Morphing Expanded State: Cinematic Streaming Player Modal */}
      <AnimatePresence>
        {expandedEvent && (
          <CinematicEventPlayer
            event={expandedEvent}
            onClose={() => setExpandedEvent(null)}
            onRegister={(evt) => {
              if (onRegister) {
                onRegister(evt);
              } else {
                onViewDetails(evt);
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
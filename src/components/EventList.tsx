import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { EventData, EventType } from '../types';
import { EVENT_TYPES } from '../types';
import { EVENTS } from '../data/events';
import { EventCard } from './EventCard';
import { Icon } from './icons';
import { EmptyState } from './Shared';

const FILTERS: ('All' | EventType)[] = ['All', ...EVENT_TYPES];

interface EventListProps {
  onViewDetails: (event: EventData) => void;
}

export function EventList({ onViewDetails }: EventListProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof FILTERS)[number]>('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EVENTS.filter((event) => {
      const matchesQuery =
        !q ||
        event.name.toLowerCase().includes(q) ||
        event.shortDescription.toLowerCase().includes(q) ||
        event.organizer.toLowerCase().includes(q);
      const matchesCategory = category === 'All' || event.type === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  return (
    <div className="stack" style={{ gap: 22 }}>
      <div className="glass" style={{ padding: '18px 20px' }}>
        <div className="spread wrap" style={{ gap: 14 }}>
          <div className="search-box" style={{ flex: '1 1 320px' }}>
            <span className="search-icon">
              <Icon name="search" size={18} />
            </span>
            <label htmlFor="event-search" className="sr-only">
              Search events by name, description, or organizer
            </label>
            <input
              id="event-search"
              className="search-input"
              type="search"
              placeholder="Search events…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                className="icon-btn search-clear"
                style={{ width: 34, height: 34 }}
                aria-label="Clear search"
                onClick={() => setQuery('')}
              >
                <Icon name="close" size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="spread wrap" style={{ gap: 12, marginTop: 14 }}>
          <div className="segmented" role="group" aria-label="Filter by category">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                aria-pressed={category === filter}
                onClick={() => setCategory(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <span className="muted" style={{ fontSize: '0.84rem' }}>
            {filtered.length} event{filtered.length === 1 ? '' : 's'} found
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="search"
          title="No events found"
          message={
            query
              ? `Nothing matches " ${query} " in ${category === 'All' ? 'all categories' : category}. Try a different keyword or category.`
              : `No events currently exist in the ${category} category.`
          }
          action={
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setQuery('');
                setCategory('All');
              }}
            >
              Clear filters
            </button>
          }
        />
      ) : (
        <motion.div
          className="events-grid"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.055 } } }}
        >
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} onViewDetails={onViewDetails} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { EventData } from '../types';
import { Icon } from './icons';
import { StatusChip, TypePill } from './Shared';
import { formatDate } from '../utils/date';

interface CinematicEventPlayerProps {
  event: EventData;
  onClose: () => void;
  onRegister: (event: EventData) => void;
}

export function CinematicEventPlayer({
  event,
  onClose,
  onRegister,
}: CinematicEventPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState('00:00');
  const [durationStr, setDurationStr] = useState('02:45');
  const [showControls, setShowControls] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock background scroll
  useEffect(() => {
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = origOverflow;
    };
  }, []);

  // Autoplay on mount with sound fallback
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // If browser blocked unmuted autoplay, mute and try again
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
              setIsPlaying(false);
            });
          }
        });
    }
  }, [event, isMuted]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) window.clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2800);
  };

  const togglePlay = () => {
    if (videoRef.current && !videoError) {
      if (videoRef.current.paused) {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    } else {
      setIsMuted(!isMuted);
    }
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || !isFinite(sec)) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration;
      setProgress((cur / dur) * 100);
      setCurrentTimeStr(formatSeconds(cur));
      setDurationStr(formatSeconds(dur));
    }
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setProgress(val);
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = (val / 100) * videoRef.current.duration;
      setCurrentTimeStr(formatSeconds(videoRef.current.currentTime));
    }
  };

  return (
    <div
      className="cinematic-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cinematic-player-title"
    >
      {/* Cinematic ambient atmospheric glow behind the theater panel */}
      <div
        className="cinematic-ambient-glow"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${event.accentColor || '#ff2d40'}44 0%, rgba(139, 92, 246, 0.2) 40%, transparent 75%)`,
        }}
        aria-hidden="true"
      />

      <motion.div
        className="cinematic-player-card"
        layoutId={`carousel-card-${event.id}`}
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        onMouseMove={handleMouseMove}
      >
        {/* Floating close button */}
        <button
          type="button"
          className="cinematic-close-btn"
          aria-label="Close cinematic player"
          onClick={onClose}
        >
          <Icon name="close" size={20} />
        </button>

        {/* Streaming Video Theater Area */}
        <div className="cinematic-video-wrapper" onClick={togglePlay}>
          {event.trailerVideoUrl && !videoError ? (
            <video
              ref={videoRef}
              src={event.trailerVideoUrl}
              poster={event.backdropUrl || event.posterUrl}
              className="cinematic-video-element"
              autoPlay
              muted={isMuted}
              loop
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onError={() => setVideoError(true)}
            />
          ) : (
            <div className="cinematic-animated-fallback-visualizer">
              <img
                src={event.backdropUrl || event.posterUrl}
                alt={event.name}
                className="cinematic-video-element"
                style={{ filter: isPlaying ? 'brightness(0.7) saturate(1.3)' : 'brightness(0.4)' }}
              />
              {/* Dynamic waveform & particle matrix overlay for interactive simulation */}
              <div className="visualizer-equalizer-bars" aria-hidden="true">
                {[...Array(16)].map((_, idx) => (
                  <span
                    key={idx}
                    className="eq-bar"
                    style={{
                      animationDuration: `${0.4 + (idx % 5) * 0.15}s`,
                      animationPlayState: isPlaying ? 'running' : 'paused',
                      background: event.accentColor || 'var(--red)',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Cinematic lighting gradient overlays */}
          <div className="cinematic-video-gradient-top" />
          <div className="cinematic-video-gradient-bottom" />

          {/* Floating streaming quality badges */}
          <div className="cinematic-video-badges">
            <span className="badge-4k">4K ULTRA HD</span>
            <span className="badge-live">
              <span className="badge-live-pulse" />
              EVENT TEASER
            </span>
          </div>

          {/* Center Play/Pause Indicator Overlay */}
          {!isPlaying && (
            <button
              type="button"
              className="cinematic-big-play-btn"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              aria-label="Play event teaser"
            >
              <Icon name="play" size={32} />
            </button>
          )}

          {/* Video Player Controls Bar */}
          <motion.div
            className="cinematic-controls-bar"
            animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 8 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Scrubber */}
            <div className="cinematic-scrubber-container">
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progress}
                onChange={handleScrub}
                className="cinematic-scrubber"
                aria-label="Video timeline scrubber"
              />
              <div
                className="cinematic-scrubber-fill"
                style={{ width: `${progress}%`, background: event.accentColor || 'var(--red)' }}
              />
            </div>

            <div className="cinematic-controls-row">
              <div className="cinematic-controls-left">
                <button
                  type="button"
                  className="cinematic-ctrl-btn"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  <Icon name={isPlaying ? 'close' : 'play'} size={18} />
                </button>
                <button
                  type="button"
                  className="cinematic-ctrl-btn"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  <Icon name="volume" size={18} />
                  <span style={{ fontSize: '0.72rem', marginLeft: 4, opacity: 0.8 }}>
                    {isMuted ? 'MUTED' : 'AUDIO ON'}
                  </span>
                </button>
                <span className="cinematic-timestamp">
                  {currentTimeStr} / {durationStr}
                </span>
              </div>

              <div className="cinematic-controls-right">
                <span className="cinematic-stream-title">{event.name}</span>
                <span className="cinematic-badge-audio">DOLBY 5.1</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Event Detail Information Below Player */}
        <div className="cinematic-info-body">
          <div className="cinematic-info-header">
            <div className="row wrap" style={{ gap: 8, alignItems: 'center' }}>
              <TypePill type={event.type} />
              <StatusChip status={event.status} />
              {event.duration && (
                <span className="meta-pill" style={{ borderColor: 'rgba(255,255,255,0.18)' }}>
                  <Icon name="clock" size={14} />
                  {event.duration}
                </span>
              )}
            </div>

            <h2 id="cinematic-player-title" className="cinematic-title display-title">
              {event.name}
            </h2>

            {event.tagline && (
              <p className="cinematic-tagline" style={{ color: event.accentColor || 'var(--blue)' }}>
                {event.tagline}
              </p>
            )}
          </div>

          <div className="cinematic-meta-grid">
            <div className="cinematic-meta-cell">
              <span className="cinematic-meta-label">
                <Icon name="calendar" size={14} /> Date
              </span>
              <span className="cinematic-meta-val">{formatDate(event.date)}</span>
            </div>
            <div className="cinematic-meta-cell">
              <span className="cinematic-meta-label">
                <Icon name="clock" size={14} /> Time
              </span>
              <span className="cinematic-meta-val">{event.time}</span>
            </div>
            <div className="cinematic-meta-cell">
              <span className="cinematic-meta-label">
                <Icon name="pin" size={14} /> Venue
              </span>
              <span className="cinematic-meta-val">{event.venue}</span>
            </div>
            <div className="cinematic-meta-cell">
              <span className="cinematic-meta-label">
                <Icon name="users" size={14} /> Organizer
              </span>
              <span className="cinematic-meta-val">{event.organizer}</span>
            </div>
          </div>

          <div className="cinematic-description-block">
            <p className="cinematic-description-text">{event.description}</p>
          </div>

          {event.tags && event.tags.length > 0 && (
            <div className="row wrap" style={{ gap: 6, marginTop: 4 }}>
              {event.tags.map((tag) => (
                <span key={tag} className="tag-chip">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Call to Action */}
          <div className="cinematic-actions-row">
            <button
              type="button"
              className="btn btn--solid-red cinematic-register-btn"
              disabled={event.status === 'Filled'}
              onClick={() => {
                onClose();
                onRegister(event);
              }}
            >
              <Icon name="bolt" size={18} />
              {event.status === 'Filled' ? 'Event Filled' : 'Register for Event'}
            </button>

            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: event.name,
                    text: event.shortDescription,
                    url: window.location.href,
                  }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Event link copied to clipboard!');
                }
              }}
            >
              <Icon name="share" size={16} />
              Share Event
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

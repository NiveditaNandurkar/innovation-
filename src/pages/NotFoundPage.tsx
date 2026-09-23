import { Link } from 'react-router-dom';
import { Icon } from '../components/icons';
import { WebCorner } from '../components/SpiderBits';

export function NotFoundPage() {
  return (
    <div className="page">
      <div className="shell" style={{ paddingTop: '10vh', textAlign: 'center' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <span style={{ position: 'absolute', top: -70, left: -70, zIndex: -1 }} aria-hidden="true">
            <WebCorner size={150} color="var(--red)" opacity={0.3} />
          </span>
          <h1 className="display-title" style={{ fontSize: 'clamp(4rem, 16vw, 9rem)', color: 'var(--red)', textShadow: '0 0 40px var(--red-glow)' }}>
            404
          </h1>
        </div>
        <p className="eyebrow" style={{ marginTop: 6 }}>Lost in the web</p>
        <h2 className="display-title" style={{ fontSize: '1.6rem', marginBottom: 12 }}>
          This page doesn't exist
        </h2>
        <p className="subtitle" style={{ marginInline: 'auto', marginBottom: 24 }}>
          Even Spider-Man misses a swing sometimes. Let's get you back to the main application.
        </p>
        <Link className="btn btn--solid-red" to="/">
          <Icon name="arrowLeft" size={17} />
          Back to Events
        </Link>
      </div>
    </div>
  );
}
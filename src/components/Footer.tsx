import { SpiderEmblem } from './SpiderBits';

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <SpiderEmblem size={30} />
        <p className="muted" style={{ margin: 0 }}>
          INNOVENTA 2026 · Event &amp; Certificate Management Prototype
        </p>
        <p className="muted" style={{ margin: 0, fontSize: '0.82rem' }}>
          Built for the INNOVENTA Technical Recruitment — Round 1
        </p>
      </div>
    </footer>
  );
}
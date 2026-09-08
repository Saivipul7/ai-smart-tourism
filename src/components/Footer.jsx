import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-col">
          <div className="nav-brand" style={{ marginBottom: '1rem' }}>
            <span>🌍</span>
            <span className="text-gradient">SmartTourism</span>
          </div>
          <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem', maxWidth: '320px', marginBottom: '1.2rem' }}>
            Empowering modern travelers with AI-crafted personalized itineraries, real-time local intelligence, and seamless destination discovery.
          </p>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <span style={{ background: 'rgba(255,255,255,0.06)', padding: '0.5rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem' }}>⚡ Fast AI Engine</span>
            <span style={{ background: 'rgba(255,255,255,0.06)', padding: '0.5rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem' }}>🌐 Global Coverage</span>
          </div>
        </div>

        <div className="footer-col">
          <h4>Navigation</h4>
          <ul>
            <li><Link to="/">Home Landing</Link></li>
            <li><Link to="/explore">Explore Destinations</Link></li>
            <li><Link to="/trip-planner">AI Trip Planner</Link></li>
            <li><Link to="/dashboard">Saved Dashboard</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Popular Destinations</h4>
          <ul>
            <li><Link to="/explore?category=Culture">Paris & Rome Heritage</Link></li>
            <li><Link to="/explore?category=City">Tokyo Modern Metropolis</Link></li>
            <li><Link to="/explore?category=Beach">Bali Island Retreat</Link></li>
            <li><Link to="/explore?category=Mountain">Swiss Alps Trails</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Travel Newsletter</h4>
          <p style={{ color: 'var(--color-text-dim)', fontSize: '0.85rem', marginBottom: '0.8rem' }}>
            Get curated AI travel guides and flight price drop alerts.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="form-input" 
              style={{ fontSize: '0.85rem', padding: '0.6rem 0.8rem' }}
            />
            <button className="btn-primary" style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 AI Smart Tourism Platform. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">API Documentation</a>
        </div>
      </div>
    </footer>
  );
}

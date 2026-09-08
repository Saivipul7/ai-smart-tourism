import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [backendOk, setBackendOk] = useState(true);

  useEffect(() => {
    api.get('/health/')
      .then(() => setBackendOk(true))
      .catch(() => setBackendOk(false));
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="nav-brand">
          <span style={{ fontSize: '1.6rem' }}>🌍</span>
          <span className="text-gradient">SmartTourism</span>
          <span style={{ 
            fontSize: '0.65rem', 
            background: 'var(--color-primary-glow)', 
            padding: '2px 6px', 
            borderRadius: '4px',
            color: 'var(--color-primary-light)',
            fontWeight: 700
          }}>AI</span>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/explore" className={`nav-link ${location.pathname === '/explore' ? 'active' : ''}`}>
                Explore
              </Link>
            </li>
            <li>
              <Link to="/trip-planner" className={`nav-link ${location.pathname === '/trip-planner' ? 'active' : ''}`}>
                ✨ AI Planner
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                My Dashboard
              </Link>
            </li>
          </ul>
        </nav>

        <div className="nav-actions">
          <div className="status-pill" title={backendOk ? "FastAPI Backend Connected" : "Backend Offline"}>
            <span className="status-dot" style={{ backgroundColor: backendOk ? 'var(--color-success)' : 'var(--color-error)' }} />
            <span>{backendOk ? 'AI Online' : 'Offline'}</span>
          </div>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <Link to="/profile" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                👤 {user.name}
              </Link>
              <button onClick={logout} className="nav-link" style={{ fontSize: '0.85rem' }}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary" style={{ padding: '0.55rem 1.2rem', fontSize: '0.85rem' }}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

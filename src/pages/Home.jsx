import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/destinations/')
      .then(res => {
        setDestinations(res.data.destinations.slice(0, 3));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/trip-planner?destination=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '4rem' }}>
      
      {/* ── HERO SECTION ────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        minHeight: '82vh',
        display: 'flex',
        alignItems: 'center',
        justify-content: 'center',
        textAlign: 'center',
        padding: '3rem 1.5rem',
        background: `
          radial-gradient(ellipse 70% 50% at 50% -10%, rgba(108, 99, 255, 0.28) 0%, transparent 70%),
          radial-gradient(circle at 80% 60%, rgba(0, 242, 254, 0.15) 0%, transparent 50%),
          var(--color-bg)
        `
      }}>
        <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.4rem 1.2rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(108, 99, 255, 0.12)',
            border: '1px solid rgba(108, 99, 255, 0.3)',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: 'var(--color-primary-light)',
            marginBottom: '1.5rem',
            backdropFilter: 'blur(8px)'
          }}>
            <span>✨ Next-Gen AI Travel Assistant</span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span>Version 2.0</span>
          </div>

          <h1 style={{
            fontSize: '3.6rem',
            fontWeight: 800,
            letterSpacing: '-1.5px',
            lineHeight: 1.15,
            marginBottom: '1.5rem'
          }}>
            Craft Your Dream Journey with <span className="text-gradient">Artificial Intelligence</span>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'var(--color-text-dim)',
            maxWidth: '640px',
            marginBottom: '2.5rem'
          }}>
            Instant day-by-day travel itineraries customized to your duration, budget, travel style, and favorite activities in seconds.
          </p>

          {/* Quick AI Search Box */}
          <form onSubmit={handleSearchSubmit} className="glass-panel" style={{
            width: '100%',
            maxWidth: '680px',
            padding: '0.6rem',
            display: 'flex',
            gap: '0.6rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}>
            <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1rem' }}>
              <span style={{ fontSize: '1.3rem' }}>📍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Where do you want to go? (e.g. Paris, Tokyo, Bali...)"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '1.05rem'
                }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '0.9rem 1.8rem', whiteSpace: 'nowrap' }}>
              ✨ Plan Trip
            </button>
          </form>

          {/* Quick Tag Suggestion */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '1.2rem', fontSize: '0.88rem', color: 'var(--color-muted)' }}>
            <span>Popular:</span>
            {['Paris', 'Tokyo', 'Bali', 'Swiss Alps'].map(dest => (
              <button
                key={dest}
                type="button"
                onClick={() => navigate(`/trip-planner?destination=${encodeURIComponent(dest)}`)}
                style={{
                  color: 'var(--color-text-dim)',
                  background: 'rgba(255,255,255,0.05)',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.82rem',
                  transition: 'all 0.2s'
                }}
              >
                {dest}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ── FEATURE HIGHLIGHTS ──────────────────────────────────── */}
      <section className="page-container" style={{ padding: '0 2rem' }}>
        <div className="page-header">
          <h2 className="page-title">Why Travel With SmartTourism AI?</h2>
          <p className="page-subtitle">Designed to save hours of travel planning while discovering hidden local gems.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🤖</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.6rem' }}>AI Itinerary Engine</h3>
            <p style={{ color: 'var(--color-text-dim)', fontSize: '0.95rem' }}>
              Algorithms build complete morning, afternoon, and evening timelines optimized for minimal travel time between spots.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💰</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.6rem' }}>Smart Budget Estimation</h3>
            <p style={{ color: 'var(--color-text-dim)', fontSize: '0.95rem' }}>
              Interactive cost breakdown covering accommodation, food, activities, and transport tailored to your budget tier.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎒</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.6rem' }}>Dynamic Packing Checklist</h3>
            <p style={{ color: 'var(--color-text-dim)', fontSize: '0.95rem' }}>
              Get automated packing lists adjusted for your destination's local weather and planned activities.
            </p>
          </div>

        </div>
      </section>

      {/* ── FEATURED DESTINATIONS ───────────────────────────────── */}
      <section className="page-container" style={{ padding: '0 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem' }}>Trending Destinations</h2>
            <p style={{ color: 'var(--color-text-dim)', fontSize: '0.95rem' }}>Explore top-rated travel spots curated by AI.</p>
          </div>
          <Link to="/explore" className="btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
            View All Destinations →
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlignment: 'center', padding: '3rem', color: 'var(--color-text-dim)' }}>
            Loading top destinations…
          </div>
        ) : (
          <div className="dest-grid">
            {destinations.map(dest => (
              <div key={dest.id} className="glass-panel dest-card">
                <img src={dest.image} alt={dest.title} className="dest-card-image" />
                <div className="dest-card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="dest-tag">{dest.category}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-accent-gold)', fontWeight: 600 }}>
                      ⭐ {dest.rating} ({dest.reviews})
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', marginTop: '0.4rem', marginBottom: '0.3rem' }}>{dest.title}</h3>
                  <p style={{ color: 'var(--color-text-dim)', fontSize: '0.88rem', marginBottom: '1.2rem', flexGrow: 1 }}>
                    {dest.tagline}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-muted)' }}>Weather: {dest.weather}</span>
                    <button
                      type="button"
                      onClick={() => navigate(`/trip-planner?destination=${encodeURIComponent(dest.title)}`)}
                      className="btn-primary"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    >
                      Plan Trip
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── CALL TO ACTION ──────────────────────────────────────── */}
      <section className="page-container" style={{ padding: '0 2rem' }}>
        <div className="glass-panel" style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(108,99,255,0.25) 0%, rgba(0,242,254,0.1) 100%), var(--glass-bg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          <h2 style={{ fontSize: '2.5rem', maxWidth: '700px' }}>
            Ready to Experience the Future of Smart Travel?
          </h2>
          <p style={{ color: 'var(--color-text-dim)', fontSize: '1.1rem', maxWidth: '540px' }}>
            Join thousands of travelers using AI SmartTourism to plan personalized trips in seconds.
          </p>
          <Link to="/trip-planner" className="btn-accent" style={{ padding: '1rem 2.2rem', fontSize: '1.05rem' }}>
            ✨ Start AI Trip Planner Now
          </Link>
        </div>
      </section>

    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [savedTrips, setSavedTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = () => {
    api.get('/trips/')
      .then(res => {
        setSavedTrips(res.data.trips || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Remove this saved trip from your dashboard?')) {
      try {
        await api.delete(`/trips/${id}`);
        setSavedTrips(prev => prev.filter(t => t.id !== id));
      } catch (err) {
        alert('Failed to delete trip.');
      }
    }
  };

  const totalDays = savedTrips.reduce((acc, t) => acc + (t.days || 0), 0);
  const totalSpend = savedTrips.reduce((acc, t) => acc + (t.budget_breakdown?.total || 0), 0);

  return (
    <div className="page-container">
      <div className="page-header" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">My Travel <span className="text-gradient">Dashboard</span></h1>
          <p className="page-subtitle" style={{ margin: 0 }}>
            Manage your AI-crafted itineraries, upcoming journeys, and saved destinations.
          </p>
        </div>
        <Link to="/trip-planner" className="btn-primary">
          ✨ Plan New Trip
        </Link>
      </div>

      {/* ── STATS CARDS ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>📍 Saved Itineraries</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.2rem', color: 'var(--color-primary-light)' }}>
            {savedTrips.length}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>🗓️ Total Days Planned</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.2rem', color: 'var(--color-secondary)' }}>
            {totalDays} Days
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>💵 Total Planned Budget</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.2rem', color: 'var(--color-success)' }}>
            ${totalSpend}
          </div>
        </div>
      </div>

      {/* ── SAVED TRIPS LIST ────────────────────────────────────── */}
      <h2 style={{ fontSize: '1.6rem', marginBottom: '1.5rem' }}>Saved Itineraries</h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-dim)' }}>
          Loading saved itineraries...
        </div>
      ) : savedTrips.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🗺️</div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No Saved Trips Yet</h3>
          <p style={{ color: 'var(--color-text-dim)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            Generate your first personalized AI travel itinerary and save it here for offline access and trip tracking.
          </p>
          <Link to="/trip-planner" className="btn-primary">
            ✨ Generate First Trip
          </Link>
        </div>
      ) : (
        <div className="dest-grid">
          {savedTrips.map(trip => (
            <div key={trip.id} className="glass-panel dest-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/trip/${trip.id}`, { state: { trip } })}>
              <div style={{ position: 'relative', height: '180px' }}>
                <img src={trip.image} alt={trip.destination} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, trip.id)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(239,68,68,0.85)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                  title="Remove Trip"
                >
                  ✕
                </button>
              </div>

              <div className="dest-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="dest-tag">{trip.days} Days</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-success)', fontWeight: 700 }}>
                    ${trip.budget_breakdown?.total}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.3rem', marginTop: '0.4rem', marginBottom: '0.3rem' }}>{trip.destination}</h3>
                <p style={{ color: 'var(--color-text-dim)', fontSize: '0.85rem', marginBottom: '1.2rem' }}>{trip.tagline}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.8rem', borderTop: '1px solid var(--color-border)', fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                  <span>Tier: {trip.budget_tier}</span>
                  <span style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>View Details →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

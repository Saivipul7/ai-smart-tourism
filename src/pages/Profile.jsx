import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Profile() {
  const { user, logout } = useAuth();
  
  const [preferences, setPreferences] = useState({
    defaultBudget: 'moderate',
    travelStyle: 'Explorer & Cultural Enthusiast',
    homeAirport: 'JFK - New York',
    currency: 'USD ($)',
    dietary: 'None / Flexitarian'
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!user) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '5rem' }}>
        <h2>Please sign in to view your profile preferences.</h2>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
      <div className="page-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
        <h1 className="page-title">User <span className="text-gradient">Profile & Preferences</span></h1>
        <p className="page-subtitle" style={{ margin: 0 }}>
          Manage your travel profile, preferred currencies, and AI itinerary customization defaults.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* User Card */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 800,
            color: '#fff'
          }}>
            {user.name ? user.name.charAt(0) : 'A'}
          </div>

          <div style={{ flexGrow: 1 }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>{user.name}</h2>
            <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>{user.email}</p>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: '0.4rem' }}>
              Member since {user.member_since || '2026'}
            </div>
          </div>

          <button onClick={logout} className="btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
            Logout
          </button>
        </div>

        {/* Preferences Form */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>✈️</span> Travel AI Defaults
          </h3>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Preferred Travel Style</label>
                <input
                  type="text"
                  className="form-input"
                  value={preferences.travelStyle}
                  onChange={(e) => setPreferences({ ...preferences, travelStyle: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Default Budget Level</label>
                <select
                  className="form-select"
                  value={preferences.defaultBudget}
                  onChange={(e) => setPreferences({ ...preferences, defaultBudget: e.target.value })}
                >
                  <option value="budget">💰 Backpacker ($)</option>
                  <option value="moderate">💳 Moderate ($$)</option>
                  <option value="luxury">👑 Luxury ($$$)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Home Airport / City</label>
                <input
                  type="text"
                  className="form-input"
                  value={preferences.homeAirport}
                  onChange={(e) => setPreferences({ ...preferences, homeAirport: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Display Currency</label>
                <select
                  className="form-select"
                  value={preferences.currency}
                  onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                >
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                  <option value="GBP (£)">GBP (£)</option>
                  <option value="JPY (¥)">JPY (¥)</option>
                </select>
              </div>
            </div>

            {saved && (
              <div style={{ color: 'var(--color-success)', background: 'rgba(16,185,129,0.1)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.88rem' }}>
                ✓ Preferences updated successfully!
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ padding: '0.85rem', width: 'fit-content', marginTop: '0.5rem' }}>
              Save Preferences
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}

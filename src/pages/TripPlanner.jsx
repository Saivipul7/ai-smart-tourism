import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function TripPlanner() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const initialDest = searchParams.get('destination') || 'Paris';

  const [formData, setFormData] = useState({
    destination: initialDest,
    days: 3,
    budget: 'moderate',
    traveler_type: 'solo',
    interests: ['culture', 'food', 'relaxation']
  });

  const [generating, setGenerating] = useState(false);
  const [generatedTrip, setGeneratedTrip] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [savedStatus, setSavedStatus] = useState(false);

  const interestOptions = [
    { id: 'culture', label: '🏛️ Culture & Museums' },
    { id: 'food', label: '🍜 Culinary & Dining' },
    { id: 'nature', label: '🌿 Nature & Parks' },
    { id: 'adventure', label: '🚴 Adventure & Trails' },
    { id: 'relaxation', label: '💆 Spa & Wellness' }
  ];

  const handleInterestToggle = (id) => {
    setFormData(prev => {
      const exists = prev.interests.includes(id);
      if (exists) {
        if (prev.interests.length <= 1) return prev; // Keep at least one
        return { ...prev, interests: prev.interests.filter(i => i !== id) };
      } else {
        return { ...prev, interests: [...prev.interests, id] };
      }
    });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.destination.trim()) {
      setErrorMsg('Please enter a target destination city or region.');
      return;
    }
    setErrorMsg('');
    setGenerating(true);
    setGeneratedTrip(null);
    setSavedStatus(false);

    try {
      const res = await api.post('/trips/generate', formData);
      setGeneratedTrip(res.data.trip);
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Failed to generate itinerary. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!generatedTrip) return;
    try {
      await api.post('/trips/save', { trip_data: generatedTrip });
      setSavedStatus(true);
    } catch (err) {
      alert('Failed to save trip.');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">AI Smart <span className="text-gradient">Trip Generator</span></h1>
        <p className="page-subtitle">
          Configure your travel preferences and let our AI engine instantly build a customized day-by-day itinerary.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: generatedTrip ? '1fr 1.2fr' : '1fr', gap: '2.5rem', maxWidth: generatedTrip ? '1280px' : '720px', margin: '0 auto' }}>
        
        {/* ── PLANNER FORM ────────────────────────────────────────── */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span>⚙️</span> Trip Preferences
          </h2>

          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            
            {/* Destination Input */}
            <div className="form-group">
              <label className="form-label">Destination City / Country</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Paris, Tokyo, Bali, New York..."
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                required
              />
            </div>

            {/* Duration Slider */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Trip Duration (Days)</label>
                <span style={{ fontWeight: 700, color: 'var(--color-primary-light)' }}>{formData.days} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                value={formData.days}
                onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) })}
                style={{ accentColor: 'var(--color-primary)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                <span>1 Day</span>
                <span>3 Days</span>
                <span>5 Days</span>
                <span>7 Days</span>
              </div>
            </div>

            {/* Budget & Traveler Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Budget Tier</label>
                <select
                  className="form-select"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                >
                  <option value="budget">💰 Backpacker ($)</option>
                  <option value="moderate">💳 Moderate ($$)</option>
                  <option value="luxury">👑 Luxury ($$$)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Traveler Type</label>
                <select
                  className="form-select"
                  value={formData.traveler_type}
                  onChange={(e) => setFormData({ ...formData, traveler_type: e.target.value })}
                >
                  <option value="solo">🧑 Solo Traveler</option>
                  <option value="couple">👩‍❤️‍👨 Couple</option>
                  <option value="family">👨‍👩‍👧‍👦 Family</option>
                  <option value="friends">👯 Friends Group</option>
                </select>
              </div>
            </div>

            {/* Interest Tags */}
            <div className="form-group">
              <label className="form-label">Focus Interests (Select multiple)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {interestOptions.map(opt => {
                  const selected = formData.interests.includes(opt.id);
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => handleInterestToggle(opt.id)}
                      style={{
                        padding: '0.5rem 0.9rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        transition: 'all 0.2s',
                        background: selected ? 'rgba(108, 99, 255, 0.25)' : 'rgba(255,255,255,0.04)',
                        color: selected ? 'var(--color-primary-light)' : 'var(--color-text-dim)',
                        border: selected ? '1px solid var(--color-primary-light)' : '1px solid var(--color-border)'
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {errorMsg && (
              <div style={{ color: 'var(--color-error)', fontSize: '0.9rem', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                ⚠️ {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={generating}
              className="btn-accent"
              style={{ width: '100%', padding: '1rem', marginTop: '0.5rem', fontSize: '1rem' }}
            >
              {generating ? '✨ AI Processing Itinerary…' : '✨ Generate AI Itinerary'}
            </button>

          </form>
        </div>

        {/* ── GENERATED ITINERARY PREVIEW ─────────────────────────── */}
        {generating && (
          <div className="glass-panel" style={{
            padding: '4rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justify-content: 'center',
            textAlign: 'center',
            gap: '1.5rem'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid rgba(108, 99, 255, 0.2)',
              borderTopColor: 'var(--color-primary-light)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <h3 style={{ fontSize: '1.3rem' }}>Analyzing Destination & Weather...</h3>
            <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem', maxWidth: '360px' }}>
              Building optimized route schedules, estimated budget totals, and activity recommendations.
            </p>
          </div>
        )}

        {generatedTrip && !generating && (
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeSlideUp 0.4s ease' }}>
            
            {/* Header Banner */}
            <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '180px' }}>
              <img src={generatedTrip.image} alt={generatedTrip.destination} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(11,15,25,0.9) 0%, transparent 80%)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '1.2rem'
              }}>
                <div>
                  <h2 style={{ fontSize: '1.8rem', color: '#fff' }}>{generatedTrip.destination}</h2>
                  <p style={{ color: 'var(--color-text-dim)', fontSize: '0.88rem' }}>{generatedTrip.tagline}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem', textAlign: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>Duration</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{generatedTrip.days} Days</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>Est. Total</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-success)' }}>${generatedTrip.budget_breakdown.total}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>Weather</div>
                <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{generatedTrip.weather_advisory}</div>
              </div>
            </div>

            {/* Day 1 Preview */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--color-primary-light)', marginBottom: '0.75rem' }}>
                {generatedTrip.itinerary[0]?.title}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {generatedTrip.itinerary[0]?.schedule.map((item, idx) => (
                  <div key={idx} style={{ fontSize: '0.88rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>📍 <strong>{item.period}:</strong> {item.title}</span>
                    <span style={{ color: 'var(--color-text-dim)', fontSize: '0.8rem' }}>{item.cost}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
              <button
                type="button"
                onClick={handleSaveTrip}
                disabled={savedStatus}
                className="btn-secondary"
                style={{ flexGrow: 1, padding: '0.8rem' }}
              >
                {savedStatus ? '✓ Saved to Dashboard' : '💾 Save Itinerary'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate(`/trip/${generatedTrip.id}`, { state: { trip: generatedTrip } })}
                className="btn-primary"
                style={{ flexGrow: 1, padding: '0.8rem' }}
              >
                View Full Itinerary →
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

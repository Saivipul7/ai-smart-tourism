import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function TripDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(location.state?.trip || null);
  const [loading, setLoading] = useState(!location.state?.trip);
  const [activeTab, setActiveTab] = useState('itinerary'); // 'itinerary' | 'budget' | 'packing' | 'tips'
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    if (!trip && id) {
      api.get(`/trips/${id}`)
        .then(res => {
          setTrip(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id, trip]);

  const toggleCheck = (idx) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '5rem' }}>
        <h2>Loading Itinerary Details...</h2>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '5rem' }}>
        <h2>Trip Not Found</h2>
        <p style={{ color: 'var(--color-text-dim)', margin: '1rem 0 2rem' }}>
          We couldn't retrieve the itinerary details for this trip.
        </p>
        <Link to="/trip-planner" className="btn-primary">Go to AI Trip Planner</Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      
      {/* ── HEADER BANNER ────────────────────────────────────────── */}
      <div className="glass-panel" style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        padding: '3rem 2.5rem',
        marginBottom: '2.5rem',
        background: `
          linear-gradient(to right, rgba(11,15,25,0.92) 30%, rgba(11,15,25,0.6) 100%),
          url(${trip.image}) center/cover no-repeat
        `
      }}>
        <div style={{ maxWidth: '700px' }}>
          <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.8rem' }}>
            <span className="dest-tag">{trip.budget_tier} Tier</span>
            <span className="dest-tag" style={{ background: 'rgba(52,211,153,0.15)', borderColor: 'rgba(52,211,153,0.3)', color: 'var(--color-success)' }}>
              {trip.traveler_type}
            </span>
          </div>

          <h1 style={{ fontSize: '2.8rem', color: '#fff', marginBottom: '0.5rem' }}>
            {trip.destination}
          </h1>
          <p style={{ color: 'var(--color-text-dim)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            {trip.tagline}
          </p>

          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.92rem' }}>
            <div>⏳ <strong>Duration:</strong> {trip.days} Days</div>
            <div>💰 <strong>Total Est.:</strong> <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>${trip.budget_breakdown?.total}</span></div>
            <div>🌤️ <strong>Weather:</strong> {trip.weather_advisory}</div>
          </div>
        </div>
      </div>

      {/* ── TABS NAVIGATION ──────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.8rem', overflowX: 'auto' }}>
        {[
          { id: 'itinerary', label: '📅 Day-by-Day Timeline' },
          { id: 'budget', label: '📊 Budget Breakdown' },
          { id: 'packing', label: '🎒 Smart Packing List' },
          { id: 'tips', label: '💡 AI Travel Advice' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.65rem 1.4rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.95rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              background: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--color-text-dim)',
              border: activeTab === tab.id ? '1px solid var(--color-primary-light)' : '1px solid transparent'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT: DAY BY DAY TIMELINE ─────────────────────── */}
      {activeTab === 'itinerary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {trip.itinerary?.map((day) => (
            <div key={day.day} className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary-light)' }}>{day.title}</h2>
                <span style={{ fontWeight: 600, color: 'var(--color-muted)', fontSize: '0.9rem' }}>
                  Day Est.: {day.day_total_estimated}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {day.schedule.map((item, i) => (
                  <div key={i} style={{
                    display: 'grid',
                    gridTemplateColumns: '140px 1fr 100px',
                    gap: '1.5rem',
                    alignItems: 'center',
                    padding: '1.2rem',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary-light)', textTransform: 'uppercase' }}>
                        {item.period}
                      </span>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)' }}>{item.time}</div>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '1.1rem', marginBottom: '0.3rem', color: '#fff' }}>{item.title}</h4>
                      <p style={{ fontSize: '0.88rem', color: 'var(--color-text-dim)', marginBottom: '0.4rem' }}>{item.description}</p>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>📍 Location: {item.location}</div>
                    </div>

                    <div style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-success)', fontSize: '1.05rem' }}>
                      {item.cost}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB CONTENT: BUDGET BREAKDOWN ────────────────────────── */}
      {activeTab === 'budget' && (
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Estimated Trip Budget</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '14px', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>🏨 Accommodation</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.4rem' }}>${trip.budget_breakdown?.accommodation}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '14px', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>🎫 Activities & Tours</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.4rem' }}>${trip.budget_breakdown?.activities}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '14px', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>🍷 Dining & Food</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.4rem' }}>${trip.budget_breakdown?.dining}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '14px', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>🚕 Local Transport</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.4rem' }}>${trip.budget_breakdown?.transportation}</div>
            </div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '1.5rem', borderRadius: '14px', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-success)' }}>Total Estimated Cost</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-dim)' }}>Calculated for {trip.days} days ({trip.budget_tier} level)</p>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-success)' }}>
              ${trip.budget_breakdown?.total}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB CONTENT: PACKING LIST ─────────────────────────────── */}
      {activeTab === 'packing' && (
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Smart AI Packing Checklist</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {trip.packing_list?.map((item, idx) => (
              <div
                key={idx}
                onClick={() => toggleCheck(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.2rem',
                  background: checkedItems[idx] ? 'rgba(52, 211, 153, 0.08)' : 'rgba(255,255,255,0.03)',
                  borderRadius: '12px',
                  border: checkedItems[idx] ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid var(--color-border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <input
                  type="checkbox"
                  checked={!!checkedItems[idx]}
                  onChange={() => {}}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--color-success)', cursor: 'pointer' }}
                />
                <span style={{ flexGrow: 1, textDecoration: checkedItems[idx] ? 'line-through' : 'none', color: checkedItems[idx] ? 'var(--color-muted)' : 'var(--color-text)' }}>
                  {item.item}
                </span>
                <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '6px', color: 'var(--color-text-dim)' }}>
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB CONTENT: AI TIPS & ADVICE ──────────────────────────── */}
      {activeTab === 'tips' && (
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Local Advice & Smart Tips</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '2rem' }}>
            {trip.ai_tips?.map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', padding: '1.2rem', background: 'rgba(108,99,255,0.08)', borderRadius: '12px', border: '1px solid rgba(108,99,255,0.25)' }}>
                <span style={{ fontSize: '1.4rem' }}>💡</span>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text)' }}>{tip}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>💱 Local Currency</h4>
              <p style={{ color: 'var(--color-text-dim)' }}>{trip.currency}</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>🗣️ Primary Language</h4>
              <p style={{ color: 'var(--color-text-dim)' }}>{trip.language}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';

export default function Explore() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [destinations, setDestinations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Culture', 'City', 'Beach', 'Mountain'];

  useEffect(() => {
    fetchDestinations();
  }, [selectedCategory, searchQuery]);

  const fetchDestinations = () => {
    setLoading(true);
    let url = '/destinations/';
    const params = [];
    if (selectedCategory && selectedCategory !== 'All') {
      params.push(`category=${encodeURIComponent(selectedCategory)}`);
    }
    if (searchQuery.trim()) {
      params.push(`search=${encodeURIComponent(searchQuery.trim())}`);
    }
    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    api.get(url)
      .then(res => {
        setDestinations(res.data.destinations || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Explore <span className="text-gradient">World Destinations</span></h1>
        <p className="page-subtitle">
          Discover curated global destinations powered by smart travel insights and instant AI itinerary creation.
        </p>
      </div>

      {/* ── Search & Filter Controls ────────────────────────────── */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flexGrow: 1, minWidth: '260px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="🔍 Search destinations by name, region, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              style={{
                padding: '0.55rem 1.2rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: '0.9rem',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                background: selectedCategory === cat ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.05)',
                color: selectedCategory === cat ? '#fff' : 'var(--color-text-dim)',
                border: selectedCategory === cat ? '1px solid var(--color-primary-light)' : '1px solid var(--color-border)'
              }}
            >
              {cat === 'All' ? '🌟 All Destinations' : cat}
            </button>
          ))}
        </div>

      </div>

      {/* ── Destinations Grid ───────────────────────────────────── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-dim)' }}>
          Searching destinations...
        </div>
      ) : destinations.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏝️</div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No Destinations Found</h3>
          <p style={{ color: 'var(--color-text-dim)', marginBottom: '1.5rem' }}>
            Try resetting your search query or choosing another category.
          </p>
          <button 
            className="btn-secondary" 
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="dest-grid">
          {destinations.map(dest => (
            <div key={dest.id} className="glass-panel dest-card">
              <div style={{ position: 'relative' }}>
                <img src={dest.image} alt={dest.title} className="dest-card-image" />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(0,0,0,0.65)',
                  backdropFilter: 'blur(6px)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--color-accent-gold)'
                }}>
                  {dest.price_tier}
                </span>
              </div>

              <div className="dest-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="dest-tag">{dest.category}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-accent-gold)', fontWeight: 600 }}>
                    ⭐ {dest.rating}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', marginTop: '0.4rem', marginBottom: '0.3rem' }}>
                  {dest.title}
                </h3>
                
                <p style={{ color: 'var(--color-text-dim)', fontSize: '0.88rem', marginBottom: '1rem', flexGrow: 1 }}>
                  {dest.description}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.2rem' }}>
                  {dest.tags.map(t => (
                    <span key={t} style={{
                      fontSize: '0.75rem',
                      background: 'rgba(255,255,255,0.06)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      color: 'var(--color-text-dim)'
                    }}>
                      #{t}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>Best Time</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}>{dest.best_months}</div>
                  </div>
                  <button
                    onClick={() => navigate(`/trip-planner?destination=${encodeURIComponent(dest.title)}`)}
                    className="btn-primary"
                    style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
                  >
                    ✨ AI Plan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

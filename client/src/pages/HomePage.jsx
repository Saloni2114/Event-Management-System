import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchEvents, getApiErrorMessage, registerForEvent } from '../api'
import { useAuth } from '../AuthContext'
import { useToast } from '../components/ToastContext'
import EventCard from '../components/EventCard'

export default function HomePage() {
  const { user, isAdmin } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
      .then((data) => {
        console.log("🔥 EVENTS FROM BACKEND:", data)

        const normalized = data.map((event) => {
          const id = event._id || event.id

          if (!id) {
            console.warn("❌ Missing ID:", event)
            return null
          }

          return {
            ...event,
            _id: id,
            venue: event.venue || event.location || '',
            seats: Number(event.seats || 0),
            registeredCount: Array.isArray(event.registrations)
              ? event.registrations.length
              : Number(event.registeredCount || 0)
          }
        }).filter(Boolean)

        setEvents(normalized)
      })
      .catch((err) => addToast('error', 'Error', getApiErrorMessage(err, 'Could not load events')))
      .finally(() => setLoading(false))
  }, [addToast])

  const handleRegister = async (eventId) => {
    // Update local state to reflect registration
    setRegistrations(prev => [...prev, eventId])
    setEvents(prev => prev.map(e =>
      (e._id || e.id) === eventId ? { ...e, registeredCount: Number(e.registeredCount || 0) + 1 } : e
    ))
  }

  // Get featured events (top 6)
  const featuredEvents = events.slice(0, 6)
  const totalSeatsLeft = events.reduce((s, e) => s + Math.max(0, Number(e.seats || 0) - Number(e.registeredCount || 0)), 0)

  const handleExploreEvents = () => {
    document.getElementById("events-section").scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">✨ Event Management System</div>
          <h1 className="hero-title">
            Discover & Manage Events
            <span className="hero-highlight">Easily</span>
          </h1>
          <p className="hero-subtitle">
            Join thousands of users discovering amazing events, registering seamlessly,
            and creating unforgettable experiences. Your next adventure awaits.
          </p>
          <div className="hero-actions">
            <button
              className="btn-primary-large"
              onClick={handleExploreEvents}
            >
              Explore Events
              <span className="btn-arrow">→</span>
            </button>
            {isAdmin && (
              <button
                className="btn-secondary-large"
                onClick={() => navigate('/create')}
              >
                + Create Event
              </button>
            )}
            {!user && (
              <button
                className="btn-secondary-large"
                onClick={() => navigate('/login')}
              >
                Get Started
              </button>
            )}
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">{events.length}</div>
              <div className="stat-label">Events</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{registrations.length}</div>
              <div className="stat-label">Your Registrations</div>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-icon">📅</div>
            <div className="card-title">Tech Conference 2024</div>
            <div className="card-meta">March 15 • 500 attendees</div>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">🎨</div>
            <div className="card-title">Art Workshop</div>
            <div className="card-meta">March 20 • 50 attendees</div>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">🎵</div>
            <div className="card-title">Music Festival</div>
            <div className="card-meta">April 5 • 2000 attendees</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose EventMS?</h2>
            <p className="section-subtitle">
              Everything you need to discover, register, and manage events effortlessly
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3 className="feature-title">Easy Event Creation</h3>
              <p className="feature-description">
                Create stunning events in minutes with our intuitive interface.
                Add details, set capacity, and publish instantly.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Secure Registration</h3>
              <p className="feature-description">
                Safe and secure registration process with real-time availability
                tracking and instant confirmation.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Real-time Updates</h3>
              <p className="feature-description">
                Get instant notifications about event changes, new registrations,
                and important updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section id="events-section" className="events-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Events</h2>
            <p className="section-subtitle">
              Discover the most popular upcoming events
            </p>
          </div>

          {loading && (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading amazing events...</p>
            </div>
          )}

          {!loading && events.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <h3>No events yet</h3>
              <p>Be the first to create an amazing event!</p>
              {isAdmin && (
                <button
                  className="btn-primary"
                  onClick={() => navigate('/create')}
                >
                  Create First Event
                </button>
              )}
            </div>
          )}

          {!loading && featuredEvents.length > 0 && (
            <>
              <div className="events-grid">
                {featuredEvents.map(event => (
                  <EventCard
                    key={event._id || event.id}
                    event={event}
                    onRegister={handleRegister}
                    isRegistered={registrations.includes(event._id || event.id)}
                  />
                ))}
              </div>
              <div className="view-all-section">
                <button
                  className="btn-secondary"
                  onClick={() => navigate('/')}
                >
                  View All Events ({events.length})
                  <span className="btn-arrow">→</span>
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Create Your Next Event?</h2>
            <p className="cta-subtitle">
              Join our community of event organizers and start creating memorable experiences today.
            </p>
            <div className="cta-actions">
              {isAdmin ? (
                <button
                  className="btn-primary-large"
                  onClick={() => navigate('/create')}
                >
                  Create New Event
                  <span className="btn-arrow">→</span>
                </button>
              ) : (
                <button
                  className="btn-primary-large"
                  onClick={() => navigate('/login')}
                >
                  Get Started Free
                  <span className="btn-arrow">→</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
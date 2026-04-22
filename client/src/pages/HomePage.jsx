import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchEvents, registerForEvent } from '../api'
import { useAuth } from '../AuthContext'
import { useToast } from '../components/ToastContext'
import EventCard from '../components/EventCard'

export default function HomePage() {
  const { user }     = useAuth()
  const { addToast } = useToast()
  const navigate     = useNavigate()
  const [events,        setEvents]        = useState([])
  const [registrations, setRegistrations] = useState([])
  const [loading,       setLoading]       = useState(true)

  useEffect(() => {
    fetchEvents()                           // GET /api/events
      .then(setEvents)
      .catch(() => addToast('error', 'Error', 'Could not load events'))
      .finally(() => setLoading(false))
  }, [])

  const handleRegister = async (eventId) => {
    if (!user) { navigate('/login'); return }
    try {
      await registerForEvent(eventId)       // POST /api/events/:id/register
      setRegistrations(prev => [...prev, eventId])
      setEvents(prev => prev.map(e =>
        (e._id || e.id) === eventId ? { ...e, registeredCount: e.registeredCount + 1 } : e
      ))
      addToast('success', 'Registered!', 'You are now registered for this event.')
    } catch (err) {
      addToast('error', 'Failed', err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="page">
      <div className="container">
        {/* Hero */}
        <div className="card" style={{ padding:'var(--space-8)', marginBottom:'var(--space-8)' }}>
          <div className="badge">Event Management System</div>
          <h1 style={{ fontSize:'var(--text-xl)', lineHeight:1.15, margin:'var(--space-3) 0 var(--space-2)' }}>
            Discover and register for upcoming events
          </h1>
          <p className="muted" style={{ marginBottom:'var(--space-6)' }}>
            Browse all events. Login to register or create your own events.
          </p>
          {user
            ? <button className="btn btn-primary" onClick={() => navigate('/create')}>+ Create Event</button>
            : <button className="btn btn-primary" onClick={() => navigate('/login')}>Login to Get Started</button>
          }
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'var(--space-4)', marginTop:'var(--space-6)' }}>
            {[['Events', events.length], ['My Registrations', registrations.length], ['Seats Left', events.reduce((s,e)=>s+(e.seats-e.registeredCount),0)]].map(([lbl, val]) => (
              <div key={lbl} style={{ padding:'var(--space-4)', background:'var(--color-surface-2)', border:'1px solid var(--color-border)', borderRadius:'var(--radius-lg)' }}>
                <div style={{ fontSize:'var(--text-lg)', fontWeight:700 }}>{val}</div>
                <div style={{ fontSize:'var(--text-xs)', color:'var(--color-text-faint)', textTransform:'uppercase', letterSpacing:'.04em' }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Listing */}
        <div className="section-head">
          <h2 className="section-title">All Events</h2>
          <span className="muted" style={{ fontSize:'var(--text-sm)' }}>{events.length} events</span>
        </div>
        {loading && <p className="muted">Loading events…</p>}
        {!loading && events.length === 0 && <div className="empty">No events yet. Create the first one!</div>}
        {!loading && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px,1fr))', gap:'var(--space-5)' }}>
            {events.map(event => (
              <EventCard
                key={event._id || event.id}
                event={event}
                onRegister={handleRegister}
                isRegistered={registrations.includes(event._id || event.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
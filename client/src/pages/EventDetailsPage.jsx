import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchEventById, registerForEvent } from '../api'
import { useAuth } from '../AuthContext'
import { useToast } from '../components/ToastContext'

export default function EventDetailsPage() {
  const { id }       = useParams()
  const { user }     = useAuth()
  const { addToast } = useToast()
  const navigate     = useNavigate()
  const [event,      setEvent]      = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [registered, setRegistered] = useState(false)
  const [regLoading, setRegLoading] = useState(false)

  useEffect(() => {
    fetchEventById(id)                      // GET /api/events/:id
      .then(setEvent)
      .catch(() => addToast('error', 'Error', 'Event not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleRegister = async () => {
    if (!user) { navigate('/login'); return }
    setRegLoading(true)
    try {
      await registerForEvent(id)            // POST /api/events/:id/register
      setRegistered(true)
      setEvent(p => ({ ...p, registeredCount: p.registeredCount + 1 }))
      addToast('success', 'Registered!', 'You are now registered.')
    } catch (err) {
      addToast('error', 'Failed', err.response?.data?.message || 'Registration failed')
    } finally { setRegLoading(false) }
  }

  if (loading) return <div className="page"><div className="container"><p className="muted">Loading…</p></div></div>
  if (!event)  return <div className="page"><div className="container"><div className="empty">Event not found.</div></div></div>

  const seatsLeft = event.seats - event.registeredCount

  return (
    <div className="page">
      <div className="container">
        <button className="btn btn-secondary" onClick={() => navigate('/')} style={{ marginBottom:'var(--space-6)' }}>← Back</button>
        <div style={{ display:'grid', gridTemplateColumns:'1.2fr .8fr', gap:'var(--space-6)' }}>
          <div className="card" style={{ padding:'var(--space-6)' }}>
            <div className="badge">{event.category}</div>
            <h1 style={{ fontSize:'var(--text-xl)', lineHeight:1.2, margin:'var(--space-3) 0' }}>{event.title}</h1>
            <p className="muted">{event.description}</p>
            <div className="info-list">
              {[['Date', event.date],['Time', event.time],['Venue', event.venue],['Organizer', event.organizer]].map(([l,v]) => (
                <div className="info-row" key={l}>
                  <div className="info-label">{l}</div>
                  <div>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding:'var(--space-6)' }}>
            <h2 className="section-title" style={{ marginBottom:'var(--space-5)' }}>Registration</h2>
            <div className="info-list">
              {[['Total Seats', event.seats],['Registered', event.registeredCount],['Seats Left', seatsLeft]].map(([l,v]) => (
                <div className="info-row" key={l}>
                  <div className="info-label">{l}</div>
                  <div style={{ fontWeight: l==='Seats Left' ? 700 : 400 }}>{v}</div>
                </div>
              ))}
            </div>
            <button className="btn btn-primary btn-full" style={{ marginTop:'var(--space-6)' }}
              onClick={handleRegister}
              disabled={registered || seatsLeft === 0 || regLoading}
            >
              {regLoading ? 'Registering…' : registered ? '✓ Registered' : seatsLeft === 0 ? 'Event Full' : 'Register Now'}
            </button>
            {!user && <p className="muted" style={{ marginTop:'var(--space-4)', fontSize:'var(--text-sm)' }}>Login required to register.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

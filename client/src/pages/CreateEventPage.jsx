import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createEvent } from '../api'
import { useAuth } from '../AuthContext'
import { useToast } from '../components/ToastContext'
import FormGroup from '../components/FormGroup'

export default function CreateEventPage() {
  const { user }     = useAuth()
  const { addToast } = useToast()
  const navigate     = useNavigate()
  const [form, setForm] = useState({ title:'', category:'Workshop', date:'', time:'', venue:'', organizer:'', seats:'', description:'' })
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (!user) navigate('/login') }, [user])

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createEvent(form)               // POST /api/events
      addToast('success', 'Event Created', 'Your event is now live.')
      navigate('/')
    } catch (err) {
      addToast('error', 'Error', err.response?.data?.message || 'Could not create event')
    } finally { setLoading(false) }
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth:'760px' }}>
        <div className="card" style={{ padding:'var(--space-8)' }}>
          <h1 className="section-title" style={{ fontSize:'var(--text-xl)', marginBottom:'var(--space-2)' }}>Create New Event</h1>
          <p className="muted" style={{ marginBottom:'var(--space-6)' }}>Fill in the details to publish your event.</p>

          <form onSubmit={handleSubmit} style={{ display:'grid', gap:'var(--space-4)' }}>
            <FormGroup label="Event Title">
              <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. AI Workshop 2026" required />
            </FormGroup>
            <div className="grid grid-2">
              <FormGroup label="Category">
                <select name="category" value={form.category} onChange={handleChange}>
                  <option>Workshop</option><option>Seminar</option>
                  <option>Competition</option><option>Meetup</option><option>Cultural</option>
                </select>
              </FormGroup>
              <FormGroup label="Total Seats">
                <input type="number" name="seats" value={form.seats} onChange={handleChange} placeholder="e.g. 100" min="1" required />
              </FormGroup>
            </div>
            <div className="grid grid-2">
              <FormGroup label="Date">
                <input type="date" name="date" value={form.date} onChange={handleChange} required />
              </FormGroup>
              <FormGroup label="Time">
                <input name="time" value={form.time} onChange={handleChange} placeholder="e.g. 10:00 AM" required />
              </FormGroup>
            </div>
            <div className="grid grid-2">
              <FormGroup label="Venue">
                <input name="venue" value={form.venue} onChange={handleChange} placeholder="e.g. Auditorium A" required />
              </FormGroup>
              <FormGroup label="Organizer">
                <input name="organizer" value={form.organizer} onChange={handleChange} placeholder="e.g. CSE Dept" />
              </FormGroup>
            </div>
            <FormGroup label="Description">
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="What can attendees expect?" required />
            </FormGroup>
            <div style={{ display:'flex', gap:'var(--space-3)' }}>
              <button className="btn btn-primary" disabled={loading}>{loading ? 'Publishing…' : 'Publish Event'}</button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
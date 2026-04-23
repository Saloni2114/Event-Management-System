import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createEvent, getApiErrorMessage } from '../api'
import { useAuth } from '../AuthContext'
import { useToast } from '../components/ToastContext'
import FormGroup from '../components/FormGroup'

export default function CreateEventPage() {
  const { isAuthenticated } = useAuth()
  const { addToast } = useToast()
  const navigate     = useNavigate()
  const [form, setForm] = useState({ title:'', date:'', location:'', description:'' })
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (!isAuthenticated) navigate('/login') }, [isAuthenticated, navigate])

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await createEvent(form)
      addToast('success', 'Event Created', 'Your event is now live.')
      navigate('/')
    } catch (err) {
      addToast('error', 'Error', getApiErrorMessage(err, 'Could not create event'))
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
            <FormGroup label="Date">
              <input type="date" name="date" value={form.date} onChange={handleChange} required />
            </FormGroup>
            <FormGroup label="Location">
              <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Auditorium A" required />
            </FormGroup>
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
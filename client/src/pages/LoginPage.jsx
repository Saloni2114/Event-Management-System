import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getApiErrorMessage, login } from '../api'
import { useAuth } from '../AuthContext'
import { useToast } from '../components/ToastContext'
import FormGroup from '../components/FormGroup'

export default function LoginPage() {
  const { saveAuth } = useAuth()
  const { addToast } = useToast()
  const navigate     = useNavigate()
  const location = useLocation()
  const [form, setForm]     = useState({ email:'', password:'' })
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await login(form)
      saveAuth(data.user, data.token)
      addToast('success', 'Welcome back!', `Logged in as ${data.user.name}`)
      navigate(location.state?.from || '/')
    } catch (err) {
      addToast('error', 'Login Failed', getApiErrorMessage(err, 'Invalid credentials'))
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', display:'grid', placeItems:'center', padding:'var(--space-6)' }}>
      <div className="card" style={{ width:'min(100%, 460px)', padding:'var(--space-8)' }}>
        <div style={{ marginBottom:'var(--space-6)' }}>
          <div className="badge">EventMS</div>
          <h1 style={{ fontSize:'var(--text-xl)', margin:'var(--space-3) 0 var(--space-2)' }}>Login to continue</h1>
          <p className="muted">Sign in to view and register for events.</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display:'grid', gap:'var(--space-4)' }}>
          <FormGroup label="Email">
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
          </FormGroup>
          <FormGroup label="Password">
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Enter password" required />
          </FormGroup>
          <button className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
        <p style={{ marginTop:'var(--space-6)', fontSize:'var(--text-sm)', color:'var(--color-text-muted)' }}>
          No account? <Link to="/signup" style={{ color:'var(--color-primary)', fontWeight:600 }}>Sign up</Link>
        </p>
      </div>
    </div>
  )
}
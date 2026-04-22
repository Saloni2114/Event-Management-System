import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../api'
import { useAuth } from '../AuthContext'
import { useToast } from '../components/ToastContext'
import FormGroup from '../components/FormGroup'

export default function SignupPage() {
  const { saveAuth } = useAuth()
  const { addToast } = useToast()
  const navigate     = useNavigate()
  const [form, setForm]     = useState({ name:'', email:'', password:'' })
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await signup(form)         // POST /api/auth/signup
      saveAuth(data.user, data.token)
      addToast('success', 'Account created!', `Welcome, ${data.user.name}`)
      navigate('/')
    } catch (err) {
      addToast('error', 'Signup Failed', err.response?.data?.message || 'Could not create account')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', display:'grid', placeItems:'center', padding:'var(--space-6)' }}>
      <div className="card" style={{ width:'min(100%, 460px)', padding:'var(--space-8)' }}>
        <div style={{ marginBottom:'var(--space-6)' }}>
          <div className="badge">EventMS</div>
          <h1 style={{ fontSize:'var(--text-xl)', margin:'var(--space-3) 0 var(--space-2)' }}>Create your account</h1>
          <p className="muted">Join to register and create events.</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display:'grid', gap:'var(--space-4)' }}>
          <FormGroup label="Full Name">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
          </FormGroup>
          <FormGroup label="Email">
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
          </FormGroup>
          <FormGroup label="Password">
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Create password" required />
          </FormGroup>
          <button className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating…' : 'Sign Up'}
          </button>
        </form>
        <p style={{ marginTop:'var(--space-6)', fontSize:'var(--text-sm)', color:'var(--color-text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color:'var(--color-primary)', fontWeight:600 }}>Login</Link>
        </p>
      </div>
    </div>
  )
}
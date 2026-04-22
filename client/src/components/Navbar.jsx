import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header style={{
      position:'sticky', top:0, zIndex:50,
      background:'rgba(247,246,242,0.88)',
      backdropFilter:'blur(10px)',
      borderBottom:'1px solid var(--color-divider)'
    }}>
      <div style={{
        maxWidth:'var(--content-default)', margin:'0 auto',
        padding:'var(--space-4)',
        display:'flex', alignItems:'center',
        justifyContent:'space-between', gap:'var(--space-4)', flexWrap:'wrap'
      }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:'var(--space-3)', fontWeight:700, fontSize:'var(--text-sm)' }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'var(--color-primary-highlight)', color:'var(--color-primary)', display:'grid', placeItems:'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="16" rx="3"/>
              <path d="M8 3v4M16 3v4M3 10h18M8 14h3M13 14h3M8 18h8"/>
            </svg>
          </div>
          EventMS
        </Link>

        <div style={{ display:'flex', alignItems:'center', gap:'var(--space-3)', flexWrap:'wrap' }}>
          <button className="btn btn-secondary" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? '☀ Light' : '☾ Dark'}
          </button>
          <Link to="/" className="btn btn-secondary">Home</Link>
          {user && <Link to="/create" className="btn btn-primary">+ Create Event</Link>}
          {user && <span className="pill-user">{user.name}</span>}
          {user
            ? <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
            : <Link to="/login" className="btn btn-primary">Login</Link>
          }
        </div>
      </div>
    </header>
  )
}
import { Link } from 'react-router-dom'

export default function EventCard({ event, onRegister, isRegistered }) {
  const seatsLeft = event.seats - event.registeredCount
  const id = event._id || event.id

  return (
    <article className="card" style={{ padding:'var(--space-5)', display:'grid', gap:'var(--space-4)', transition:'transform var(--transition), box-shadow var(--transition)' }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='var(--shadow-md)' }}
      onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='' }}
    >
      <div className="badge">{event.category}</div>
      <div>
        <h3 style={{ fontSize:'var(--text-lg)', fontWeight:700, lineHeight:1.25 }}>{event.title}</h3>
        <div style={{ display:'grid', gap:'var(--space-1)', color:'var(--color-text-muted)', fontSize:'var(--text-sm)', marginTop:'var(--space-2)' }}>
          <span>📅 {event.date} &nbsp; 🕒 {event.time}</span>
          <span>📍 {event.venue}</span>
          <span>👥 {event.registeredCount}/{event.seats} &nbsp;({seatsLeft} seats left)</span>
        </div>
      </div>
      <p className="muted" style={{ fontSize:'var(--text-sm)' }}>{event.description}</p>
      <div style={{ display:'flex', gap:'var(--space-3)', flexWrap:'wrap' }}>
        <Link to={`/events/${id}`} className="btn btn-secondary">View Details</Link>
        <button
          className="btn btn-primary"
          onClick={() => onRegister(id)}
          disabled={isRegistered || seatsLeft === 0}
        >
          {isRegistered ? '✓ Registered' : seatsLeft === 0 ? 'Full' : 'Register'}
        </button>
      </div>
    </article>
  )
}
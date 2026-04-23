import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import RegistrationModal from './RegistrationModal'

export default function EventCard({ event, onRegister, isRegistered }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showModal, setShowModal] = useState(false)

  if (!event) {
    console.warn('⚠️ EventCard: event prop is missing')
    return null
  }

  const eventId = event._id || event.id

  // 🛡️ Safety guard: Don't render if event has no valid ID
  if (!eventId) {
    console.warn('⚠️ EventCard: event missing valid ID', event)
    return null
  }

  const seatsLeft = Math.max(0, Number(event.seats || 0) - Number(event.registeredCount || 0))
  const isFull = event.seats && seatsLeft === 0

  const handleClick = () => {
    if (!eventId) {
      console.error('❌ Cannot navigate: event ID is missing')
      return
    }
    navigate(`/events/${eventId}`)
  }

  const handleRegisterClick = (e) => {
    e.stopPropagation()
    if (!user) {
      navigate('/login')
      return
    }
    // Open registration modal instead of direct API call
    setShowModal(true)
  }

  const handleRegistrationSuccess = () => {
    // Notify parent component about successful registration
    onRegister?.(eventId)
  }

  return (
    <>
      <div
        className="event-card"
        onClick={handleClick}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }}
      >
        {event.category && <div className="event-category">{event.category}</div>}
        <div className="event-content">
          <h3 className="event-title">{event.title}</h3>
          <p className="event-description">{event.description?.substring(0, 100)}…</p>
          <div className="event-details">
            <div className="event-detail">
              <span className="detail-icon">📅</span>
              <span>{event.date || 'TBD'}</span>
            </div>
            <div className="event-detail">
              <span className="detail-icon">📍</span>
              <span>{event.venue || 'TBD'}</span>
            </div>
          </div>
          <div className="event-stats">
            <div className="stat">
              <div className="stat-value">{event.registeredCount || 0}</div>
              <div className="stat-label">Registered</div>
            </div>
            <div className="stat">
              <div className="stat-value">{event.seats ? seatsLeft : '∞'}</div>
              <div className="stat-label">Seats Left</div>
            </div>
          </div>
        </div>
        <button
          className={`event-register-btn ${isRegistered ? 'registered' : isFull ? 'full' : ''}`}
          onClick={handleRegisterClick}
          disabled={isRegistered || isFull}
        >
          {isRegistered ? '✓ Registered' : isFull ? 'Event Full' : 'Register Now'}
        </button>
      </div>

      <RegistrationModal
        event={event}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleRegistrationSuccess}
      />
    </>
  )
}
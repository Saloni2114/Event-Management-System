import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import { ToastProvider } from './components/ToastContext'
import Navbar from './components/Navbar'
import ToastContainer from './components/ToastContainer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import CreateEventPage from './pages/CreateEventPage'
import EventDetailsPage from './pages/EventDetailsPage'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Navbar />
        <main>
          <Routes>
            <Route path="/"           element={<HomePage />} />
            <Route path="/login"      element={<LoginPage />} />
            <Route path="/signup"     element={<SignupPage />} />
            <Route path="/create"     element={<CreateEventPage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
          </Routes>
        </main>
        <ToastContainer />
      </ToastProvider>
    </AuthProvider>
  )
}

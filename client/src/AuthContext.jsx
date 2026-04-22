import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ems_user')
    return saved ? JSON.parse(saved) : null
  })

  const saveAuth = (userData, token) => {
    setUser(userData)
    localStorage.setItem('ems_user', JSON.stringify(userData))
    localStorage.setItem('ems_token', token)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ems_user')
    localStorage.removeItem('ems_token')
  }

  return (
    <AuthContext.Provider value={{ user, saveAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
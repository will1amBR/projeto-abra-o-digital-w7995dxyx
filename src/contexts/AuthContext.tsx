import React, { createContext, useContext, useEffect, useState } from 'react'
import pb from '@/lib/pocketbase/client'
import type { User } from '@/types/content'

interface AuthContextType {
  user: User | null
  token: string | null
  isAdmin: boolean
  isLoading: boolean
  login: (email: string, pass: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAdmin: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(pb.authStore.record as unknown as User | null)
  const [token, setToken] = useState<string | null>(pb.authStore.token || null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // Initial check
    setUser(pb.authStore.record as unknown as User | null)
    setToken(pb.authStore.token || null)
    setIsLoading(false)

    // Listen for auth store changes
    const unsubscribe = pb.authStore.onChange((newToken, newModel) => {
      setToken(newToken || null)
      setUser(newModel as unknown as User | null)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const login = async (email: string, pass: string) => {
    const authData = await pb.collection('users').authWithPassword(email, pass)
    setUser(authData.record as unknown as User)
    setToken(authData.token)
  }

  const logout = () => {
    pb.authStore.clear()
    setUser(null)
    setToken(null)
  }

  const isAdmin = !!(user && (user.role === 'admin' || user.email === 'william@korenambiental.com'))

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

import React, { createContext, useContext, useEffect, useState } from 'react'
import pb from '@/lib/pocketbase/client'
import type { User, VolunteerProfile } from '@/types/content'
import { getVolunteerProfileByUserId, createVolunteerProfile } from '@/services/gamificationService'

interface AuthContextType {
  user: User | null
  token: string | null
  isAdmin: boolean
  isLoading: boolean
  volunteerProfile: VolunteerProfile | null
  refreshVolunteerProfile: () => Promise<VolunteerProfile | null>
  login: (email: string, pass: string) => Promise<void>
  registerVolunteer: (data: {
    email: string
    password: string
    name: string
    phone?: string
    city?: string
    bio?: string
    referred_by_code?: string
  }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAdmin: false,
  isLoading: true,
  volunteerProfile: null,
  refreshVolunteerProfile: async () => null,
  login: async () => {},
  registerVolunteer: async () => {},
  logout: () => {},
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(pb.authStore.record as unknown as User | null)
  const [token, setToken] = useState<string | null>(pb.authStore.token || null)
  const [volunteerProfile, setVolunteerProfile] = useState<VolunteerProfile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const loadProfile = async (uId?: string): Promise<VolunteerProfile | null> => {
    const targetId = uId || pb.authStore.record?.id
    if (!targetId) {
      setVolunteerProfile(null)
      return null
    }
    try {
      const prof = await getVolunteerProfileByUserId(targetId)
      setVolunteerProfile(prof)
      return prof
    } catch {
      setVolunteerProfile(null)
      return null
    }
  }

  useEffect(() => {
    const currentUser = pb.authStore.record as unknown as User | null
    setUser(currentUser)
    setToken(pb.authStore.token || null)

    if (currentUser?.id) {
      loadProfile(currentUser.id).finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }

    // Listen for auth store changes
    const unsubscribe = pb.authStore.onChange(async (newToken, newModel) => {
      setToken(newToken || null)
      const u = newModel as unknown as User | null
      setUser(u)
      if (u?.id) {
        await loadProfile(u.id)
      } else {
        setVolunteerProfile(null)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const refreshVolunteerProfile = async () => {
    return loadProfile(user?.id)
  }

  const login = async (email: string, pass: string) => {
    const authData = await pb.collection('users').authWithPassword(email, pass)
    const u = authData.record as unknown as User
    setUser(u)
    setToken(authData.token)
    await loadProfile(u.id)
  }

  const registerVolunteer = async (data: {
    email: string
    password: string
    name: string
    phone?: string
    city?: string
    bio?: string
    referred_by_code?: string
  }) => {
    // 1. Create auth user
    const newUserRecord = await pb.collection('users').create({
      email: data.email,
      password: data.password,
      passwordConfirm: data.password,
      name: data.name,
      role: 'editor',
    })

    // 2. Auth with the new account
    const authData = await pb.collection('users').authWithPassword(data.email, data.password)
    const u = authData.record as unknown as User
    setUser(u)
    setToken(authData.token)

    // 3. Create initial volunteer profile with welcome points and referral code
    const prof = await createVolunteerProfile({
      user_id: u.id,
      display_name: data.name,
      phone: data.phone,
      city: data.city,
      bio: data.bio,
      referred_by_code: data.referred_by_code,
    })
    setVolunteerProfile(prof)
  }

  const logout = () => {
    pb.authStore.clear()
    setUser(null)
    setToken(null)
    setVolunteerProfile(null)
  }

  const isAdmin = !!(user && (user.role === 'admin' || user.email === 'william@korenambiental.com'))

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin,
        isLoading,
        volunteerProfile,
        refreshVolunteerProfile,
        login,
        registerVolunteer,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

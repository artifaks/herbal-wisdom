"use client";
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [client] = useState(() => supabase())

  useEffect(() => {
    if (!client) return

    // Check active sessions and set the user
    client.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for changes on auth state (signed in, signed out, etc.)
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [client])

  const signIn = useCallback(async (email: string, password: string) => {
    if (!client) throw new Error('Supabase client not initialized')

    const { error } = await client.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }, [client])

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    if (!client) throw new Error('Supabase client not initialized')

    const { error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    if (error) throw error
  }, [client])

  const signOut = useCallback(async () => {
    if (!client) throw new Error('Supabase client not initialized')

    const { error } = await client.auth.signOut()
    if (error) throw error
  }, [client])

  const resetPassword = useCallback(async (email: string) => {
    if (!client) throw new Error('Supabase client not initialized')

    const { error } = await client.auth.resetPasswordForEmail(email)
    if (error) throw error
  }, [client])

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

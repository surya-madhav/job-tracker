// services/auth.service.ts

import { createClient } from "@/lib/supabase.client"

export const authService = {
  async signUp(email: string, password: string) {
    const supabase = createClient()
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
  },

  async signIn(email: string, password: string) {
    const supabase = createClient()
    return await supabase.auth.signInWithPassword({
      email,
      password
    })
  },

  async signOut() {
    const supabase = createClient()
    return await supabase.auth.signOut()
  }
}
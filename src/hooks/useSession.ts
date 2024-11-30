'use client'

import { createBrowserClient } from '@/utils/supabase'
import { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

export function useSession() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createBrowserClient()

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
    }

    fetchUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return { user, supabase }
}

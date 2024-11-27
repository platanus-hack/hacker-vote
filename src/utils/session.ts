import { createBrowserClient } from '@/utils/supabase'

const supabase = createBrowserClient()

export const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/api/auth/callback`,
    },
  })

  if (error) {
    console.error('Error:', error.message)
  }
}

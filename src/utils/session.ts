import { createBrowserClient } from '@/utils/supabase'

const supabase = createBrowserClient()

export const handleGoogleLogin = async (redirectPath?: string) => {
  console.log('redirectPath', redirectPath)
  const redirectTo = `${window.location.origin}/api/auth/callback${
    redirectPath ? `?redirect_to=${encodeURIComponent(redirectPath)}` : ''
  }`

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
    },
  })

  if (error) {
    console.error('Error:', error.message)
  }
}

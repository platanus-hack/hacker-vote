'use client'

import { createBrowserClient } from '@/utils/supabase'
import { FcGoogle } from 'react-icons/fc'

export default function Login() {
  const supabase = createBrowserClient()

  const handleGoogleLogin = async () => {
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

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
      <button
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      >
        <FcGoogle className="h-5 w-5" />
        Sign in with Google
      </button>
    </div>
  )
}

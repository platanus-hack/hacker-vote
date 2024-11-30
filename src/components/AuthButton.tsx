'use client'

import { useSession } from '@/hooks/useSession'
import { useRouter } from 'next/navigation'

export default function AuthButton() {
  const router = useRouter()
  const { user, supabase } = useSession()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return user ? (
    <div className="flex w-full items-center justify-between">
      <span>{user.email}</span>
      <button
        onClick={handleSignOut}
        className="bg-btn-background hover:bg-btn-background-hover rounded-md px-4 py-2 no-underline"
      >
        Logout
      </button>
    </div>
  ) : (
    <div className="flex w-full justify-end"></div>
  )
}

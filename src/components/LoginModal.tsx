import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/utils/supabase'
import { FcGoogle } from 'react-icons/fc'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin?: () => Promise<void>
}

export default function LoginModal({
  isOpen,
  onClose,
  onLogin,
}: LoginModalProps) {
  const router = useRouter()
  const supabase = createBrowserClient()

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })

    if (error) {
      console.error('Error:', error.message)
    } else {
      if (onLogin) await onLogin()
      onClose()
    }
  }

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-lg bg-zinc-900 p-12 shadow-lg"
        onClick={handleModalClick}
      >
        <h2 className="mb-8 text-center text-3xl font-extrabold text-white">
          Login Required
        </h2>
        <p className="mb-8 text-center text-lg text-white">
          You need to log in to vote.
        </p>
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-lg font-semibold text-gray-700 shadow-lg ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <FcGoogle className="h-6 w-6" />
            Sign in with Google
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            className="mt-4 rounded-md bg-gray-200 px-6 py-3 text-lg font-semibold text-gray-700 hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

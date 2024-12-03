'use client'
import { useEffect, useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { handleGoogleLogin } from '@/utils/session'
import toast from 'react-hot-toast'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  redirectPath?: string
}

export default function LoginModal({
  isOpen,
  onClose,
  redirectPath,
}: LoginModalProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isUnsupportedBrowser, setIsUnsupportedBrowser] = useState(false)

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase()
    setIsUnsupportedBrowser(
      userAgent.includes('instagram') || userAgent.includes('linkedin'),
    )
  }, [])

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true)
        })
      })
    } else {
      setIsVisible(false)
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleCopyLink = () => {
    const url = new URL(window.location.href)
    url.search = ''

    const cleanUrl = url.toString()

    navigator.clipboard
      .writeText(cleanUrl)
      .then(() => {
        toast.success('Link copied! Please open in another browser to login.', {
          icon: '🔗',
          style: {
            background: '#27272a',
            color: '#fff',
            border: '1px solid #3f3f46',
          },
          duration: 2000,
        })
      })
      .catch((err) => {
        console.error('Failed to copy link:', err)
      })
  }

  if (!isAnimating && !isOpen) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30" />
      <div
        className={`relative w-full max-w-sm transform rounded-lg bg-zinc-900 p-6 shadow-xl transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-medium text-white">Login Required</h2>
        {isUnsupportedBrowser ? (
          <>
            <p className="mt-2 text-sm text-zinc-400">
              This browser does not support Google login. Please copy the link
              and open it in another browser.
            </p>
            <div className="mt-4">
              <button
                onClick={handleCopyLink}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/75"
              >
                Copy Link
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-zinc-400">
              Please login to vote for this project
            </p>
            <div className="mt-4">
              <button
                onClick={() => handleGoogleLogin(redirectPath)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/75"
              >
                <FcGoogle className="h-5 w-5" />
                Sign in with Google
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

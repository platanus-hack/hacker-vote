'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { HiChevronDown, HiBars3, HiXMark } from 'react-icons/hi2'
import { handleGoogleLogin } from '@/utils/session'
import { useSession } from '@/hooks/useSession'

const Navbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { user, supabase } = useSession()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (!(event.target as HTMLElement).closest('.dropdown')) {
      setDropdownVisible(false)
    }
  }

  useEffect(() => {
    if (dropdownVisible) {
      document.addEventListener('click', handleClickOutside)
    } else {
      document.removeEventListener('click', handleClickOutside)
    }
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [dropdownVisible])

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push('/')
    router.refresh()
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
    setDropdownVisible(false)
  }

  return (
    <nav className="relative flex justify-center py-4">
      <div className="container flex w-full max-w-5xl items-center justify-between px-4">
        <div className="flex-shrink-0 font-oxanium">
          <Link
            href="/"
            onClick={handleLogoClick}
            className="text-xl text-white transition-colors hover:text-yellow"
          >
            <span className="font-light">platanus hack</span>{' '}
            <span className="font-bold">| voting ☝️</span>
          </Link>
        </div>

        <button onClick={toggleMobileMenu} className="p-2 text-white md:hidden">
          {mobileMenuOpen ? (
            <HiXMark className="h-6 w-6" />
          ) : (
            <HiBars3 className="h-6 w-6" />
          )}
        </button>

        <div className="hidden items-center md:flex">
          {user ? (
            <div className="dropdown relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 rounded-lg border border-white px-4 py-1 text-white transition-colors hover:bg-white/10 focus:outline-none"
              >
                {user.user_metadata.full_name}
                <HiChevronDown className="h-4 w-4" />
              </button>
              {dropdownVisible && (
                <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg">
                  <button
                    onClick={handleSignOut}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => handleGoogleLogin(pathname)}
              className="rounded-lg border border-white px-4 py-1 text-white transition-colors hover:bg-white/10"
            >
              Login
            </button>
          )}
        </div>

        {mobileMenuOpen && (
          <div className="absolute left-0 right-0 top-full z-50 border-t border-zinc-800 bg-zinc-900 p-4 md:hidden">
            <div className="flex flex-col items-center space-y-4">
              {user ? (
                <>
                  <div className="text-center text-white">
                    {user.user_metadata.full_name}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full rounded-lg border border-white px-4 py-1 text-white transition-colors hover:bg-white/10"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleGoogleLogin()}
                  className="w-full rounded-lg border border-white px-4 py-1 text-white transition-colors hover:bg-white/10"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

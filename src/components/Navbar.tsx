'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const Navbar: React.FC = () => {
  const [animatedText, setAnimatedText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const fullText = 'Voting Platform'
  const [index, setIndex] = useState(0)
  const typingSpeed = 150

  useEffect(() => {
    if (index < fullText.length) {
      const typingInterval = setInterval(() => {
        setAnimatedText((prev) => prev + fullText[index])
        setIndex((prev) => prev + 1)
      }, typingSpeed)
      return () => clearInterval(typingInterval)
    } else {
      const cursorBlinkInterval = setInterval(() => {
        setShowCursor((prev) => !prev)
      }, 500)
      return () => clearInterval(cursorBlinkInterval)
    }
  }, [index])

  return (
    <nav className="fixed left-0 top-0 z-50 flex h-16 w-full items-center bg-background text-foreground">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex-1">
          <a href="/" target="_blank" rel="noopener noreferrer">
            <Image
              src="https://raw.githubusercontent.com/rafafdz/platanus-hack-landing/main/public/platanus-logo-horizontal.svg"
              alt="Logo"
              width={150}
              height={50}
              className="opacity-80 transition-opacity duration-300 hover:opacity-100"
            />
          </a>
        </div>

        <div className="flex-1 text-center">
          <p className="font-jetbrains-mono text-xl">
            {animatedText}
            <span
              className={`inline-block w-[0.5ch] ${
                showCursor ? 'opacity-100' : 'opacity-0'
              }`}
            >
              |
            </span>
          </p>
        </div>

        <div className="flex-1 text-right">
          <p className="text-sm">Username</p>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

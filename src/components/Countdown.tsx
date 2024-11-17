'use client'

import { useEffect, useState } from 'react'

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    // Set your target date here
    const targetDate = new Date('2024-11-30T23:59:59')

    const timer = setInterval(() => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference <= 0) {
        clearInterval(timer)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      )
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mb-10 flex h-full items-center justify-center">
      <h1
        className="text-center text-4xl font-extrabold tracking-tight lg:text-5xl"
        style={{ color: '#FFEC40' }}
      >
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{' '}
        {timeLeft.seconds}s left to vote!
      </h1>
    </div>
  )
}

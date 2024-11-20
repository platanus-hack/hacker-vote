// countdown.tsx
'use client'
import { useEffect, useState } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface CountdownProps {
  initialTimeLeft: TimeLeft
}

export default function Countdown({ initialTimeLeft }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft)

  useEffect(() => {
    const targetDate = new Date('2024-11-30T23:59:59')

    const timer = setInterval(() => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference <= 0) {
        clearInterval(timer)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mb-10 flex h-full items-center justify-center">
      <h1 className="text-center text-7xl font-extrabold tracking-tight text-[#FFEC40]">
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{' '}
        {timeLeft.seconds}s left to vote!
      </h1>
    </div>
  )
}

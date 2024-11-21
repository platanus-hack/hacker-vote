'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TARGET_DATE } from './CountdownServer'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface CountdownProps {
  initialTimeLeft: TimeLeft
  initialIsVotingEnded: boolean
}

export default function Countdown({
  initialTimeLeft,
  initialIsVotingEnded,
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft)
  const [isVotingEnded, setIsVotingEnded] = useState(initialIsVotingEnded)

  useEffect(() => {
    const targetDate = new Date(TARGET_DATE)

    const timer = setInterval(() => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference <= 0) {
        clearInterval(timer)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        setIsVotingEnded(true)
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
    <div className="mb-10 flex h-full flex-col items-center justify-center gap-8">
      {isVotingEnded ? (
        <Link href="/winners">
          <Button
            className="bg-[#FFEC40] text-black hover:bg-[#FFEC40]/90"
            size="lg"
          >
            View Winners 🏆
          </Button>
        </Link>
      ) : (
        <h1 className="text-center text-7xl font-extrabold tracking-tight text-[#FFEC40]">
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{' '}
          {timeLeft.seconds}s left to vote!
        </h1>
      )}
    </div>
  )
}

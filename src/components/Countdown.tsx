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
            className="border border-primary bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            View Winners 🏆
          </Button>
        </Link>
      ) : (
        <h1 className="rounded border border-yellow p-3 text-center text-3xl tracking-tight text-yellow transition-all hover:text-white">
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{' '}
          {timeLeft.seconds}s left to vote!
        </h1>
      )}
    </div>
  )
}

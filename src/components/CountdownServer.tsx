export function getInitialTimeLeft() {
  const targetDate = new Date('2024-11-30T23:59:59')
  const now = new Date()
  const difference = targetDate.getTime() - now.getTime()

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
  }
}

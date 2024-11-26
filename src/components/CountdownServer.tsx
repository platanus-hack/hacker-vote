export const TARGET_DATE = '2024-11-30T23:59:59'

export function getInitialTimeLeft() {
  const targetDate = new Date(TARGET_DATE)
  const now = new Date()
  const difference = targetDate.getTime() - now.getTime()

  const isVotingEnded = difference <= 0

  return {
    timeLeft: {
      days: isVotingEnded ? 0 : Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: isVotingEnded
        ? 0
        : Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: isVotingEnded
        ? 0
        : Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: isVotingEnded
        ? 0
        : Math.floor((difference % (1000 * 60)) / 1000),
    },
    isVotingEnded,
  }
}

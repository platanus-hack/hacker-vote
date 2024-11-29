import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Github, Linkedin } from 'lucide-react'
import Link from 'next/link'

interface HackerProps {
  name: string
  github_url?: string
  linkedin_url?: string
}

function ensureProtocol(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`
  }
  return url
}

export function HackerCard({ hacker }: { hacker: HackerProps }) {
  const avatar_url = hacker.github_url
    ? `${ensureProtocol(hacker.github_url).replace(
        'https://github.com/',
        'https://github.com/',
      )}.png`
    : undefined

  return (
    <div className="group relative h-16 w-16">
      <Avatar className="h-full w-full">
        {avatar_url ? (
          <AvatarImage src={avatar_url} alt={hacker.name} />
        ) : (
          <AvatarFallback>{hacker.name.charAt(0)}</AvatarFallback>
        )}
      </Avatar>

      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/70 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
        <span className="px-1 text-center text-xs font-medium text-white">
          {hacker.name}
        </span>
        <div className="mt-0.5 flex gap-1">
          {hacker.github_url && (
            <Link
              href={ensureProtocol(hacker.github_url)}
              target="_blank"
              className="text-zinc-300 transition-colors hover:text-white"
            >
              <Github className="h-3 w-3" />
            </Link>
          )}
          {hacker.linkedin_url && (
            <Link
              href={ensureProtocol(hacker.linkedin_url)}
              target="_blank"
              className="text-zinc-300 transition-colors hover:text-white"
            >
              <Linkedin className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Github, Linkedin } from 'lucide-react'
import Link from 'next/link'

interface HackerProps {
  name: string
  avatar_url: string
  github_url?: string
  linkedin_url?: string
}

export function HackerCard({ hacker }: { hacker: HackerProps }) {
  return (
    <Card className="flex items-center gap-4 border-zinc-800 bg-black/40 p-4">
      <Avatar className="h-10 w-10">
        <AvatarImage src={hacker.avatar_url} alt={hacker.name} />
        <AvatarFallback>{hacker.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-medium text-white">{hacker.name}</span>
        <div className="mt-1 flex gap-2">
          {hacker.github_url && (
            <Link
              href={hacker.github_url}
              target="_blank"
              className="text-zinc-400 transition-colors hover:text-white"
            >
              <Github className="h-4 w-4" />
            </Link>
          )}
          {hacker.linkedin_url && (
            <Link
              href={hacker.linkedin_url}
              target="_blank"
              className="text-zinc-400 transition-colors hover:text-white"
            >
              <Linkedin className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </Card>
  )
}

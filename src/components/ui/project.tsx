import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/tailwind'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { HackerCard } from '@/components/ui/hackercard'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

interface ProjectProps {
  project_name: string
  logo_url: string
  oneliner: string
  hackers: Array<{
    name: string
    avatar_url: string
    github_url?: string
    linkedin_url?: string
  }>
  demo_url: string
  track: string
  description: string
}

function getYouTubeEmbedUrl(url: string): string {
  const videoIdMatch = url.match(
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
  )
  return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : url
}

export function Project({ project }: { project: ProjectProps }) {
  const embedUrl = getYouTubeEmbedUrl(project.demo_url)

  return (
    <div className="zinc-900 space-y-8">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={project.logo_url} alt={project.project_name} />
            <AvatarFallback>{project.project_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <h1 className="text-2xl font-bold">{project.project_name}</h1>
              <Badge
                variant="outline"
                className="zinc-900/40 hidden border-zinc-700 text-white sm:inline-flex"
              >
                {project.track}
              </Badge>
            </div>

            <Badge
              variant="outline"
              className="zinc-900/40 border-zinc-700 text-white sm:hidden"
            >
              {project.track}
            </Badge>

            <p className="max-w-xl text-zinc-400">{project.oneliner}</p>
          </div>
        </div>
        <div className="zinc-900/40 rounded-lg border border-zinc-800 p-4">
          <span className="text-2xl font-bold">40</span>
          <span className="ml-1 text-zinc-400">▲</span>
        </div>
      </div>

      {project.demo_url && (
        <div className="aspect-video w-full overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800/50">
          <iframe
            src={embedUrl}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4">
        {project.hackers.map((hacker, index) => (
          <div key={index} className="flex w-64 flex-col">
            <HackerCard hacker={hacker} />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="font-mono text-sm text-zinc-500">
          project {project.project_name} @ description:
        </div>
        <p className="text-justify leading-relaxed text-zinc-300">
          {project.description}
        </p>
      </div>
    </div>
  )
}

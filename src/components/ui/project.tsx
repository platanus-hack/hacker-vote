'use client'

import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/tailwind'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { HackerCard } from '@/components/ui/hackercard'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import LoginModal from '@/components/LoginModal'
import toast from 'react-hot-toast'
import { IoRocketOutline } from 'react-icons/io5'
import { FiGithub, FiShare } from 'react-icons/fi'
import { TARGET_DATE } from '@/components/CountdownServer'
import { useSession } from '@/hooks/useSession'

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
  project_id: number
  project_name: string | null
  logo_url: string | null
  oneliner: string | null
  slug: string | null
  initial_vote_count: number
  hackers: Array<{
    name: string
    avatar_url: string
    github_url?: string
    linkedin_url?: string
  }>
  demo_url: string | null
  track: string | null
  description: string | null
  app_url: string | null
  repo_url: string | null
}

function getYouTubeEmbedUrl(url: string | null): string {
  if (!url) return ''

  try {
    const videoId = url.split('v=')[1]?.split('&')[0]
    const timeMatch = url.match(/[?&]t=(\d+)s/)
    const startTime = timeMatch ? timeMatch[1] : ''

    if (!videoId) {
      console.warn('Could not extract video ID from URL:', url)
      return ''
    }

    return `https://www.youtube.com/embed/${videoId}${startTime ? `?start=${startTime}` : ''}`
  } catch (error) {
    console.error('Error processing YouTube URL:', error)
    return ''
  }
}

function fireConfetti() {
  const count = 200
  const defaults = {
    origin: { y: 0.9 },
    zIndex: 1000,
  }

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    })
  }

  fire(0.9, {
    spread: 80,
    startVelocity: 55,
    origin: { x: 0 },
  })

  fire(0.9, {
    spread: 80,
    startVelocity: 55,
    origin: { x: 1 },
  })
}

const pulseVariants = {
  voted: {
    border: 'border-yellow text-yellow',
  },
  notVoted: {
    base: 'border-zinc-800 text-zinc-400 hover:border-yellow hover:text-yellow',
    animation:
      'animate-[vote-pulse_2s_ease-in-out_infinite] hover:animate-none',
  },
  disabled: {
    base: 'cursor-not-allowed opacity-50',
  },
}

const pulseStyle = `
  @keyframes vote-pulse {
    0%, 100% { 
      border-color: rgb(161 161 170);
      color: rgb(161 161 170);
      transform: scale(1);
    }
    50% { 
      border-color: #FFFFFF;
      color: #FFFFFF;
      transform: scale(1.05);
    }
  }

  .animate-[vote-pulse_2s_ease-in-out_infinite] {
    animation: vote-pulse 2s ease-in-out infinite;
  }
`

export function Project({ project }: { project: ProjectProps }) {
  const { user, supabase } = useSession()
  const embedUrl = getYouTubeEmbedUrl(project.demo_url)
  const logoUrl = project.logo_url || '/placeholder.svg'
  const projectName = project.project_name || 'Unknown Project'
  const projectTrack = project.track || 'No Track'
  const projectOneliner = project.oneliner || 'No ´description available.'
  const projectDescription =
    project.description || 'No detailed description available.'
  const projectSlug = project.slug || ''

  const [upvotes, setUpvotes] = useState<number>(project.initial_vote_count)
  const [hasVoted, setHasVoted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVoteDeadlinePassed, setIsVoteDeadlinePassed] = useState(
    new Date() > new Date(TARGET_DATE),
  )

  useEffect(() => {
    const fetchVotes = async () => {
      if (!user) {
        setHasVoted(false)
        return
      }

      const { data: userVote, error: userVoteError } = await supabase
        .from('upvote')
        .select('id')
        .eq('project_id', project.project_id)
        .eq('user_uid', user.id)

      if (!userVoteError && userVote && userVote.length > 0) {
        setHasVoted(true)
      } else {
        setHasVoted(false)
      }

      const channel = supabase
        .channel(`project_${project.project_id}_votes`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'project_upvote_count',
            filter: `project_id=eq.${project.project_id}`,
          },
          (payload: any) => {
            setUpvotes(payload.new.upvote_count)
          },
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }

    fetchVotes()
  }, [project.project_id, supabase, user])

  const handleVote = async () => {
    if (isVoteDeadlinePassed) {
      toast.error('Voting period has ended!', {
        style: {
          background: '#27272a',
          color: '#fff',
          border: '1px solid #3f3f46',
        },
        duration: 2000,
      })
      return
    }

    if (!user) {
      setIsModalOpen(true)
      return
    }

    if (hasVoted) {
      const { error } = await supabase
        .from('upvote')
        .delete()
        .eq('project_id', project.project_id)
        .eq('user_uid', user.id)

      if (!error) {
        setHasVoted(false)
        setUpvotes((prev) => prev - 1)
        toast.success('Vote removed!', {
          icon: '',
          style: {
            background: '#27272a',
            color: '#fff',
            border: '1px solid #3f3f46',
          },
          duration: 2000,
        })
      } else {
        console.error('Error deleting vote:', error)
        toast.error('Failed to remove vote', {
          style: {
            background: '#27272a',
            color: '#fff',
            border: '1px solid #3f3f46',
          },
        })
      }
    } else {
      const { error } = await supabase.from('upvote').insert({
        project_id: project.project_id,
        user_uid: user.id,
      })

      if (!error) {
        setHasVoted(true)
        setUpvotes((prev) => prev + 1)
        fireConfetti()
        toast.success('Vote added!', {
          icon: '⭐',
          style: {
            background: '#27272a',
            color: '#fff',
            border: '1px solid #3f3f46',
          },
          duration: 2000,
        })
      } else {
        toast.error(error.message, {
          style: {
            background: '#27272a',
            color: '#fff',
            border: '1px solid #3f3f46',
          },
        })
      }
    }
  }

  const handleShare = async () => {
    try {
      const currentUrl = window.location.href
      await navigator.clipboard.writeText(currentUrl)
      toast.success('Link copied to clipboard!', {
        icon: '🔗',
        style: {
          background: '#27272a',
          color: '#fff',
          border: '1px solid #3f3f46',
        },
        duration: 2000,
      })
    } catch (err) {
      toast.error('Failed to copy link', {
        style: {
          background: '#27272a',
          color: '#fff',
          border: '1px solid #3f3f46',
        },
      })
    }
  }

  return (
    <div className="zinc-900 flex flex-col items-center px-4 lg:px-0">
      <style>{pulseStyle}</style>
      <div className="flex w-full flex-col gap-8 lg:max-w-[42rem]">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <Avatar className="relative h-16 w-16">
              <AvatarImage
                src={logoUrl}
                alt={projectName}
                className="object-cover"
              />
              <AvatarFallback>{projectName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <h1 className="text-xl font-bold sm:text-2xl">{projectName}</h1>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="zinc-900/40 hidden border-zinc-700 text-white sm:inline-flex"
                  >
                    {projectTrack}
                  </Badge>
                  <button
                    onClick={handleShare}
                    className="hidden items-center justify-center rounded-full p-1.5 text-zinc-400 transition-colors hover:text-yellow sm:flex"
                    aria-label="Share project"
                  >
                    <FiShare className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="zinc-900/40 w-fit border-zinc-700 text-white sm:hidden"
                >
                  {projectTrack}
                </Badge>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center rounded-full p-1.5 text-zinc-400 transition-colors hover:text-yellow sm:hidden"
                  aria-label="Share project"
                >
                  <FiShare className="h-4 w-4" />
                </button>
              </div>

              <p className="w-full text-sm text-zinc-400">{projectOneliner}</p>
            </div>
          </div>
          <div
            className={`mt-4 flex w-full cursor-pointer items-center justify-center rounded-lg border p-4 transition-colors sm:mt-0 sm:w-auto ${
              isVoteDeadlinePassed
                ? pulseVariants.disabled.base
                : hasVoted
                  ? pulseVariants.voted.border
                  : `${pulseVariants.notVoted.base} ${pulseVariants.notVoted.animation}`
            }`}
            onClick={handleVote}
          >
            <span className="text-2xl font-bold">{upvotes}</span>
            <span className="ml-1">▲</span>
          </div>
        </div>

        {embedUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800/50">
            <iframe
              src={embedUrl}
              className="h-full w-full"
              title={`${projectName} Demo Video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        )}
        <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
          {project.app_url && (
            <a
              href={project.app_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-zinc-500 px-4 py-2 text-sm text-zinc-200 transition-colors hover:border-yellow hover:text-yellow"
            >
              <IoRocketOutline className="h-4 w-4" />
              go to app
            </a>
          )}
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-zinc-500 px-4 py-2 text-sm text-zinc-200 transition-colors hover:border-yellow hover:text-yellow"
            >
              <FiGithub className="h-4 w-4" />
              see source code
            </a>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {project.hackers.map((hacker, index) => (
            <HackerCard key={index} hacker={hacker} />
          ))}
        </div>

        <div className="prose prose-zinc prose-invert max-w-none text-justify leading-relaxed text-zinc-300">
          <Markdown
            className="[&_code]:text-sm [&_pre]:relative [&_pre]:max-w-[calc(100vw-2rem)] [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-zinc-800/50 [&_pre]:p-4 lg:[&_pre]:max-w-[42rem] [&_pre_code]:block"
            remarkPlugins={[remarkGfm]}
          >
            {projectDescription}
          </Markdown>
        </div>
        <LoginModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          redirectPath={`/projects/${projectSlug}`}
        />
      </div>
    </div>
  )
}

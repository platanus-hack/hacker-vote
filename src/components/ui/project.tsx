'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@/utils/supabase'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/tailwind'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { HackerCard } from '@/components/ui/hackercard'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import LoginModal from '@/components/LoginModal'
import toast from 'react-hot-toast'
import { IoRocketOutline } from 'react-icons/io5'
import { FiGithub } from 'react-icons/fi'

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

export function Project({ project }: { project: ProjectProps }) {
  const embedUrl = getYouTubeEmbedUrl(project.demo_url)
  const logoUrl = project.logo_url || '/placeholder.svg'
  const projectName = project.project_name || 'Unknown Project'
  const projectTrack = project.track || 'No Track'
  const projectOneliner = project.oneliner || 'No description available.'
  const projectDescription =
    project.description || 'No detailed description available.'
  const projectSlug = project.slug || ''

  const supabase = createBrowserClient()
  const [upvotes, setUpvotes] = useState<number>(0)
  const [user, setUser] = useState<any>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVoteDeadlinePassed, setIsVoteDeadlinePassed] = useState(false)

  useEffect(() => {
    const fetchVoteDeadline = async () => {
      const { data, error } = await supabase
        .from('misc')
        .select('deadline')
        .single()

      if (error) {
        console.error('Error fetching vote deadline:', error)
        console.error()
        return
      }

      const deadline = new Date(data.deadline)
      const now = new Date()
      setIsVoteDeadlinePassed(now > deadline)
    }

    fetchVoteDeadline()
  }, [supabase])

  useEffect(() => {
    const fetchVotes = async () => {
      const { data: votes, error } = await supabase
        .from('project_upvote_count')
        .select('upvote_count')
        .eq('project_id', project.project_id)

      const upvoteData = votes?.[0]

      if (!error && upvoteData) {
        setUpvotes(upvoteData.upvote_count)
      } else if (error) {
        console.error('Error fetching votes:', error)
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()

      setUser(session?.user || null)

      if (session?.user) {
        const { data: userVote, error: userVoteError } = await supabase
          .from('upvote')
          .select('id')
          .eq('project_id', project.project_id)
          .eq('user_uid', session.user.id)

        console.log('userVote', userVote)

        if (!userVoteError && userVote && userVote.length > 0) {
          setHasVoted(true)
        } else {
          setHasVoted(false)
        }
      }
    }

    fetchVotes()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null)
        if (!session?.user) {
          setHasVoted(false)
        }
      },
    )

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [project.project_id, supabase])

  const handleVote = async () => {
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
        console.error('Error inserting vote:', error)
        toast.error('Failed to add vote', {
          style: {
            background: '#27272a',
            color: '#fff',
            border: '1px solid #3f3f46',
          },
        })
      }
    }
  }

  return (
    <div className="zinc-900 flex flex-col items-center px-4 lg:px-0">
      <div className="flex w-full flex-col gap-8 lg:w-[42rem]">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <Avatar className="h-16 w-16">
              <AvatarImage src={logoUrl} alt={projectName} />
              <AvatarFallback>{projectName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <h1 className="text-xl font-bold sm:text-2xl">{projectName}</h1>
                <Badge
                  variant="outline"
                  className="zinc-900/40 hidden border-zinc-700 text-white sm:inline-flex"
                >
                  {projectTrack}
                </Badge>
              </div>

              <Badge
                variant="outline"
                className="zinc-900/40 w-fit border-zinc-700 text-white sm:hidden"
              >
                {projectTrack}
              </Badge>

              <p className="w-full text-sm text-zinc-400">{projectOneliner}</p>
            </div>
          </div>
          <div
            className={`mt-4 flex w-full cursor-pointer items-center justify-center rounded-lg border p-4 transition-all duration-300 sm:mt-0 sm:w-auto ${
              hasVoted
                ? 'border-yellow text-yellow'
                : 'border-zinc-800 text-zinc-400 hover:border-yellow hover:text-yellow'
            } ${isVoteDeadlinePassed ? 'cursor-not-allowed opacity-50' : ''}`}
            onClick={isVoteDeadlinePassed ? undefined : handleVote}
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

        <div className="flex flex-wrap justify-center gap-4">
          {project.hackers.map((hacker, index) => (
            <div key={index} className="flex w-full flex-col sm:w-64">
              <HackerCard hacker={hacker} />
            </div>
          ))}
        </div>

        <div className="prose prose-zinc prose-invert w-full text-justify leading-relaxed text-zinc-300">
          <Markdown className="w-full lg:w-[42rem]" remarkPlugins={[remarkGfm]}>
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

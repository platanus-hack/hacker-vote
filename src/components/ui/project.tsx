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
      } else {
        console.error('Error deleting vote:', error)
      }
    } else {
      const { error } = await supabase.from('upvote').insert({
        project_id: project.project_id,
        user_uid: user.id,
      })

      if (!error) {
        setHasVoted(true)
        setUpvotes((prev) => prev + 1)
      } else {
        console.error('Error inserting vote:', error)
      }
    }
  }

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
        <div
          className={`cursor-pointer rounded-lg border p-4 transition-all duration-300 ${
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

      <div className="prose prose-zinc prose-invert text-justify leading-relaxed text-zinc-300">
        <Markdown remarkPlugins={[remarkGfm]}>{project.description}</Markdown>
      </div>
      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLogin={async () => {
          const {
            data: { session },
          } = await supabase.auth.getSession()
          setUser(session?.user || null)
        }}
      />
    </div>
  )
}

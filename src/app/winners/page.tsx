import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import Image from 'next/image'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import WinnersConfetti from '@/components/WinnersConfetti'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

export default async function Winners() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const { data: projectsWithVotes, error } = await supabase.from('projects')
    .select(`
      *,
      project_upvote_count!project_id(upvote_count)
    `)

  if (error) {
    return <div>Error: {error.message}</div>
  }

  let currentPosition = 1
  let currentVotes = -1
  const projectsWithPositions = projectsWithVotes
    .map((project) => ({
      ...project,
      votes: project.project_upvote_count[0]?.upvote_count ?? 0,
    }))
    .sort((a, b) => b.votes - a.votes)
    .map((project, i) => {
      if (project.votes !== currentVotes) {
        currentPosition = i + 1
        currentVotes = project.votes
      }
      return {
        ...project,
        position: currentPosition,
      }
    })

  return (
    <div className="container mx-auto px-4 py-10">
      <WinnersConfetti />
      <h1 className="mb-8 text-center text-3xl font-bold text-white">
        Projects Ranking
      </h1>
      <div className="mx-auto max-w-2xl">
        {projectsWithPositions.map((project) => (
          <Card
            key={project.id}
            className="mb-4 flex items-center p-4 transition-transform hover:scale-105"
            href={`/projects/${project.slug}`}
          >
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full">
              <span className="text-2xl font-bold text-yellow">
                #{project.position}
              </span>
            </div>
            <div className="flex grow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={project.logo_url || '/placeholder.svg'}
                      alt={project.project_name || 'Unknown Project'}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {(project.project_name || 'U')[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grow">
                    <CardTitle className="text-xl">
                      {project.project_name || 'Unknown Project'}
                    </CardTitle>
                    <CardDescription>
                      {project.oneliner || 'No description available.'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-yellow">
                {project.votes}
              </span>
              <span className="block text-zinc-400 ">votes</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

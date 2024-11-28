import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import * as React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Countdown from '@/components/Countdown'
import { getInitialTimeLeft } from '@/components/CountdownServer'

export default async function Projects() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*')

  if (projectsError) {
    return <div>Error: {projectsError.message}</div>
  }

  let projectsToShow = projects

  if (user) {
    const { data: upvotes, error: upvotesError } = await supabase
      .from('upvote')
      .select('project_id')
      .eq('user_uid', user.id)

    if (!upvotesError) {
      projectsToShow = projects?.map((project) => ({
        ...project,
        voted:
          upvotes?.some((upvote) => upvote.project_id === project.project_id) ||
          false,
      }))
    }
  }

  projectsToShow = (projectsToShow || []).sort((a, b) =>
    a.project_name.localeCompare(b.project_name),
  )

  const { timeLeft, isVotingEnded } = getInitialTimeLeft()

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <Countdown
          initialTimeLeft={timeLeft}
          initialIsVotingEnded={isVotingEnded}
        />
      </div>

      <div className="flex justify-center">
        <div className="container grid max-w-5xl grid-cols-1 place-items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {projectsToShow?.map((project) => (
            <Card
              key={project.id}
              className="flex h-60 w-60 flex-col"
              voted={project.voted}
              href={`/projects/${project.slug}`}
            >
              <CardHeader>
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={project.logo_url || '/placeholder.svg'}
                    alt={project.project_name || 'Project logo'}
                  />
                  <AvatarFallback>
                    {(project.project_name || 'P').charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-xl">
                  {project.project_name || 'Unknown Project'}
                </CardTitle>
                <CardDescription>
                  {project.oneliner || 'No description available.'}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

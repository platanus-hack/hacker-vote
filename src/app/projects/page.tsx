import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import * as React from 'react'
import Image from 'next/image'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
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

  const initialTimeLeft = getInitialTimeLeft()

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <Countdown initialTimeLeft={initialTimeLeft} />
      </div>

      <div className="flex justify-center">
        <div className="grid max-w-[1400px] grid-cols-1 place-items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {projectsToShow?.map((project) => (
            <Card
              key={project.id}
              className="flex flex-col"
              voted={project.voted}
              href={`/projects/${project.slug}`}
            >
              <CardHeader>
                <Image
                  src={project.logo_url}
                  alt={project.name || 'Project logo'}
                  width={64}
                  height={64}
                  className="h-24 w-24 rounded-full object-cover"
                />
              </CardHeader>
              <CardContent>
                <CardTitle>{project.project_name}</CardTitle>
                <CardDescription>{project.oneliner}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

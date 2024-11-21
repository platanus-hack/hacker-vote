// src/app/winners/page.tsx
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

export default async function Winners() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const { data: projectsWithVotes, error } = await supabase.from('projects')
    .select(`
      *,
      upvotes:upvote(count)
    `)

  if (error) {
    return <div>Error: {error.message}</div>
  }

  let currentPosition = 1
  let currentVotes = -1
  const projectsWithPositions = projectsWithVotes
    .map((project) => ({
      ...project,
      votes: project.upvotes[0]?.count || 0,
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
      <h1 className="mb-8 text-center text-4xl font-bold text-white">
        Projects Ranking
      </h1>
      <div className="mx-auto max-w-2xl">
        {projectsWithPositions.map((project) => (
          <Card
            key={project.id}
            variant="ranking"
            className="mb-4 flex items-center p-4 transition-transform hover:scale-105"
            href={`/projects/${project.project_name}`}
          >
            <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800">
              <span className="text-2xl font-bold text-[#FFEC40]">
                #{project.position}
              </span>
            </div>
            <div className="flex-1">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Image
                    src={project.logo_url}
                    alt={project.name || 'Project logo'}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <CardTitle>{project.project_name}</CardTitle>
                    <CardDescription>{project.oneliner}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-[#FFEC40]">
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

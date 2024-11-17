import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import * as React from 'react'
import Image from 'next/image'
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'

export default async function Projects() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  const { data: projects, error } = await supabase.from('projects').select('*')

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-4xl font-bold text-white">Projects Gallery</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col">
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
  )
}

import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { FiYoutube, FiCalendar } from 'react-icons/fi'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function ProjectPage({
  params,
}: {
  params: { project_name: string }
}) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('project_name', params.project_name)
    .single()

  if (error || !project) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="flex flex-col">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Image
              src={project.logo_url}
              alt={project.project_name}
              className="h-12 w-12 rounded-lg object-cover"
              width={48}
              height={48}
            />
            <div>
              <CardTitle>{project.project_name}</CardTitle>
              <CardDescription>{project.oneliner}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{project.description}</p>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <FiCalendar className="h-4 w-4" />
            <span>{new Date(project.created_at).toLocaleDateString()}</span>
          </div>
        </CardContent>
        <CardFooter className="mt-auto">
          {project.demo_url && (
            <Button variant="outline" className="w-full" asChild>
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <FiYoutube className="h-4 w-4" />
                Watch Demo
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

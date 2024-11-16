import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function Projects2() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const { data: projects, error } = await supabase.from('projects').select('*')

  if (error) {
    return <div>Error: {error.message}</div>
  }

  // Imprimir los datos en la consola
  console.log('Proyectos obtenidos de Supabase:', projects)

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-4xl font-bold text-white">Projects Gallery</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{project.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <a href={`/projects/${project.id}`}>View Project</a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

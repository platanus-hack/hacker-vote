import { Project } from '@/components/ui/project'
import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

export default async function Component({
  params,
}: {
  params: { project_name: string }
}) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const { data: project, error } = await supabase
    .from('projects')
    .select(
      'project_name, logo_url, oneliner, description, demo_url, track, hackers(full_name, github_url, linkedin_url)',
    )
    .eq('project_name', params.project_name)
    .single()

  if (!project || error) {
    notFound()
  }

  const formattedProject = {
    project_name: project.project_name,
    logo_url: project.logo_url || '/placeholder.svg',
    oneliner: project.oneliner || 'No description available.',
    hackers: project.hackers.map((hacker: any) => ({
      name: hacker.full_name,
      avatar_url: hacker.github_url
        ? `${hacker.github_url.replace(
            'https://github.com/',
            'https://github.com/',
          )}.png`
        : '/placeholder.svg',
      github_url: hacker.github_url || '#',
      linkedin_url: hacker.linkedin_url || '#',
    })),
    demo_url: project.demo_url,
    track: project.track,
    description: project.description,
  }

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-4xl">
        <Project project={formattedProject} />
      </div>
    </div>
  )
}

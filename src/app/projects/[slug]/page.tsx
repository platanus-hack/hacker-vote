import { Project } from '@/components/ui/project'
import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

export default async function Component({
  params,
}: {
  params: { slug: string }
}) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const { data: project, error } = await supabase
    .from('projects')
    .select(
      'project_id, project_name, logo_url, oneliner, description, demo_url, track, hackers(full_name, github_url, linkedin_url)',
    )
    .eq('slug', params.slug)
    .single()

  if (!project || error) {
    console.error('Error fetching project:', error)
    notFound()
  }

  const formattedProject = {
    project_id: project.project_id || 'Unknown ID',
    project_name: project.project_name || 'Unknown Project',
    logo_url: project.logo_url || '/placeholder.svg',
    oneliner: project.oneliner || 'No description available.',
    hackers: (project.hackers || []).map((hacker) => ({
      name: hacker.full_name || 'Unknown',
      avatar_url: hacker.github_url
        ? `${hacker.github_url}.png`
        : '/placeholder.svg',
      github_url: hacker.github_url || '#',
      linkedin_url: hacker.linkedin_url || '#',
    })),
    demo_url: project.demo_url || '',
    track: project.track || 'No Track',
    description: project.description || 'No description available.',
  }

  return (
    <>
      <div className="zinc-900 flex min-h-screen flex-col">
        <div className="flex flex-1 justify-center p-6">
          <div className="mx-auto max-w-4xl">
            <Project project={formattedProject} />
          </div>
        </div>
      </div>
    </>
  )
}

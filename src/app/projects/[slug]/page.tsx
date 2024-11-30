import { Project } from '@/components/ui/project'
import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', params.slug)
    .single()

  return {
    title: `Platanus Hack Voting | ${project?.project_name || 'Project'}`,
    description: project?.oneliner || 'A Platanus Hack project',
    openGraph: {
      title: `Platanus Hack | ${project?.project_name || 'Project'}`,
      description: project?.oneliner || 'A Platanus Hack project',
    },
  }
}

export default async function Component({
  params,
}: {
  params: { slug: string }
}) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // Get the project with vote count
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select(
      `
      *,
      project_upvote_count!project_id(upvote_count)
    `,
    )
    .eq('slug', params.slug)
    .single()

  if (!project || projectError) {
    console.error('Error fetching project:', projectError)
    notFound()
  }

  const { data: hackers, error: hackersError } = await supabase
    .from('hackers')
    .select('full_name, github_url, linkedin_url')
    .eq('project_id', project.project_id)

  if (hackersError) {
    console.error('Error fetching hackers:', hackersError)
  }

  const formattedProject = {
    project_id: project.project_id || 'Unknown ID',
    project_name: project.project_name || 'Unknown Project',
    slug: project.slug || 'Unknown Slug',
    logo_url: project.logo_url || '/placeholder.svg',
    oneliner: project.oneliner || 'No description available.',
    initial_vote_count: project.project_upvote_count?.[0]?.upvote_count || 0,
    hackers: (hackers || []).map((hacker) => ({
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
    app_url: project.app_url || '',
    repo_url: project.repo_url || '',
  }

  return (
    <>
      <div className="zinc-900 flex min-h-screen flex-col">
        <div className="flex flex-1 justify-center p-2 lg:p-6">
          <div className="mx-auto max-w-4xl">
            <Project project={formattedProject} />
          </div>
        </div>
      </div>
    </>
  )
}

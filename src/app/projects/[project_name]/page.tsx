import { Project } from '@/components/ui/project'
import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import AuthButton from '@/components/AuthButton'
import ThemeToggle from '@/components/ThemeToggle'

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
      'project_id, project_name, logo_url, oneliner, description, demo_url, track, hackers(full_name, github_url, linkedin_url)',
    )
    .eq('project_name', params.project_name)
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

  const canInitSupabaseClient = () => {
    try {
      createServerClient(cookieStore)
      return true
    } catch (e) {
      return false
    }
  }

  const isSupabaseConnected = canInitSupabaseClient()

  return (
    <>
      <head>
        <meta property="og:image" content="<generated>" />
        <meta property="og:image:alt" content="About Acme" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        {/* Agrega otras metaetiquetas necesarias aquí */}
      </head>
      <div className="zinc-900 flex min-h-screen flex-col">
        <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
          <div className="flex w-full max-w-4xl items-center justify-between p-3 text-sm">
            {isSupabaseConnected && <AuthButton />}
            <ThemeToggle />
          </div>
        </nav>

        <div className="flex flex-1 justify-center p-6">
          <div className="mx-auto max-w-4xl">
            <Project project={formattedProject} />
          </div>
        </div>
      </div>
    </>
  )
}

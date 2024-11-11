import { createServerClient } from '@/utils/supabase'
import { notFound } from 'next/navigation'
import Head from 'next/head'
import { cookies } from 'next/headers'

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

  if (!project || error) {
    notFound()
  }

  const ogImage = `https://vote.hack.platan.us/api/og?name=${encodeURIComponent(
    project.project_name,
  )}&logo=${encodeURIComponent(project.logo_url || '')}`

  return (
    <>
      <Head>
        <title>{`${project.project_name} - Voting Platform`}</title>
        <meta
          property="og:title"
          content={`${project.project_name} - Voting Platform`}
        />
        <meta property="og:description" content={project.oneliner} />
        <meta property="og:image" content={ogImage} />
        <meta
          property="og:url"
          content={`https://vote.hack.platan.us/projects/${project.project_name}`}
        />
        <meta property="og:type" content="website" />
      </Head>
      <main className="w-full bg-background text-foreground">
        <section className="mx-auto max-w-4xl px-6 py-12">
          <h1 className="mb-4 text-3xl font-bold">{project.project_name}</h1>
          <p className="mb-6 text-muted-foreground">{project.oneliner}</p>
          <div dangerouslySetInnerHTML={{ __html: project.description }} />
          <a
            href={project.demo_url}
            className="mt-4 inline-block rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver Demo
          </a>
        </section>
      </main>
    </>
  )
}

import { createServerClient } from '@/utils/supabase'
import { notFound } from 'next/navigation'
import Head from 'next/head'
import { cookies } from 'next/headers'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

type Project = {
  project_name: string
  logo_url: string | null
  oneliner: string
  description: string
  demo_url: string | null
}

export async function generateMetadata({
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

  if (!project) {
    throw new Error('Project data is required to generate metadata')
  }

  const ogImage = `http://localhost:3000/api/og?name=${encodeURIComponent(
    project.project_name,
  )}&logo=${encodeURIComponent(
    project.logo_url || '',
  )}&description=${encodeURIComponent(project.oneliner)}`

  return {
    title: `${project.project_name} - Voting Platform`,
    description: project.oneliner,
    openGraph: {
      title: `${project.project_name}`,
      description: project.oneliner,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${project.project_name} - Voting Platform`,
        },
      ],
      url: `http://localhost:3000/projects/${encodeURIComponent(
        project.project_name,
      )}`,
      type: 'website',
    },
  }
}

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

  console.log('Project data:', project)
  // const metadata = await generateMetadata(project)

  return (
    <>
      <div className="margin-0 flex min-h-screen w-full flex-col text-white">
        <Navbar />
        <main className="mx-auto w-full max-w-4xl px-6 py-12">
          <div className="flex flex-col items-center space-y-4 text-center">
            <img
              src={project.logo_url || '/default-image.jpg'}
              alt={`${project.project_name} Logo`}
              className="h-32 w-32 rounded-md object-cover shadow-md"
            />
            <h1 className="text-4xl font-bold">{project.project_name}</h1>
            <p className="text-lg text-gray-300">{project.oneliner}</p>
          </div>

          <section className="mt-10 space-y-8">
            <div className="rounded-lg bg-gray-800 p-6 shadow-md">
              <h2 className="text-2xl font-bold text-green-400">Description</h2>
              <div
                className="prose prose-invert mt-4 text-gray-200"
                dangerouslySetInnerHTML={{ __html: project.description }}
              />
            </div>

            <div className="rounded-lg bg-gray-800 p-6 shadow-md">
              <h2 className="text-2xl font-bold text-green-400">Demo</h2>
              {project.demo_url ? (
                <div className="mt-4">
                  <iframe
                    width="100%"
                    height="315"
                    src={project.demo_url.replace('watch?v=', 'embed/')}
                    title={`${project.project_name} Demo`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-md"
                  ></iframe>
                </div>
              ) : (
                <p className="text-gray-300">
                  No demo available for this project.
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-center">
              <button className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-900 text-3xl text-white shadow-lg transition-all hover:bg-green-500 focus:outline-none">
                👍
              </button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}

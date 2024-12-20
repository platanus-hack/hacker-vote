import { ImageResponse } from 'next/og'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'

export default async function opengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const slug = (await params).slug

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('project_name, oneliner, logo_url, project_id')
    .eq('slug', slug)
    .single()

  if (projectError || !project) {
    return new Response('Project not found', { status: 404 })
  }

  const { data: hackers, error: hackersError } = await supabase
    .from('hackers')
    .select('full_name')
    .eq('project_id', project.project_id)

  if (hackersError || !hackers) {
    return new Response('Hackers not found', { status: 404 })
  }

  const hackerNames = hackers.map((hacker) => hacker.full_name).join(' , ')

  const response = await fetch(new URL('Oxanium.ttf', import.meta.url))
  const oxanium = await response.arrayBuffer()

  const jsx = (
    <article tw="h-full w-full flex flex-col justify-between bg-zinc-900 text-white p-8 font-mono">
      <header tw="flex items-center justify-between mb-12">
        <h1 tw="text-5xl flex items-center gap-4">
          platanus hack <span tw="text-gray-400 gap-2 ml-2">|</span>{' '}
          <span tw="text-gray-400 ml-2">voting</span>
        </h1>
        <p tw="text-gray-400 text-4xl">deadline: 1.dec-23:59</p>
      </header>

      <section tw="flex gap-40 items-center mb-16 text-center">
        <div tw="w-64 h-64 rounded-full flex items-center justify-center flex-shrink-0 ml-16">
          {project.logo_url && (
            <img
              src={project.logo_url}
              alt="Project Logo"
              tw="w-full h-full rounded-full object-cover"
            />
          )}
        </div>
        <div tw="flex flex-col gap-12 flex-grow ml-24">
          <h2 tw="text-7xl font-medium">{project.project_name}</h2>
          <p tw="text-gray-400 text-3xl">{project.oneliner}</p>
        </div>
      </section>

      <footer tw="flex justify-center text-gray-400 text-center">
        <p tw="text-2xl font-semibold">{hackerNames}</p>
      </footer>
    </article>
  )

  const fonts = [
    {
      name: 'Oxanium',
      data: oxanium,
    },
  ]

  return new ImageResponse(jsx, { width: 1200, height: 630, fonts })
}

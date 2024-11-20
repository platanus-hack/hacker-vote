import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const runtime = 'edge'

export default async function Image({
  params,
}: {
  params: { project_name: string }
}) {
  const { project_name } = params

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('project_name, oneliner, logo_url')
    .eq('project_name', project_name)
    .single()

  if (projectError || !project) {
    return new Response('Project not found', { status: 404 })
  }

  const { data: hackers, error: hackersError } = await supabase
    .from('hackers')
    .select('full_name')
    .eq('project_name', project_name)

  if (hackersError || !hackers) {
    return new Response('Hackers not found', { status: 404 })
  }

  const hackerNames = hackers.map((hacker) => hacker.full_name).join(', ')

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: 'black',
          color: 'white',
          width: '1200px',
          height: '630px',
          padding: '32px',
          fontFamily: 'monospace',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '48px',
          }}
        >
          <h1 style={{ fontSize: '32px' }}>
            platanus hack{' '}
            <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>|</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>voting</span>
          </h1>
          <p style={{ color: 'gray' }}>deadline: 1.dec-23:59</p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'flex-start',
            marginBottom: '64px',
          }}
        >
          <div
            style={{
              width: '128px',
              height: '128px',
              backgroundColor: 'white',
              borderRadius: '50%',
              flexShrink: 0,
            }}
          >
            {project.logo_url && (
              <img
                src={project.logo_url}
                alt="Project Logo"
                style={{ width: '100%', height: '100%', borderRadius: '50%' }}
              />
            )}
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <h2 style={{ fontSize: '48px', fontWeight: '500' }}>
              {project.project_name}
            </h2>
            <p style={{ color: 'gray', fontSize: '24px' }}>
              {project.oneliner}
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            color: 'gray',
          }}
        >
          {hackerNames}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}

import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const projectId = parseInt(params.id, 10)

    if (isNaN(projectId)) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    const supabase = createServerClient(cookies())
    const { data: project, error } = await supabase
      .from('projects')
      .select('slug')
      .eq('project_id', projectId)
      .single()

    if (error || !project?.slug) {
      return NextResponse.redirect(new URL('/projects', request.url))
    }

    return NextResponse.redirect(
      new URL(`/projects/${project.slug}`, request.url),
    )
  } catch (error) {
    console.error('Error in QR redirect:', error)
    return NextResponse.redirect(new URL('/', request.url))
  }
}

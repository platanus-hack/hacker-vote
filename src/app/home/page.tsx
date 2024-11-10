import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProjectGrid from '@/components/ProjectGrid'
import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'

export default async function Index() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const { data: projects, error } = await supabase.from('projects').select('*')

  if (error) {
    console.error('Error al cargar los proyectos:', error.message)
  }

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <Navbar />

      <div className="mt-16">
        <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="mb-6 text-center text-3xl font-bold">
            Proyectos Destacados
          </h1>
          {projects ? (
            <ProjectGrid projects={projects} />
          ) : (
            <p className="text-center text-muted-foreground">
              No se pudieron cargar los proyectos. Intenta más tarde.
            </p>
          )}
        </section>
      </div>

      <Footer />
    </main>
  )
}

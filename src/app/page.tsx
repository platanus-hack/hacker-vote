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
    <main className="flex w-full flex-col bg-background text-foreground">
      {/* Navbar */}
      <Navbar />

      {/* Contenido Principal */}
      <div className="w-full flex-grow">
        <section className="mx-auto w-full max-w-7xl px-6 py-12">
          <h1 className="mb-8 text-center font-jetbrains-mono text-3xl">
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

      {/* Espaciado Adicional */}
      <div className="h-20"></div>

      {/* Footer */}
      <Footer />
    </main>
  )
}

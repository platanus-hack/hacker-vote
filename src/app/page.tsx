import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProjectGrid from '@/components/ProjectGrid'
import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import Head from 'next/head'

export default async function Index() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const { data: projects, error } = await supabase.from('projects').select('*')

  if (error) {
    console.error('Error al cargar los proyectos:', error.message)
  }

  return (
    <>
      <Head>
        <title>Voting Platform - Home</title>
        <meta property="og:title" content="Voting Platform" />
        <meta property="og:description" content="made with 💛 by 🍌" />
        <meta
          property="og:image"
          content="https://raw.githubusercontent.com/rafafdz/platanus-hack-landing/main/public/platanus-logo-horizontal.svg"
        />
        <meta property="og:url" content="https://vote.hack.platan.us" />
        <meta property="og:type" content="website" />
      </Head>

      <main className="flex w-full flex-col bg-background text-foreground">
        <Navbar />

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

        <div className="h-20"></div>

        <Footer />
      </main>
    </>
  )
}

'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

const ProjectCard = ({ project }: { project: any }) => {
  const router = useRouter()

  return (
    <div className="mx-auto h-96 w-96 rounded-lg bg-gray-800 shadow-lg transition-transform hover:shadow-black">
      {/* Header con círculos y título dinámico */}
      <div className="flex items-center p-3">
        <div className="flex space-x-2">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
        </div>
        <div className="ml-6 truncate text-sm text-white">
          {project.project_name}.info
        </div>
      </div>

      {/* Contenedor dinámico */}
      <div className="flex h-auto flex-col items-start rounded-b-lg bg-gray-700 p-4">
        {/* Bloque principal con comandos, logo y oneliner */}
        <div
          onClick={() =>
            router.push(`/projects/${encodeURIComponent(project.project_name)}`)
          }
          className="flex w-full cursor-pointer flex-col items-center space-y-4 rounded-md bg-gray-900 p-4 font-jetbrains-mono text-white transition hover:bg-white hover:bg-opacity-10"
        >
          {/* Comando `cd` */}
          <div className="w-full truncate text-left">
            <span className="text-green-500">
              cd {project.project_name}/logo.svg
            </span>
          </div>
          {/* Logo del proyecto */}
          <img
            className="h-32 w-32 rounded-md object-cover shadow-md"
            src={project.logo_url || '/default-image.jpg'}
            alt={`${project.project_name} Logo`}
          />
          {/* Comando `vim` */}
          <div className="w-full truncate text-left">
            <span className="text-green-500">
              vim {project.project_name}/oneliner.txt
            </span>
          </div>
          {/* Oneliner */}
          <div className="w-full truncate text-left">
            {project.oneliner || 'Insert your oneliner here.'}
          </div>
        </div>
        {/* Botón de Like centrado */}
        <div className="mt-4 flex w-full justify-center">
          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-all hover:bg-green-500 focus:outline-none">
            👍
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard

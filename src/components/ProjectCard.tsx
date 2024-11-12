'use client'

import React from 'react'

const ProjectCard = ({ project }: { project: any }) => {
  return (
    <div className="mx-auto h-96 w-96 rounded-lg bg-gray-800 shadow-lg transition-transform hover:shadow-black">
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

      <div className="flex h-auto flex-col items-start rounded-b-lg bg-gray-700 p-4">
        <div className="flex w-full flex-col items-center space-y-4 rounded-md bg-gray-900 p-4 font-jetbrains-mono text-white">
          <div className="w-full truncate text-left">
            <span className="text-green-500">
              cd {project.project_name}/logo.svg
            </span>
          </div>
          <img
            className="h-32 w-32 rounded-md object-cover shadow-md"
            src={project.logo_url || '/default-image.jpg'}
            alt={`${project.project_name} Logo`}
          />
          <div className="w-full truncate text-left">
            <span className="text-green-500">
              vim {project.project_name}/oneliner.txt
            </span>
          </div>
          <div className="w-full truncate text-left">
            {project.oneliner || 'Insert your oneliner here.'}
          </div>
        </div>
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

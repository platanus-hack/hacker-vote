import ProjectCard from './ProjectCard'

const ProjectGrid = ({ projects }: { projects: any[] }) => {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="flex h-full flex-col">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectGrid

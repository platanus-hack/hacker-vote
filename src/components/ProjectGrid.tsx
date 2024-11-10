import ProjectCard from './ProjectCard'

const ProjectGrid = ({ projects }: { projects: any[] }) => {
  return (
    <div className="container mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div key={project.id} className="flex h-full flex-col">
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  )
}

export default ProjectGrid

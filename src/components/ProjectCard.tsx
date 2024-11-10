const ProjectCard = ({ project }: { project: any }) => {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded bg-card shadow-lg dark:bg-gray-800">
      <img
        className="h-48 w-full object-cover"
        src={project.logo_url || '/default-image.jpg'}
        alt={project.project_name}
      />

      <div className="flex flex-grow flex-col justify-between px-6 py-4">
        <h2 className="mb-4 text-center text-xl font-bold text-card-foreground dark:text-white">
          {project.project_name}
        </h2>

        <div className="flex items-center justify-between gap-x-4">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-white hover:bg-primary-foreground"
            title="Me gusta"
          >
            👍
          </button>
          <a
            href={`/projects/${project.id}`}
            className="rounded bg-secondary px-4 py-2 font-bold text-white hover:bg-secondary-foreground"
          >
            Details
          </a>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard

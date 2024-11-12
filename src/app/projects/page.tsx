'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FiYoutube, FiCalendar } from 'react-icons/fi'
import projectsData from '../../../public/projects/projects.json'
import Image from 'next/image'
import { useState } from 'react'

export default function ProjectsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-4xl font-bold">Projects gallery</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projectsData.projects.map((project) => (
          <Card key={project.project_id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <ImageWithFallback
                  src={project.logo_url}
                  fallbackSrc="/projects/default.webp"
                  alt={project.project_name}
                  className="h-12 w-12 rounded-lg object-cover"
                  width={48}
                  height={48}
                />
                <div>
                  <CardTitle>{project.project_name}</CardTitle>
                  <CardDescription>{project.oneliner}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <FiCalendar className="h-4 w-4" />
                <span>{new Date(project.created_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
            <CardFooter className="mt-auto">
              {project.demo_url && (
                <Button variant="outline" className="w-full" asChild>
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <FiYoutube className="h-4 w-4" />
                    Watch Demo
                  </a>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ImageWithFallback({
  src,
  fallbackSrc,
  alt,
  ...props
}: {
  src: string
  fallbackSrc: string
  alt: string
  [key: string]: any
}) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallbackSrc)}
      className="object-cover"
    />
  )
}

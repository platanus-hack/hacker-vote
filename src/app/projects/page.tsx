// src/app/projects/page.tsx
'use client'

import * as React from 'react'
import projectsData from '../../../public/projects/projects.json'
import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/utils/tailwind'

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('rounded-lg border bg-black text-white shadow-md', className)}
    {...props}
  />
))
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col items-center justify-center p-10', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-xl font-bold text-yellow-400', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-md text-gray-400', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0 text-center', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex justify-center p-6', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

export default function ProjectsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-4xl font-bold text-white">Projects Gallery</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projectsData.projects.map((project) => (
          <Card key={project.project_id} className="flex flex-col">
            <CardHeader>
              <ImageWithFallback
                src={project.logo_url}
                fallbackSrc="/projects/default.webp"
                alt={project.project_name}
                className="h-24 w-24 rounded-full object-cover"
                width={96}
                height={96}
              />
            </CardHeader>
            <CardContent>
              <CardTitle>{project.project_name}</CardTitle>
              <CardDescription>{project.oneliner}</CardDescription>
            </CardContent>
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
      className={cn('object-cover', props.className)}
    />
  )
}

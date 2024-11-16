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
    className={cn(
      'h-64 w-64 rounded-lg border bg-black text-white shadow-md',
      className,
    )} // Cambiado a w-64 h-64 para hacer la tarjeta de 250x250 píxeles
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
    className={cn('flex flex-col items-center justify-center p-4', className)} // Ajustado el padding para que la imagen encaje mejor
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
    className={cn('text-2xl font-bold', className)} // Cambiado a text-3xl para hacer el título más grande
    style={{ color: '#FFEC40' }} // Aplicar el color amarillo específico
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
    className={cn('mb-6 mt-2 text-xs text-white', className)} // Cambiado a text-xs y text-white para hacer el "one liner" más pequeño y blanco, y añadido mb-6 para más espacio
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-4 pt-0 text-center', className)} {...props} /> // Ajustado el padding para que el contenido encaje mejor
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex justify-center p-4', className)} // Ajustado el padding para que el footer encaje mejor
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

export default function ProjectsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-4xl font-bold text-white">Projects Gallery</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {projectsData.projects.map((project) => (
          <Card key={project.project_id} className="flex flex-col">
            <CardHeader>
              <ImageWithFallback
                src={project.logo_url}
                fallbackSrc="/projects/default.webp"
                alt={project.project_name}
                className="h-24 w-24 rounded-full object-cover" // Ajustado a h-24 w-24 para que la imagen encaje mejor en la tarjeta de 250x250 píxeles
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

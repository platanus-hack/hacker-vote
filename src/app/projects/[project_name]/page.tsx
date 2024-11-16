'use client'

import { Project } from '@/components/ui/project'

export default function Component({
  project = {
    project_name: 'My super project',
    logo_url: '/placeholder.svg',
    oneliner:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum.',
    hackers: [
      {
        name: 'John Doe',
        avatar_url: '/placeholder.svg',
        github_url: '#',
        linkedin_url: '#',
      },
      {
        name: 'John Doe',
        avatar_url: '/placeholder.svg',
        github_url: '#',
        linkedin_url: '#',
      },
      {
        name: 'John Doe',
        avatar_url: '/placeholder.svg',
        github_url: '#',
        linkedin_url: '#',
      },
    ],
    demo_url: 'https://www.youtube.com/watch?v=qBRaI0ZeAf8&t=108s',
    track: 'finanzas',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ut dignissim risus. Quisque feugiat pretium mi rutrum pharetra. Integer eget justo elit. Integer commodo feugiat lectus, vitae volutpat justo. Aenean finibus nec sapien quis aliquam. Aenean nibh lacus, dignissim facilisis sem sed, porttitor auctor nisl. Nulla diam nisi, ultricies non augue vulputate, rutrum consequat ante. In auctor, magna in placerat auctor, nulla sapien euismod orci, nec pharetra elit sem eu lectus. In accumsan nisl quis odio vehicula tincidunt. Vivamus sollicitudin ullamcorper magna, a porta orci facilisis a. Sed dictum, lorem sit amet blandit aliquet, ligula nulla viverra odio, quis lacinia mi sem non nulla. Mauris eget fermentum purus. Cras scelerisque ut nibh nec lobortis. In bibendum scelerisque metus, id vulputate justo vestibulum eu.',
  },
}) {
  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-4xl">
        <Project project={project} />
      </div>
    </div>
  )
}

import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const config = {
  runtime: 'edge',
}

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(
    text,
  )}`
  const css = await (await fetch(url)).text()
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/)

  if (resource) {
    const response = await fetch(resource[1])
    if (response.status == 200) {
      return await response.arrayBuffer()
    }
  }

  throw new Error('failed to load font data')
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const projectName = searchParams.get('name') || 'Project Name'
  const projectLogo =
    searchParams.get('logo') || 'https://via.placeholder.com/200'
  const projectDescription =
    searchParams.get('description') || 'Project Description'
  const text = 'platanus hack | voting'

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: 'white',
          height: '100%',
          width: '100%',
          fontSize: 100,
          fontFamily: 'Oxanium',
          paddingTop: '100px',
          paddingLeft: '50px',
        }}
      >
        {text}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Oxanium',
          data: await loadGoogleFont('Oxanium', text),
          style: 'normal',
        },
      ],
    },
  )
}

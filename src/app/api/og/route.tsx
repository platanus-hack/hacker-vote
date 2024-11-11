import { ImageResponse } from 'next/og'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const projectLogo =
    searchParams.get('logo') || 'https://via.placeholder.com/200'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '40px',
          background: 'linear-gradient(135deg, #1a202c, #2d3748)',
          color: 'white',
        }}
      >
        <div tw="flex flex-col justify-start items-start w-1/2">
          <h2 tw="text-4xl font-bold tracking-tight mb-4">Voting Platform</h2>
          <img
            src="https://raw.githubusercontent.com/rafafdz/platanus-hack-landing/main/public/platanus-logo-horizontal.svg"
            alt="Company Logo"
            tw="w-64 h-auto"
          />
        </div>

        <div tw="flex flex-col justify-center items-center w-1/2 font-jetbrains">
          <img
            src={projectLogo}
            alt="Project Logo"
            tw="w-48 h-48 rounded-lg mb-4 shadow-lg"
          />
          <h2 tw="text-3xl font-bold tracking-tight">Vote Now!</h2>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}

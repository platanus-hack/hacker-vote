import { JetBrains_Mono, Oxanium } from 'next/font/google'
import ThemeProvider from '@/providers/ThemeProvider'
import NextTopLoader from 'nextjs-toploader'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import { PostHogProvider } from '@/providers/PostHogProvider'
import Navbar from '@/components/Navbar'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'Platanus Hack Voting',
  description:
    'platanus hack voting. vote for your favorite projects. the most voted project will win a prize.',
}

const oxanium = Oxanium({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-oxanium',
  display: 'swap',
})

const jetBrainsMono = JetBrains_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${jetBrainsMono.variable} ${oxanium.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-background font-jetbrains-mono text-foreground"
        suppressHydrationWarning
      >
        <NextTopLoader showSpinner={false} height={2} color="#2acf80" />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PostHogProvider>
            <ReactQueryProvider>
              <Navbar />
              <main className="zinc-900 flex min-h-screen flex-col items-center">
                {children}
                <Analytics />
              </main>
              <ReactQueryDevtools initialIsOpen={false} />
            </ReactQueryProvider>
          </PostHogProvider>
        </ThemeProvider>
        <Toaster position="bottom-center" />
      </body>
    </html>
  )
}

import '@/styles/globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dev Personality Analyzer',
  description: 'Decode your developer DNA.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background selection:bg-primary/30 text-on-surface font-body overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import './globals.css'
import { Footer } from '@/components/shell/Footer'
import { ThemeScript } from '@/components/shell/ThemeScript'

export const metadata: Metadata = {
  title: 'Equipt — Daily Dashboard',
  description: 'Live analytics and weekly planner, synced from Google Sheets.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen bg-bone font-sans text-ink antialiased dark:bg-bone-dark dark:text-linen">
        <div className="flex min-h-screen flex-col">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}

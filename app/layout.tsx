import type { Metadata } from 'next'
import './globals.css'
import { Footer } from '@/components/shell/Footer'

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
    <html lang="en">
      <body className="min-h-screen bg-bone font-sans text-ink antialiased">
        <div className="flex min-h-screen flex-col">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}

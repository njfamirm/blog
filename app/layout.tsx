import type { Metadata } from 'next'
import { Inter, Fira_Code } from 'next/font/google'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Minimalist Architect Publication',
  description: 'Signal over noise. Absolute digital minimalism. Form follows pure function.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">{children}</body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Inter, Fira_Code } from 'next/font/google'

import { Header } from '@/components/header'
import { site } from '@/lib/site'
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
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.handle}`,
  },
  description: site.description,
  authors: [{ name: site.name, url: site.url }],
  openGraph: {
    type: 'website',
    siteName: site.title,
    title: site.title,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
  },
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': `${site.url}/feed.xml`,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <Header />
        {children}
      </body>
    </html>
  )
}

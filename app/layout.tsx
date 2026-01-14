import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Join Our Webinar - Exclusive Invitation',
  description: 'Register now for our exclusive webinar and gain valuable insights',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}


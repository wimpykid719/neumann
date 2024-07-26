import { Metadata } from 'next'

export const metadata: Metadata = {
  referrer: 'origin-when-cross-origin',
}

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <main className='min-h-screen'>{children}</main>
}

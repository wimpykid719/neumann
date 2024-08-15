import { AccessTokenProvider } from '@/contexts/AccessTokenContext'
import { LoginHistoryProvider } from '@/contexts/LoginHistoryContext'
import { ModalProvider } from '@/contexts/ModalContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { UserProvider } from '@/contexts/UserContext'
import app from '@/text/app.json'
import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const LOCALHOST_URL = 'http://localhost'

export const metadata: Metadata = {
  title: `${app.title} | ${app.miniDescription}`,
  description: app.description,
  authors: { name: app.author, url: app.authorUrl },
  keywords: app.keywords,
  referrer: 'origin-when-cross-origin',
  metadataBase: new URL(process.env.BASE_URL ?? LOCALHOST_URL),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ja'>
      <body className={inter.className}>
        <AccessTokenProvider>
          <LoginHistoryProvider>
            <UserProvider>
              <ToastProvider>
                <ModalProvider>{children}</ModalProvider>
              </ToastProvider>
            </UserProvider>
          </LoginHistoryProvider>
        </AccessTokenProvider>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID ?? ''} />
    </html>
  )
}

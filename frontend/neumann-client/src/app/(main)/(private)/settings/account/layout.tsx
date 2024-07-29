import app from '@/text/app.json'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: app.account,
}

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

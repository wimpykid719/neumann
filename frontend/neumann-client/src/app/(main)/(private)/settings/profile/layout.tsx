import app from '@/text/app.json'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: app.profile,
}

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

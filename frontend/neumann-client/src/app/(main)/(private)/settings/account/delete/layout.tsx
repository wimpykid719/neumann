import app from '@/text/app.json'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: `${app.accountDelete} | ${app.title}`,
}

export default async function AccountDeleteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

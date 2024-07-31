import Tabs from '@/components/common/Tabs'
import { policiesNavigation } from '@/components/common/Tabs/Navigations'
import app from '@/text/app.json'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: `%s | ${app.title}`,
    default: app.title,
  },
}

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='space-y-8'>
      <div className='text-xl font-bold h-24 flex items-center'>方針</div>
      <Tabs navigation={policiesNavigation} />
      {children}
    </div>
  )
}

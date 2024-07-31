import Header from '@/components/common/Header'
import Tabs from '@/components/common/Tabs'
import { settingsNavigation } from '@/components/common/Tabs/Navigations'
import app from '@/text/app.json'
import { Metadata } from 'next'
import { Suspense } from 'react'

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
    <section className='m-auto w-full max-w-5xl space-y-8 md:px-14 px-8 pt-8'>
      <Suspense>
        <Header />
      </Suspense>
      <div className='space-y-8'>
        <div className='text-xl font-bold h-24 flex items-center'>設定</div>
        <Tabs navigation={settingsNavigation} />
        {children}
      </div>
    </section>
  )
}

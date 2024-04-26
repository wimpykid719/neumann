import Header from '@/components/common/Header'
import Tabs from '@/components/common/Tabs'
import { settingsNavigation } from '@/components/common/Tabs/Navigations'

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <section>
      <Header />
      <div className='space-y-8'>
        <div className='text-xl font-bold h-24 flex items-center'>設定</div>
        <Tabs navigation={settingsNavigation} />
        {children}
      </div>
    </section>
  )
}
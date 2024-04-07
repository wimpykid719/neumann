import Tabs from '@/components/common/Tabs'
import { settingsNavigation } from '@/components/common/Tabs/Navigations'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <section className=''>
      <div className='text-xl font-bold h-32 flex items-center'>設定</div>
      <Tabs navigation={settingsNavigation} />
      {children}
    </section>
  )
}

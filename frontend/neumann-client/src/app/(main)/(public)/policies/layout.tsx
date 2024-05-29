import Tabs from '@/components/common/Tabs'
import { policiesNavigation } from '@/components/common/Tabs/Navigations'

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

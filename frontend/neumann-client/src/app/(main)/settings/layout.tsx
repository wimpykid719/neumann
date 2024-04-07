import Tabs from '@/components/common/Tabs'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settingsNavigation = [
    { name: 'アカウント', key: 'account', href: '/settings/account' },
    { name: 'プロフィール', key: 'profile', href: '/settings/profile' },
  ]

  return (
    <section className=''>
      <div className='text-xl font-bold h-32 flex items-center'>設定</div>
      <Tabs navigation={settingsNavigation} />
      {children}
    </section>
  )
}

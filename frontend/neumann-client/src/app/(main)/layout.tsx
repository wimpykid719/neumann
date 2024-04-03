import Header from '@/components/common/Header'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='m-auto px-14 lg:max-w-5xl space-y-8 py-8'>
      <Header />
      {children}
    </main>
  )
}

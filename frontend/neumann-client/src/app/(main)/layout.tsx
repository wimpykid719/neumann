import Header from '@/components/common/Header'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='m-auto xl:max-w-5xl'>
      <Header />
      {children}
    </main>
  )
}

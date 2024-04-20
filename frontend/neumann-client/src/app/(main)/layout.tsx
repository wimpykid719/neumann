import Header from '@/components/common/Header'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='min-h-screen m-auto md:px-14 px-8 max-w-5xl space-y-8 py-8'>
      <Header />
      {children}
    </main>
  )
}

import Footer from '@/components/common/Footer'
import Header from '@/components/common/Header'
import { Suspense } from 'react'

export default function FooterLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <section className='space-y-8'>
      <div className='m-auto w-full max-w-5xl space-y-8 md:px-14 px-8 pt-8'>
        <Suspense>
          <Header />
        </Suspense>
        {children}
      </div>
      <Footer />
    </section>
  )
}

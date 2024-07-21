import Header from '@/components/common/Header'
import RightArrowIcon from '@/components/common/icon/RightArrowIcon'
import Link from 'next/link'
import { Suspense } from 'react'

export default function NotFound() {
  const ICON_SIZE = 16

  return (
    <main className='m-auto w-full max-w-5xl md:px-14 px-8 pt-8'>
      <Suspense>
        <Header />
      </Suspense>

      <div className='flex lg:flex-row flex-col justify-center lg:space-x-16 lg:space-y-0 lg:mt-72 space-y-10 mt-40 lg:text-left text-center'>
        <h2 className='text-6xl'>{'(｡>﹏<｡)'}</h2>
        <div>
          <p className='text-7xl font-bold mb-2'>404</p>
          <p className='text-xl font-medium mb-6'>存在しないページです</p>
          <Link href='/' className='text-sm font-bold text-gray-500 space-x-1 hover:opacity-70'>
            <span>トップページに戻る</span>
            <span className='align-middle inline-block'>
              <RightArrowIcon width={ICON_SIZE} height={ICON_SIZE} />
            </span>
          </Link>
        </div>
      </div>
    </main>
  )
}

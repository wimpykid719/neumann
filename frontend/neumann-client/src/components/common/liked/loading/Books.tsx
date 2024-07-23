import { range } from '@/utils/range'

const DEFAULT_BOOKS_PAGE_SIZE = [1, 12]

export default function LoadingBooks() {
  return (
    <div className='lg:max-w-5xl md:max-w-[656px] sm:max-w-[424px] mx-auto'>
      <ul className='sm:flex sm:flex-wrap lg:gap-12 sm:gap-10'>
        {range(DEFAULT_BOOKS_PAGE_SIZE[0], DEFAULT_BOOKS_PAGE_SIZE[1]).map(index => (
          <li key={index.toString()} className='sm:mb-0 mb-8 flex justify-center items-center'>
            <div className='w-48 h-72 sub-bg-color rounded-lg p-2 item-bg-color animate-pulse'></div>
          </li>
        ))}
      </ul>
    </div>
  )
}

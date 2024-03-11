export default function InputLoading() {
  const loadingClass = 'mb-4 rounded dummy-bg-color animate-pulse dark:border dark:border-gray-600'

  return (
    <section className='flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0'>
      <div className='w-full md:mt-0 lg:max-w-xl sm:max-w-md xl:p-0'>
        <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
          <div className='space-y-4 md:space-y-6'>
            <div>
              <div className={`w-16 h-5 ${loadingClass}`}></div>
              <div className={`w-full h-11 ${loadingClass}`}></div>
              <div className={`w-1/2 h-5 ${loadingClass}`}></div>
            </div>
            <div>
              <div className={`w-16 h-5 ${loadingClass}`}></div>
              <div className={`w-full h-24 ${loadingClass}`}></div>
            </div>
            <div>
              <div className='lg:flex justify-between'>
                <div className='w-60'>
                  <div className={`w-24 h-5 ${loadingClass}`}></div>
                  <div className={`w-full h-11 ${loadingClass}`}></div>
                </div>
                <div className='w-60'>
                  <div className={`w-24 h-5 ${loadingClass}`}></div>
                  <div className={`w-full h-11 ${loadingClass}`}></div>
                </div>
              </div>
            </div>
            <div>
              <div className='lg:flex justify-between'>
                <div className='w-60'>
                  <div className={`w-24 h-5 ${loadingClass}`}></div>
                  <div className={`w-full h-11 ${loadingClass}`}></div>
                </div>
                <div className='w-60'>
                  <div className={`w-24 h-5 ${loadingClass}`}></div>
                  <div className={`w-full h-11 ${loadingClass}`}></div>
                </div>
              </div>
            </div>
            <div>
              <div className='lg:flex justify-between'>
                <div className='w-60'>
                  <div className={`w-24 h-5 ${loadingClass}`}></div>
                  <div className={`w-full h-11 ${loadingClass}`}></div>
                </div>
                <div className='w-60'>
                  <div className={`w-24 h-5 ${loadingClass}`}></div>
                  <div className={`w-full h-11 ${loadingClass}`}></div>
                </div>
              </div>
            </div>
            <div>
              <div className={`w-16 h-5 ${loadingClass}`}></div>
              <div className={`w-full h-11 ${loadingClass}`}></div>
            </div>
            <div>
              <div className={`w-2/3 h-5 ${loadingClass}`}></div>
            </div>
          </div>
          <div className='lg:flex justify-center'>
            <button
              type='button'
              className='
                    w-60 bg-secondary
                    hover:opacity-70
                    focus:ring-4
                    focus:outline-none
                    focus:ring-secondary
                    focus:ring-opacity-70
                    font-medium rounded-lg
                    mt-8
                    text-sm px-5 py-2.5
                    text-center sub-text-color
                  '
            >
              更新する
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

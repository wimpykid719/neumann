export default function InputLoading() {
  const loadingClass = 'mb-2 rounded item-bg-color animate-pulse dark:border dark:border-gray-600'

  return (
    <section className='flex flex-col items-center justify-center px-6 pb-8 mx-auto lg:py-0'>
      <div className='w-full md:mt-0 lg:max-w-xl sm:max-w-md xl:p-0'>
        <div className='lg:p-6 space-y-8 md:space-y-12 sm:p-8'>
          <div>
            <div className={`w-16 h-5 ${loadingClass}`}></div>
            <div className={`w-20 h-5 ${loadingClass}`}></div>
          </div>
          <div className='space-y-8 md:space-y-12'>
            <div>
              <div className={`w-16 h-5 ${loadingClass}`}></div>
              <div className={`w-full h-11 ${loadingClass}`}></div>
            </div>
            <div>
              <div className={`w-16 h-5 ${loadingClass}`}></div>
              <div className='lg:flex justify-between'>
                <div className='lg:w-60'>
                  <div className={`w-24 h-5 ${loadingClass}`}></div>
                  <div className={`w-full h-11 ${loadingClass}`}></div>
                </div>
                <div className='lg:w-60'>
                  <div className={`w-24 h-5 ${loadingClass}`}></div>
                  <div className={`w-full h-11 ${loadingClass}`}></div>
                </div>
              </div>
            </div>
            <div>
              <div className={`w-16 h-5 ${loadingClass}`}></div>
              <div className={`w-20 h-5 ${loadingClass}`}></div>
            </div>
          </div>
          <div className='lg:flex justify-center'>
            <button
              type='button'
              className='
                    w-60 bg-secondary
                    hover:bg-opacity-70
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

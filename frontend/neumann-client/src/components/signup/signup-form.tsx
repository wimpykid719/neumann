'use client'

import { FetchError } from '@/lib/errors'
import { SignupData, postUserCreate } from '@/lib/wrapped-featch/signup-request'
import { SignupValidation, SignupValidationSchema } from '@/lib/zod-schema/signup-validation'
import app from '@/text/app.json'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useForm } from 'react-hook-form'

const createUser = async (data: SignupData) => {
  const res = await postUserCreate(data)
  if (res instanceof FetchError) {
    console.log(res.message)
  } else {
    console.log(res.token)
  }
}

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValidation>({
    mode: 'onChange',
    shouldUnregister: false,
    resolver: zodResolver(SignupValidationSchema),
  })

  return (
    <section className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
      <a href='#' className='flex items-center mb-6 text-2xl font-semibold'>
        <img className='w-8 h-8 mr-2' src='https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg' alt='logo' />
        {app.title}
      </a>
      <div className='w-full rounded-lg shadow dark:border dark:border-gray-600 md:mt-0 sm:max-w-md xl:p-0 sub-bg-color'>
        <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
          <h1 className='text-xl font-bold leading-tight tracking-tight md:text-2xl'>新規会員登録</h1>
          <button
            type='button'
            onClick={() => {}}
            className='w-full border font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:opacity-70 sub-bg-color main-border-color'
          >
            <Image
              src='/google-color.svg'
              alt='Google Logo'
              className='w-5 h-5 mr-2 inline'
              width={16}
              height={16}
              priority
            />
            Sing Up With Google
          </button>
          <div className='border border-x-0 border-t-0 relative main-border-color'>
            <span className='px-3 absolute right-2/4 translate-x-1/2 -translate-y-1/2 sub-bg-color'>or</span>
          </div>
          <form onSubmit={handleSubmit(createUser)}>
            <div className='space-y-4 md:space-y-6'>
              <div>
                <label htmlFor='name' className='block mb-2 text-sm font-medium'>
                  ユーザ名
                </label>
                <input
                  {...register('name')}
                  type='name'
                  name='name'
                  id='name'
                  className={`
                      border
                      ${
                        errors.name?.message
                          ? 'focus:ring-primary focus:border-primary border-primary '
                          : 'focus:ring-secondary focus:border-secondary border-gray-900 dark:border-gray-400'
                      }
                      sm:text-sm
                      rounded-lg
                      focus:ring-1
                      focus:outline-none
                      block
                      w-full p-2.5
                    placeholder-gray-400
                    bg-gray-50
                    dark:bg-gray-500
                    `}
                  placeholder='neumann'
                />
                {errors.name?.message && <p className='text-sm text-primary'>{errors.name?.message}</p>}
              </div>
              <div>
                <label htmlFor='email' className='block mb-2 text-sm font-medium'>
                  メールアドレス
                </label>
                <input
                  {...register('email')}
                  type='email'
                  name='email'
                  id='email'
                  className={`
                      border
                      ${
                        errors.email?.message
                          ? 'focus:ring-primary focus:border-primary border-primary '
                          : 'focus:ring-secondary focus:border-secondary border-gray-900 dark:border-gray-400'
                      }
                      sm:text-sm
                      rounded-lg
                      focus:ring-1
                      focus:outline-none
                      block
                      w-full p-2.5
                    placeholder-gray-400
                    bg-gray-50
                    dark:bg-gray-500
                    `}
                  placeholder='name@company.com'
                />
                {errors.email?.message && <p className='text-sm text-primary'>{errors.email?.message}</p>}
              </div>
              <div>
                <label htmlFor='password' className='block mb-2 text-sm font-medium'>
                  パスワード
                </label>
                <input
                  {...register('password')}
                  type='password'
                  name='password'
                  id='password'
                  placeholder='••••••••'
                  className={`
                    border
                    ${
                      errors.password?.message
                        ? 'focus:ring-primary focus:border-primary border-primary '
                        : 'focus:ring-secondary focus:border-secondary border-gray-900 dark:border-gray-400'
                    }
                    sm:text-sm
                    rounded-lg
                    focus:ring-1
                    focus:outline-none
                    block
                    w-full p-2.5
                  placeholder-gray-400
                  bg-gray-50
                  dark:bg-gray-500
                    `}
                />
                {errors.password?.message && <p className='text-sm text-primary'>{errors.password?.message}</p>}
              </div>
            </div>
            <button
              type='submit'
              className='
                  w-full bg-secondary
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
              登録
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

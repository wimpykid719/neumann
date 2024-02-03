'use client'

import { postAuthToken } from '@/lib/wrapped-featch/login-request'
import { LoginValidation, loginValidationSchema } from '@/lib/zod-schema/login-validation'
import app from '@/text/app.json'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValidation>({
    mode: 'onChange',
    shouldUnregister: false,
    resolver: zodResolver(loginValidationSchema),
  })

  return (
    <section className='bg-gray-50 dark:bg-gray-900'>
      <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
        <a href='#' className='flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white'>
          <img
            className='w-8 h-8 mr-2'
            src='https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg'
            alt='logo'
          />
          {app.title}
        </a>
        <div className='w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'>
          <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
            <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>
              ログイン
            </h1>
            <form className='space-y-4 md:space-y-6' onSubmit={handleSubmit(postAuthToken)}>
              <div>
                <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  メールアドレス
                </label>
                <input
                  {...register('email')}
                  type='email'
                  name='email'
                  id='email'
                  className={`
                    bg-gray-50 border
                    ${
                      errors.email?.message
                        ? 'border-primary-500 focus:ring-primary-500 focus:border-primary-500'
                        : 'border-gray-900 focus:ring-secondary-600 focus:border-secondary-600'
                    }
                    text-gray-900
                    sm:text-sm
                    rounded-lg
                    focus:ring-1
                    focus:outline-none
                    block
                    w-full p-2.5
                    dark:bg-gray-700
                    dark:border-gray-600
                    dark:placeholder-gray-400
                    dark:text-white
                    dark:focus:ring-blue-500
                    dark:focus:border-blue-500
                  `}
                  placeholder='name@company.com'
                />
                {errors.email?.message && <p className='text-sm text-primary-500'>{errors.email?.message}</p>}
              </div>
              <div>
                <label htmlFor='password' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                  パスワード
                </label>
                <input
                  {...register('password')}
                  type='password'
                  name='password'
                  id='password'
                  placeholder='••••••••'
                  className={`
                    bg-gray-50 border
                    ${
                      errors.password?.message
                        ? 'border-primary-500 focus:ring-primary-500 focus:border-primary-500'
                        : 'border-gray-900 focus:ring-secondary-600 focus:border-secondary-600'
                    }
                    text-gray-900
                    sm:text-sm
                    rounded-lg
                    focus:ring-1
                    focus:outline-none
                    block
                    w-full p-2.5
                    dark:bg-gray-700
                    dark:border-gray-600
                    dark:placeholder-gray-400
                    dark:text-white
                    dark:focus:ring-blue-500
                    dark:focus:border-blue-500
                  `}
                />
                {errors.password?.message && <p className='text-sm text-primary-500'>{errors.password?.message}</p>}
              </div>
              <div className='flex items-center justify-between'>
                <a href='#' className='text-sm font-medium text-primary-600 hover:underline dark:text-primary-500'>
                  パスワードを忘れた
                </a>
              </div>
              <button
                type='submit'
                className='w-full text-white bg-secondary-500 hover:bg-secondary-600 focus:ring-4 focus:outline-none focus:ring-secondary-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
              >
                ログイン
              </button>
              <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
                アカウントを持っていない?{' '}
                <a href='#' className='font-medium text-primary-600 hover:underline dark:text-primary-500'>
                  アカウント作成
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

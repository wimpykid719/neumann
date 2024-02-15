'use client'

import GoogleIcon from '@/components/common/icon/GoogleIcon'
import { useAccessToken } from '@/contexts/AccessTokenContext'
import { useToast } from '@/contexts/ToastContext'
import { FetchError } from '@/lib/errors'
import { LoginData, postAuthToken } from '@/lib/wrappedFeatch/loginRequest'
import { LoginValidation, loginValidationSchema } from '@/lib/zodSchema/loginValidation'
import app from '@/text/app.json'
import { toastStatus } from '@/utils/toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

export default function LoginForm() {
  const { showToast } = useToast()
  const { setAccessToken } = useAccessToken()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValidation>({
    mode: 'onChange',
    shouldUnregister: false,
    resolver: zodResolver(loginValidationSchema),
  })

  const loginUser = async (data: LoginData) => {
    const res = await postAuthToken(data)

    if (res instanceof FetchError) {
      showToast(res.message, toastStatus.error)
    } else {
      setAccessToken(res.token)
      router.push('/')
    }
  }

  return (
    <section className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
      <a href='#' className='flex items-center mb-6 text-2xl font-semibold'>
        <img className='w-8 h-8 mr-2' src='https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg' alt='logo' />
        {app.title}
      </a>
      <div className='w-full rounded-lg shadow dark:border dark:border-gray-600 md:mt-0 sm:max-w-md xl:p-0 sub-bg-color'>
        <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
          <h1 className='text-xl font-bold leading-tight tracking-tight md:text-2xl'>ログイン</h1>
          <button
            type='button'
            onClick={() => {}}
            className='w-full border font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:opacity-70 sub-bg-color main-border-color'
          >
            <GoogleIcon className='w-5 h-5 mr-2 inline' />
            Login With Google
          </button>
          <div className='border border-x-0 border-t-0 relative main-border-color'>
            <span className='px-3 absolute right-2/4 translate-x-1/2 -translate-y-1/2 sub-bg-color'>or</span>
          </div>
          <form className='space-y-4 md:space-y-6' onSubmit={handleSubmit(loginUser)}>
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
            <div className='flex items-center justify-between text-gray-500'>
              <a href='#' className='text-sm font-medium hover:underline'>
                パスワードを忘れた
              </a>
            </div>
            <button
              type='submit'
              className='w-full bg-secondary hover:opacity-70 focus:ring-4 focus:outline-none focus:ring-secondary focus:ring-opacity-70 font-medium rounded-lg text-sm px-5 py-2.5 text-center sub-text-color'
            >
              ログイン
            </button>
            <p className='text-sm font-light text-gray-500'>
              アカウントを持っていない?{' '}
              <a href='#' className='font-medium text-secondary hover:underline'>
                アカウント作成
              </a>
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}

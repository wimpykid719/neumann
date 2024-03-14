import { useToast } from '@/contexts/ToastContext'
import { useSilentRefresh } from '@/hooks/useSilentRefresh'
import { FetchError } from '@/lib/errors'
import { patchUserProfile } from '@/lib/wrappedFeatch/profileRequest'
import { ProfileUpdateValidation, ProfileUpdateValidationSchema } from '@/lib/zodSchema/profileUpdateValidation'
import toastText from '@/text/toast.json'
import toast from '@/text/toast.json'
import { User } from '@/types/user'
import { toastStatus } from '@/utils/toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

type Props = {
  user: User
  setUser: (user: User | undefined) => void
}

export default function ProfileForm({ user, setUser }: Props) {
  const { showToast } = useToast()
  const { accessToken, execSilentRefresh } = useSilentRefresh(showToast)

  const requestUpdate = async (data: ProfileUpdateValidation) => {
    const token = (await execSilentRefresh()) || accessToken
    if (!token) return showToast(toast.no_access_token, toastStatus.error)

    const res = await patchUserProfile(data, token)
    if (res instanceof FetchError) {
      showToast(res.message, toastStatus.error)
    } else {
      if (res) {
        setUser({
          ...user,
          profile: { ...res },
        })
      }
      showToast(toastText.account_updated, toastStatus.success)
    }
  }

  const updateProfile = async (data: ProfileUpdateValidation) => {
    await requestUpdate(data)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileUpdateValidation>({
    mode: 'onChange',
    shouldUnregister: false,
    resolver: zodResolver(ProfileUpdateValidationSchema),
    defaultValues: {
      name: user.profile.name,
      bio: user.profile.bio,
      xTwitter: user.profile.x_twitter,
      instagram: user.profile.instagram,
      facebook: user.profile.facebook,
      linkedin: user.profile.linkedin,
      tiktok: user.profile.tiktok,
      youtube: user.profile.youtube,
      website: user.profile.website,
    },
  })

  return (
    <section className='flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0'>
      <div className='w-full md:mt-0 lg:max-w-xl sm:max-w-md xl:p-0'>
        <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
          <form onSubmit={handleSubmit(updateProfile)}>
            <div className='space-y-4 md:space-y-6'>
              <div>
                <label htmlFor='name' className='block mb-2 text-sm font-medium'>
                  表示名
                </label>
                <input
                  {...register('name')}
                  type='text'
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
                  placeholder='びず らんく'
                />
                <span className='text-sm text-gray-500'>※未設定の場合、ユーザ名が表示名となります。</span>
                {errors.name?.message && <p className='text-sm text-primary'>{errors.name?.message}</p>}
              </div>
              <div>
                <label htmlFor='bio' className='block mb-2 text-sm font-medium'>
                  自己紹介
                </label>
                <textarea
                  {...register('bio')}
                  name='bio'
                  id='bio'
                  className={`
                        resize-none
                        h-24
                        border
                        ${
                          errors.bio?.message
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
                  placeholder='IT企業でソフトウェアエンジニアをしていました。今は個人開発でBizRankを開発しています。現在転職活動中です。よろしくお願いいたします。'
                />
                {errors.bio?.message && <p className='text-sm text-primary'>{errors.bio?.message}</p>}
              </div>
              <div>
                <div className='lg:flex justify-between'>
                  <div className='w-60'>
                    <label htmlFor='xTwitter' className='block mb-2 text-sm font-medium'>
                      X（Twitter） ユーザ名
                    </label>
                    <input
                      {...register('xTwitter')}
                      type='text'
                      name='xTwitter'
                      id='xTwitter'
                      className={`
                        border
                        ${
                          errors.xTwitter?.message
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
                    {errors.xTwitter?.message && <p className='text-sm text-primary'>{errors.xTwitter?.message}</p>}
                  </div>
                  <div className='w-60'>
                    <label htmlFor='instagram' className='block mb-2 text-sm font-medium'>
                      instagram ユーザ名
                    </label>
                    <input
                      {...register('instagram')}
                      type='text'
                      name='instagram'
                      id='instagram'
                      className={`
                          border
                          ${
                            errors.instagram?.message
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
                    {errors.instagram?.message && <p className='text-sm text-primary'>{errors.instagram?.message}</p>}
                  </div>
                </div>
              </div>
              <div>
                <div className='lg:flex justify-between'>
                  <div className='w-60'>
                    <label htmlFor='facebook' className='block mb-2 text-sm font-medium'>
                      Facebook ユーザ名
                    </label>
                    <input
                      {...register('facebook')}
                      type='text'
                      name='facebook'
                      id='facebook'
                      className={`
                        border
                        ${
                          errors.facebook?.message
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
                    {errors.facebook?.message && <p className='text-sm text-primary'>{errors.facebook?.message}</p>}
                  </div>
                  <div className='w-60'>
                    <label htmlFor='linkedin' className='block mb-2 text-sm font-medium'>
                      LinkedIn ユーザ名
                    </label>
                    <input
                      {...register('linkedin')}
                      type='text'
                      name='linkedin'
                      id='linkedin'
                      className={`
                          border
                          ${
                            errors.linkedin?.message
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
                    {errors.linkedin?.message && <p className='text-sm text-primary'>{errors.linkedin?.message}</p>}
                  </div>
                </div>
              </div>
              <div>
                <div className='lg:flex justify-between'>
                  <div className='w-60'>
                    <label htmlFor='tiktok' className='block mb-2 text-sm font-medium'>
                      TikTok ユーザ名
                    </label>
                    <input
                      {...register('tiktok')}
                      type='text'
                      name='tiktok'
                      id='tiktok'
                      className={`
                        border
                        ${
                          errors.tiktok?.message
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
                    {errors.tiktok?.message && <p className='text-sm text-primary'>{errors.tiktok?.message}</p>}
                  </div>
                  <div className='w-60'>
                    <label htmlFor='youtube' className='block mb-2 text-sm font-medium'>
                      YouTube ユーザ名
                    </label>
                    <input
                      {...register('youtube')}
                      type='text'
                      name='youtube'
                      id='youtube'
                      className={`
                          border
                          ${
                            errors.youtube?.message
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
                    {errors.youtube?.message && <p className='text-sm text-primary'>{errors.youtube?.message}</p>}
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor='website' className='block mb-2 text-sm font-medium'>
                  あなたのウェブサイト
                </label>
                <input
                  {...register('website')}
                  type='text'
                  name='website'
                  id='website'
                  className={`
                        border
                        ${
                          errors.website?.message
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
                  placeholder='https://bizrank.com'
                />
                {errors.website?.message && <p className='text-sm text-primary'>{errors.website?.message}</p>}
              </div>
              <div>
                <p className='text-sm text-gray-500'>プロフィールにこれらの情報が表示されます。</p>
              </div>
            </div>
            <div className='lg:flex justify-center'>
              <button
                type='submit'
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
          </form>
        </div>
      </div>
    </section>
  )
}

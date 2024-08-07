import RightArrowIcon from '@/components/common/icon/RightArrowIcon'
import { useModal } from '@/contexts/ModalContext'
import { useToast } from '@/contexts/ToastContext'
import { useSilentRefresh } from '@/hooks/useSilentRefresh'
import { FetchError } from '@/lib/errors'
import { AccountUpdateData, patchUserAccount } from '@/lib/wrappedFeatch/requests/account'
import { AccountUpdateValidation, AccountUpdateValidationSchema } from '@/lib/zodSchema/accountUpdateValidation'
import toastText from '@/text/toast.json'
import toast from '@/text/toast.json'
import { User } from '@/types/user'
import { toastStatus } from '@/utils/toast'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import OldPasswordConfirmModal from '../OldPasswordConfirmModal'

type Props = {
  user: User
  setUser: (user: User | undefined) => void
}

export default function AccountForm({ user, setUser }: Props) {
  const { showToast } = useToast()
  const { accessToken, execSilentRefresh } = useSilentRefresh(showToast)
  const { showModal, closeModal } = useModal()

  const requestUpdate = async (data: AccountUpdateData) => {
    const token = (await execSilentRefresh()) || accessToken
    if (!token) return showToast(toast.no_access_token, toastStatus.error)

    const res = await patchUserAccount(data, token)
    if (res instanceof FetchError) {
      showToast(res.message, toastStatus.error)
    } else {
      if (res.email) {
        setUser({ ...user, email: res.email })
      }
      showToast(toastText.account_updated, toastStatus.success)
    }
  }

  const updateAccount = async (data: AccountUpdateValidation) => {
    if (data.newPassword) {
      showModal(
        <OldPasswordConfirmModal
          newEmail={data.newEmail}
          newPassword={data.newPassword}
          showToast={showToast}
          closeModal={closeModal}
          user={user}
          setUser={setUser}
        />,
      )
    } else {
      const updateDataNoPassword = {
        newEmail: data.newEmail,
        newPassword: '',
        oldPassword: '',
      }
      await requestUpdate(updateDataNoPassword)
    }
  }

  const cannotPasswordChange = (kind: User['provider']['kind']) => kind === 'google'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountUpdateValidation>({
    mode: 'onChange',
    shouldUnregister: false,
    resolver: zodResolver(AccountUpdateValidationSchema),
    defaultValues: { newEmail: user.email },
  })

  return (
    <section className='flex flex-col items-center justify-center px-6 pb-8 mx-auto'>
      <div className='w-full md:mt-0 lg:max-w-xl sm:max-w-md'>
        <div className='lg:p-6 space-y-8 md:space-y-12 sm:p-8'>
          <div>
            <span className='block mb-2 text-sm font-medium'>ユーザ名</span>
            <p>{user.name}</p>
          </div>
          <form onSubmit={handleSubmit(updateAccount)}>
            <div className='space-y-8 md:space-y-12'>
              <div>
                <label htmlFor='newEmail' className='block mb-2 text-sm font-medium'>
                  メールアドレス
                </label>
                <input
                  {...register('newEmail')}
                  type='email'
                  name='newEmail'
                  id='newEmail'
                  className={`
                        border
                        ${
                          errors.newEmail?.message
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
                {errors.newEmail?.message && <p className='text-sm text-primary'>{errors.newEmail?.message}</p>}
              </div>
              <div>
                <span className='block text-sm font-medium'>パスワード</span>
                <div className='lg:flex justify-between'>
                  <div className='lg:w-60'>
                    <label htmlFor='newPassword' className='block my-2 text-sm text-gray-500'>
                      新しいパスワード
                    </label>
                    <input
                      {...register('newPassword', { disabled: cannotPasswordChange(user.provider.kind) })}
                      type='password'
                      name='newPassword'
                      id='newPassword'
                      placeholder='••••••••'
                      className={`
                        border
                        ${
                          errors.newPassword?.message
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
                    {errors.newPassword?.message && (
                      <p className='text-sm text-primary'>{errors.newPassword?.message}</p>
                    )}
                  </div>
                  <div className='lg:w-60'>
                    <label htmlFor='newPasswordConfirm' className='block my-2 text-sm text-gray-500'>
                      再入力してください
                    </label>
                    <input
                      {...register('newPasswordConfirm', {
                        disabled: cannotPasswordChange(user.provider.kind),
                      })}
                      type='password'
                      name='newPasswordConfirm'
                      id='newPasswordConfirm'
                      className={`
                          border
                          ${
                            errors.newPasswordConfirm?.message
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
                      placeholder='••••••••'
                    />
                    {errors.newPasswordConfirm?.message && (
                      <p className='text-sm text-primary'>{errors.newPasswordConfirm?.message}</p>
                    )}
                  </div>
                </div>
                {cannotPasswordChange(user.provider.kind) && (
                  <p className='text-sm text-primary mt-2'>{`${user.provider.kind}認証ユーザはパスワード変更不可です。`}</p>
                )}
              </div>
              <div>
                <span className='block text-sm font-medium mb-2'>アカウントの削除</span>
                <Link href={'account/delete'} className='flex items-center text-xs text-gray-500 hover:opacity-70'>
                  <span className='border-b border-gray-500'>アカウントを削除する</span>
                  <span>
                    <RightArrowIcon width={13} height={13} />
                  </span>
                </Link>
              </div>
            </div>
            <div className='lg:flex justify-center'>
              <button
                type='submit'
                className='
                    lg:w-60 w-full bg-secondary
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

import { useAccessToken } from '@/contexts/AccessTokenContext'
import { FetchError } from '@/lib/errors'
import { AccountUpdateData, patchUserAccount } from '@/lib/wrappedFeatch/accountRequest'
import { silentRefresh } from '@/lib/wrappedFeatch/silentRefresh'
import { OldPasswordValidation, OldPasswordValidationSchema } from '@/lib/zodSchema/oldPasswordConfirmValidation'
import toastText from '@/text/toast.json'
import toast from '@/text/toast.json'
import { ToastType } from '@/types/toast'
import { User } from '@/types/user'
import { toastStatus } from '@/utils/toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

type OldPasswordConfirmModalProps = {
  newEmail: string
  newPassword: string
  showToast: (message: string, type: ToastType) => void
  closeModal: () => void
  user: User
  setUser: (user: User | undefined) => void
}

export default function OldPasswordConfirmModal({
  newEmail,
  newPassword,
  showToast,
  closeModal,
  user,
  setUser,
}: OldPasswordConfirmModalProps) {
  const { accessToken, setAccessToken } = useAccessToken()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OldPasswordValidation>({
    mode: 'onChange',
    shouldUnregister: false,
    resolver: zodResolver(OldPasswordValidationSchema),
  })

  const requestUpdate = async (data: AccountUpdateData) => {
    const resSilentRefresh = await silentRefresh(accessToken)
    if (resSilentRefresh instanceof FetchError) {
      closeModal()
      showToast(resSilentRefresh.message, toastStatus.error)
    } else {
      const token = resSilentRefresh?.token || accessToken
      if (!token) {
        closeModal()
        showToast(toast.no_access_token, toastStatus.error)
        return
      }
      setAccessToken(token)

      const res = await patchUserAccount(data, token)
      closeModal()
      if (res instanceof FetchError) {
        showToast(res.message, toastStatus.error)
      } else {
        if (res.email) {
          setUser({ ...user, email: res.email })
        }
        showToast(toastText.account_updated, toastStatus.success)
      }
    }
  }

  const updatePassword = (data: OldPasswordValidation) => {
    const updateData = {
      newEmail,
      newPassword,
      oldPassword: data.oldPassword,
    }

    requestUpdate(updateData)
  }

  return (
    <div className='w-full rounded-lg shadow dark:border dark:border-gray-600 md:mt-0 sm:max-w-md xl:p-0 sub-bg-color'>
      <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
        <div className='text-xl font-bold leading-tight tracking-tight text-center'>変更前のパスワード</div>
        <p className='text-sm text-gray-500'>パスワード変更があるため、変更前のパスワード入力をお願いします。</p>
        <form onSubmit={handleSubmit(updatePassword)}>
          <div className='space-y-4 md:space-y-6'>
            <div className='w-80 mx-auto'>
              <label htmlFor='oldPassword' className='block mb-2 text-sm font-medium'>
                変更前のパスワード
              </label>
              <input
                {...register('oldPassword')}
                type='password'
                name='oldPassword'
                id='oldPassword'
                placeholder='••••••••'
                className={`
                  border
                  ${
                    errors.oldPassword?.message
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
              {errors.oldPassword?.message && <p className='text-sm text-primary'>{errors.oldPassword?.message}</p>}
            </div>
          </div>
          <div className='w-56 mx-auto'>
            <button
              type='submit'
              className='
                w-full bg-secondary
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
  )
}

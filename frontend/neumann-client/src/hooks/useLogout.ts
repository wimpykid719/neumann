import { useAccessToken } from '@/contexts/AccessTokenContext'
import { useUser } from '@/contexts/UserContext'
import { deleteRefreshToken } from '@/lib/wrappedFeatch/request/logout'
import { updateLogoutStatus } from '@/utils/localStorage'
import { useRouter } from 'next/navigation'

export const useLogout = () => {
  const { setUser } = useUser()
  const { setAccessToken } = useAccessToken()
  const router = useRouter()

  const execLogout = async (redirectPath: string | undefined = undefined) => {
    const res = await deleteRefreshToken()
    if (Object.keys(res).length !== 0) return

    updateLogoutStatus()
    setUser(undefined)
    setAccessToken('')
    if (redirectPath) router.push(redirectPath)
  }

  return { execLogout }
}

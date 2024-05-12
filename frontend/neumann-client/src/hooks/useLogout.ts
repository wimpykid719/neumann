import { useAccessToken } from '@/contexts/AccessTokenContext'
import { useLoginHistory } from '@/contexts/LoginHistoryContext'
import { useUser } from '@/contexts/UserContext'
import { deleteRefreshToken } from '@/lib/wrappedFeatch/requests/logout'
import { deleteLogoutStatus } from '@/utils/localStorage'
import { useRouter } from 'next/navigation'

export const useLogout = () => {
  const { setUser } = useUser()
  const { setAccessToken } = useAccessToken()
  const router = useRouter()
  const { setLoginHistory } = useLoginHistory()

  const execLogout = async (redirectPath: string | undefined = undefined) => {
    const res = await deleteRefreshToken()
    if (Object.keys(res).length !== 0) return

    deleteLogoutStatus()
    setLoginHistory(null)
    setUser(undefined)
    setAccessToken('')
    if (redirectPath) router.push(redirectPath)
  }

  return { execLogout }
}

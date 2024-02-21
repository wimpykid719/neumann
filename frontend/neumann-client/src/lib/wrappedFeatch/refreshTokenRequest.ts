import * as fetch from '@/lib/wrappedFeatch'
import { AccessToken } from '@/types/accessToken'
import jwt from 'jsonwebtoken'

type Response = {
  token: string
}

const isValidExp = (exp: number) => {
  const currentTime = Math.floor(new Date().getTime() / 1000)
  return currentTime < exp
}

export async function refreshToken(accessToken: AccessToken) {
  const isLoggedInStr = localStorage.getItem('isLoggedIn')
  if (!isLoggedInStr || !Boolean(parseInt(isLoggedInStr, 10))) return

  // ローカルストレージに過去にログインした形跡がある場合、そしてアクセストークンがないサイレントリフレッシュ
  if (!accessToken)
    return await fetch.post<null, Response>('/api/v1/auth_token/refresh', null, {
      credentials: 'include',
    })

  const decoded = jwt.decode(accessToken)
  const exp = (typeof decoded === 'object' && decoded?.exp) || null

  // アクセストークンがある場合有効期限の確認
  if (!exp || isValidExp(exp)) return

  return await fetch.post<null, Response>('/api/v1/auth_token/refresh', null, {
    credentials: 'include',
  })
}

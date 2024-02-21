import { JwtPayload } from 'jsonwebtoken'

export type AccessToken = string | undefined
export type DecodedAccessToken = JwtPayload & {
  username: string
}

import { JwtPayload } from 'jsonwebtoken'

// サイレントリフレッシュが走らない時にundefinedが入る
export type AccessToken = string | undefined
export type DecodedAccessToken = JwtPayload & {
  username: string
}

import * as fetch from '@/lib/wrappedFeatch'

export type Oauth2Data = {
  state: string
  code: string
}

type ResponseToken = {
  token: string
}

type ResponseAuthorizationUrl = {
  authorization_url: string
}

type Oauth2Params = {
  oauth2: Oauth2Data
}

export async function postGoogleOuth2(oauth2Data: Oauth2Data) {
  const params = { oauth2: oauth2Data }
  return await fetch.post<Oauth2Params, ResponseToken>('/api/v1/google_oauth2', params, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
}

export async function googleOauth2AuthorizationUrl() {
  return await fetch.post<null, ResponseAuthorizationUrl>('/api/v1/google_oauth2/authorization_url', null)
}

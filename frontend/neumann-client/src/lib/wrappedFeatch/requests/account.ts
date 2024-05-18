import * as fetch from '@/lib/wrappedFeatch'

export type UpdatePasswordData = {
  newPassword: string
  oldPassword: string
}

export type UpdateEmailData = {
  newEmail: string
}

export type AccountUpdateData = UpdateEmailData & UpdatePasswordData

type Response = {
  email?: string
}

type UpdateParams = {
  user: AccountUpdateData
}

export async function patchUserAccount(updateData: AccountUpdateData, accessToken: string) {
  const params = { user: updateData }
  return await fetch.patch<UpdateParams, Response>('/api/v1/users', params, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  })
}

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
  account: AccountUpdateData
}

export async function patchUserAccount(updateData: AccountUpdateData) {
  const params = { account: updateData }
  return await fetch.put<UpdateParams, Response>('/api/v1/users', params, { credentials: 'include' })
}

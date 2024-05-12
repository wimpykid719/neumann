export const history = {
  loggedInBefore: '1',
} as const

export type LocalStorage = string | null

// useEffect内で使わないとサーバでエラーになる
export const isLoggedInBefore = (isLoggedInStr: string | null) => {
  return isLoggedInStr === history['loggedInBefore']
}

export const updateLogoutStatus = () => {
  localStorage.setItem('isLoggedIn', history['loggedInBefore'])
}

export const deleteLogoutStatus = () => {
  localStorage.removeItem('isLoggedIn')
}

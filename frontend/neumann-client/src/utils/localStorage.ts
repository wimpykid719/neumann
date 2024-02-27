// useEffect内で使わないとサーバでエラーになる
export const isLoggedInBefore = () => {
  const isLoggedInStr = localStorage.getItem('isLoggedIn')
  return isLoggedInStr === '1'
}

export const updateLogoutStatus = () => {
  localStorage.setItem('isLoggedIn', '0')
}

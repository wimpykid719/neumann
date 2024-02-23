export const isLoggedInBefore = () => {
  const isLoggedInStr = localStorage.getItem('isLoggedIn')
  return isLoggedInStr === '1'
}

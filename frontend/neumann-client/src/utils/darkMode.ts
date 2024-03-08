export const isDarkMode = () => {
  return matchMedia('(prefers-color-scheme: dark)').matches
}

export const textEllipsis = (title: string, words: number) => {
  if (title.length < words + 3) return title

  return title.slice(0, words - 3) + '...'
}

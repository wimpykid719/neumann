// https://dev.to/namirsab/comment/2050
export const range = (start: number, end: number) => {
  const length = end - start + 1
  return Array.from({ length }, (_, i) => start + i)
}

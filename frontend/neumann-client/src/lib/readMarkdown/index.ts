import fs from 'fs'
import matter from 'gray-matter'

export const readMarkdown = (filePath: string) => {
  const fileContents = fs.readFileSync(filePath, 'utf8')

  return matter(fileContents)
}

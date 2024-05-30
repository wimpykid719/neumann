import type { Highlighter } from 'shiki'
import { getHighlighter } from 'shiki'

let highlighter: Highlighter

export async function codeHighLight(code: string, lang: string): Promise<string> {
  highlighter ??= await getHighlighter({
    themes: ['github-light'],
    langs: [lang],
  })
  return highlighter.codeToHtml(code, { lang, theme: 'github-light' })
}

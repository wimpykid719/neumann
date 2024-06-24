import type { EmbeddedContents } from '@/lib/wrappedFeatch/requests/note'

const isAmazonURL = (url: string) => {
  const urlPattern = ['amzn.to', 'amzn.asia', 'amazon.co.jp']
  const amazonUrlPattern = new RegExp(`^https://.*(${urlPattern.join('|')})/`)

  return amazonUrlPattern.test(url)
}

export const getAmazonEmbeds = (embeds: EmbeddedContents[]) => {
  return embeds.filter(embed => isAmazonURL(embed.url))
}

export const getASIN = (url: string) => {
  const regex = /\/dp\/([A-Z0-9]{10})/
  return url.match(regex)?.[1]
}
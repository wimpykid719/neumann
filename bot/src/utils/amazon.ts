import type { EmbeddedContents } from '@/lib/wrappedFeatch/requests/note'

const isAmazonURL = (url: string) => {
  const urlPattern = ['amzn.to', 'amzn.asia', 'amazon.co.jp']
  const amazonUrlPattern = new RegExp(`^https://.*(${urlPattern.join('|')})/`)

  return amazonUrlPattern.test(url)
}

export const getAmazonEmbeds = (embeds: EmbeddedContents[]) => {
  const amazonUrls = embeds.filter(embed => isAmazonURL(embed.url))

  return [...new Set(amazonUrls.map(embed => embed.url))]
}

export const getASIN = (url: string) => {
  const regex = /\/(?:dp|gp\/product|exec\/obidos\/ASIN|asin)\/([A-Z0-9]{10})/
  return url.match(regex)?.[1]
}

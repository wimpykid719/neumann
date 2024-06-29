import { base64UrlSafeDecode, base64UrlSafeEncode } from '@/utils/base64url'

describe('base64UrlSafe', () => {
  it('エンコードした文字列にドット・スラッシュが含まれない', () => {
    const amazonProductUrl = 'https://www.amazon.co.jp/dp/B01IGW5MQ0'
    const amazonProductShortUrl = 'https://amzn.asia/d/d2BbOGS'
    const amazonProductAssociateUrl =
      'https://www.amazon.co.jp/dp/B01IGW5MQ0?&linkCode=ll1&tag=hero719-22&linkId=48d22aa67acd2d2c2086dc343570ac10&language=ja_JP&ref_=as_li_ss_tl'
    const amazonProductAssociateShortUrl = 'https://amzn.to/3VmL41T'

    const encoded = base64UrlSafeEncode(`
      ${amazonProductUrl}
      ${amazonProductShortUrl}
      ${amazonProductAssociateUrl}
      ${amazonProductAssociateShortUrl}
    `)
    expect(encoded).not.toContain('./')
  })

  it('デコードできる', () => {
    const amazonProductUrl = 'https://www.amazon.co.jp/dp/B01IGW5MQ0'
    const amazonProductShortUrl = 'https://amzn.asia/d/d2BbOGS'
    const amazonProductAssociateUrl =
      'https://www.amazon.co.jp/dp/B01IGW5MQ0?&linkCode=ll1&tag=hero719-22&linkId=48d22aa67acd2d2c2086dc343570ac10&language=ja_JP&ref_=as_li_ss_tl'
    const amazonProductAssociateShortUrl = 'https://amzn.to/3VmL41T'

    const encoded = base64UrlSafeEncode(`
      ${amazonProductUrl}
      ${amazonProductShortUrl}
      ${amazonProductAssociateUrl}
      ${amazonProductAssociateShortUrl}
    `)

    const decoded = base64UrlSafeDecode(encoded)
    expect(decoded).toBe(`
      ${amazonProductUrl}
      ${amazonProductShortUrl}
      ${amazonProductAssociateUrl}
      ${amazonProductAssociateShortUrl}
    `)
  })
})

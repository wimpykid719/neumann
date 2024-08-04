import { getAmazonEmbeds } from '@/utils/amazon'
import { cleanAmazonUrl, getASIN } from '@/utils/amazon'

describe('getAmazonEmbeds', () => {
  it('amazonのURL（amzn.to, amzn.asia, amazon.co.jp）を含む外部リンク一覧が返る', () => {
    const embeds = [
      { url: 'https://amzn.to/3Kya66P' },
      { url: 'https://amzn.to/3EOHqTs' },
      { url: 'https://stand.fm/episodes/608f4cd2abb2ac0947fb4ef9' },
      { url: 'https://note.com/kankipublishing/n/n9a09777a03f' },
      {
        url: 'https://www.amazon.co.jp/%25E4%25BA%25BA%25E9%2596%2593%25E3%2581%25AE%25E6%259D%25A1%25E4%25BB%25B6-%25E3%2581%25A1%25E3%2581%258F%25E3%2581%25BE%25E5%25AD%25A6%25E8%258A%25B8%25E6%2596%2587%25E5%25BA%25AB-%25E3%2583%258F%25E3%2583%25B3%25E3%2583%258A%25E3%2583%25BB%25E3%2582%25A2%25E3%2583%25AC%25E3%2583%25B3%25E3%2583%2588-ebook/dp/B09FP4VHKX?_encoding=UTF8&qid=1635982233&sr=8-2&linkCode=ll1&tag=welcomtoyamat-22&linkId=edf10afc6acbfcd9ba561fc9d429fa23&language=ja_JP&ref_=as_li_ss_tl',
      },
      { url: 'https://twitter.com/rmuroya/status/1070434840309260288' },
      { url: 'https://amzn.asia/d/ddr5WbB' },
      { url: 'https://www.amazon.co.jp/dp/4532318955?ref_=cm_sw_r_cp_ud_dp_6FJ9Y52T12HC0VT01BSN%5C%5C' },
    ]

    const amazonEmbeds = getAmazonEmbeds(embeds)

    expect(amazonEmbeds.length).toEqual(5)
  })

  it('重複するリンクは1つとしてで返される', () => {
    const embeds = [
      { url: 'https://amzn.to/3Kya66P' },
      { url: 'https://amzn.to/3Kya66P' },
      { url: 'https://amzn.to/3Kya66P' },
    ]

    const amazonEmbeds = getAmazonEmbeds(embeds)

    expect(amazonEmbeds.length).toEqual(1)
  })

  it('Amazonリンクが存在しない場合は空配列を返す', () => {
    const embeds = [
      { url: 'https://stand.fm/episodes/608f4cd2abb2ac0947fb4ef9' },
      { url: 'https://note.com/kankipublishing/n/n9a09777a03f' },
      { url: 'https://twitter.com/rmuroya/status/1070434840309260288' },
    ]

    const amazonEmbeds = getAmazonEmbeds(embeds)

    expect(amazonEmbeds.length).toEqual(0)
    expect(amazonEmbeds).toEqual([])
  })
})

describe('getASIN', () => {
  it('asinを含む（短縮URL出ない）場合、asinのみを返す', () => {
    const url =
      'https://www.amazon.co.jp/%E5%AE%9A%E5%B9%B4%E5%89%8D%E3%81%A8%E5%AE%9A%E5%B9%B4%E5%BE%8C%E3%81%AE%E5%83%8D%E3%81%8D%E6%96%B9%EF%BD%9E%E3%82%B5%E3%83%BC%E3%83%89%E3%82%A8%E3%82%A4%E3%82%B8%E3%82%92%E7%94%9F%E3%81%8D%E3%82%8B%E6%80%9D%E8%80%83%EF%BD%9E-%E5%85%89%E6%96%87%E7%A4%BE%E6%96%B0%E6%9B%B8-%E7%9F%B3%E5%B1%B1-%E6%81%92%E8%B2%B4-ebook/dp/B0C42W5716/ref=sr_1_1?crid=1WNAXSOUA99Q6&keywords=%E5%AE%9A%E5%B9%B4%E5%89%8D%E3%81%A8%E5%AE%9A%E5%B9%B4%E5%BE%8C%E3%81%AE%E5%83%8D%E3%81%8D%E6%96%B9&qid=1703890751&sprefix=%E5%AE%9A%E5%B9%B4%E5%89%8D%E3%81%A8%E5%AE%9A%E5%B9%B4%E5%BE%8C%E3%81%AE%E5%83%8D%E3%81%8D%E6%96%B9%2Caps%2C180&sr=8-1'
    const url2 =
      'https://www.amazon.co.jp/%E3%82%A8%E3%83%95%E3%82%A7%E3%82%AF%E3%83%81%E3%83%A5%E3%82%A8%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3-%E5%84%AA%E3%82%8C%E3%81%9F%E8%B5%B7%E6%A5%AD%E5%AE%B6%E3%81%8C%E5%AE%9F%E8%B7%B5%E3%81%99%E3%82%8B%E3%80%8C5%E3%81%A4%E3%81%AE%E5%8E%9F%E5%89%87%E3%80%8D-%E5%90%89%E7%94%B0-%E6%BA%80%E6%A2%A8-ebook/dp/B0C9CF55J6/ref=sr_1_1?crid=15L3GJQLZD7PH&keywords=%E3%82%A8%E3%83%95%E3%82%A7%E3%82%AF%E3%83%81%E3%83%A5%E3%82%A8%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3&qid=1703890563&sprefix=%E3%82%A8%E3%83%95%E3%82%A7%E3%82%AF%E3%83%81%E3%83%A5%E3%82%A8%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%2Caps%2C179&sr=8-1'
    const url3 =
      'https://www.amazon.co.jp/%E3%81%95%E3%81%BF%E3%81%97%E3%81%84%E5%A4%9C%E3%81%AB%E3%81%AF%E3%83%9A%E3%83%B3%E3%82%92%E6%8C%81%E3%81%A6-%E4%B8%80%E8%88%AC%E6%9B%B8-%E5%8F%A4%E8%B3%80-%E5%8F%B2%E5%81%A5/dp/4591178544/ref=sxts_b2b_sx_reorder_acb_customer?content-id=amzn1.sym.3aa0b3f0-43bc-4d36-b0f9-9cf3da9df3ea%3Aamzn1.sym.3aa0b3f0-43bc-4d36-b0f9-9cf3da9df3ea&crid=3PCVNMXI87026&cv_ct_cx=%E3%81%95%E3%81%BF%E3%81%97%E3%81%84%E5%A4%9C%E3%81%AB%E3%81%AF%E3%83%9A%E3%83%B3%E3%82%92%E6%8C%81%E3%81%A6&keywords=%E3%81%95%E3%81%BF%E3%81%97%E3%81%84%E5%A4%9C%E3%81%AB%E3%81%AF%E3%83%9A%E3%83%B3%E3%82%92%E6%8C%81%E3%81%A6&pd_rd_i=4591178544&pd_rd_r=ab5adc90-f978-468e-abe6-a46a5964d03b&pd_rd_w=UVsEu&pd_rd_wg=KwXe2&pf_rd_p=3aa0b3f0-43bc-4d36-b0f9-9cf3da9df3ea&pf_rd_r=V54GRZ3D9EBPSXF9ZH19&qid=1703890652&sbo=RZvfv%2F%2FHxDF%2BO5021pAnSA%3D%3D&sprefix=%E3%81%95%E3%81%BF%E3%81%97%E3%81%84%E5%A4%9C%E3%81%AB%E3%81%AF%E3%83%9A%E3%83%B3%E3%82%92%E6%8C%81%E3%81%A6%2Caps%2C182&sr=1-1-4ed356dd-72ad-4ce9-9bc3-e42562543353'
    const url4 = 'https://www.amazon.co.jp/gp/product/B08J7GGY6N/ref=as_li_qf_asin_il_tl'
    const url5 = 'https://www.amazon.co.jp/exec/obidos/ASIN/4799326686/opc-22/ref=nosim'
    const url6 =
      'https://www.amazon.co.jp/exec/obidos/asin/4815608032/sgomis53040f-22?&linkCode=sl1&tag=sgomis53040f-22&linkId=6052383a45eacc078426c35cc299c339&language=ja_JP&ref_=as_li_ss_tl'

    expect(getASIN(url)).toEqual('B0C42W5716')
    expect(getASIN(url2)).toEqual('B0C9CF55J6')
    expect(getASIN(url3)).toEqual('4591178544')
    expect(getASIN(url4)).toEqual('B08J7GGY6N')
    expect(getASIN(url5)).toEqual('4799326686')
    expect(getASIN(url6)).toEqual('4815608032')
  })
  it('短縮URLの場合（asinを含まない）、undefinedを返す', () => {
    const url = 'https://amzn.asia/d/imUy4q5'
    const url2 = 'https://amzn.to/3uxQ7Mp'
    const url3 = 'https://amzn.asia/d/8tTnOWq'

    expect(getASIN(url)).toBeUndefined()
    expect(getASIN(url2)).toBeUndefined()
    expect(getASIN(url3)).toBeUndefined()
  })
})

describe('cleanAmazonUrl', () => {
  it('asin以降のパスを削除する', () => {
    const url =
      'https://www.amazon.co.jp/%E5%AE%9A%E5%B9%B4%E5%89%8D%E3%81%A8%E5%AE%9A%E5%B9%B4%E5%BE%8C%E3%81%AE%E5%83%8D%E3%81%8D%E6%96%B9%EF%BD%9E%E3%82%B5%E3%83%BC%E3%83%89%E3%82%A8%E3%82%A4%E3%82%B8%E3%82%92%E7%94%9F%E3%81%8D%E3%82%8B%E6%80%9D%E8%80%83%EF%BD%9E-%E5%85%89%E6%96%87%E7%A4%BE%E6%96%B0%E6%9B%B8-%E7%9F%B3%E5%B1%B1-%E6%81%92%E8%B2%B4-ebook/dp/B0C42W5716/ref=sr_1_1?crid=1WNAXSOUA99Q6&keywords=%E5%AE%9A%E5%B9%B4%E5%89%8D%E3%81%A8%E5%AE%9A%E5%B9%B4%E5%BE%8C%E3%81%AE%E5%83%8D%E3%81%8D%E6%96%B9&qid=1703890751&sprefix=%E5%AE%9A%E5%B9%B4%E5%89%8D%E3%81%A8%E5%AE%9A%E5%B9%B4%E5%BE%8C%E3%81%AE%E5%83%8D%E3%81%8D%E6%96%B9%2Caps%2C180&sr=8-1'
    const url2 =
      'https://www.amazon.co.jp/%E3%82%A8%E3%83%95%E3%82%A7%E3%82%AF%E3%83%81%E3%83%A5%E3%82%A8%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3-%E5%84%AA%E3%82%8C%E3%81%9F%E8%B5%B7%E6%A5%AD%E5%AE%B6%E3%81%8C%E5%AE%9F%E8%B7%B5%E3%81%99%E3%82%8B%E3%80%8C5%E3%81%A4%E3%81%AE%E5%8E%9F%E5%89%87%E3%80%8D-%E5%90%89%E7%94%B0-%E6%BA%80%E6%A2%A8-ebook/dp/B0C9CF55J6/ref=sr_1_1?crid=15L3GJQLZD7PH&keywords=%E3%82%A8%E3%83%95%E3%82%A7%E3%82%AF%E3%83%81%E3%83%A5%E3%82%A8%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3&qid=1703890563&sprefix=%E3%82%A8%E3%83%95%E3%82%A7%E3%82%AF%E3%83%81%E3%83%A5%E3%82%A8%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%2Caps%2C179&sr=8-1'
    const url3 =
      'https://www.amazon.co.jp/%E3%81%95%E3%81%BF%E3%81%97%E3%81%84%E5%A4%9C%E3%81%AB%E3%81%AF%E3%83%9A%E3%83%B3%E3%82%92%E6%8C%81%E3%81%A6-%E4%B8%80%E8%88%AC%E6%9B%B8-%E5%8F%A4%E8%B3%80-%E5%8F%B2%E5%81%A5/dp/4591178544/ref=sxts_b2b_sx_reorder_acb_customer?content-id=amzn1.sym.3aa0b3f0-43bc-4d36-b0f9-9cf3da9df3ea%3Aamzn1.sym.3aa0b3f0-43bc-4d36-b0f9-9cf3da9df3ea&crid=3PCVNMXI87026&cv_ct_cx=%E3%81%95%E3%81%BF%E3%81%97%E3%81%84%E5%A4%9C%E3%81%AB%E3%81%AF%E3%83%9A%E3%83%B3%E3%82%92%E6%8C%81%E3%81%A6&keywords=%E3%81%95%E3%81%BF%E3%81%97%E3%81%84%E5%A4%9C%E3%81%AB%E3%81%AF%E3%83%9A%E3%83%B3%E3%82%92%E6%8C%81%E3%81%A6&pd_rd_i=4591178544&pd_rd_r=ab5adc90-f978-468e-abe6-a46a5964d03b&pd_rd_w=UVsEu&pd_rd_wg=KwXe2&pf_rd_p=3aa0b3f0-43bc-4d36-b0f9-9cf3da9df3ea&pf_rd_r=V54GRZ3D9EBPSXF9ZH19&qid=1703890652&sbo=RZvfv%2F%2FHxDF%2BO5021pAnSA%3D%3D&sprefix=%E3%81%95%E3%81%BF%E3%81%97%E3%81%84%E5%A4%9C%E3%81%AB%E3%81%AF%E3%83%9A%E3%83%B3%E3%82%92%E6%8C%81%E3%81%A6%2Caps%2C182&sr=1-1-4ed356dd-72ad-4ce9-9bc3-e42562543353'
    const url4 = 'https://www.amazon.co.jp/gp/product/B08J7GGY6N/ref=as_li_qf_asin_il_tl'
    const url5 = 'https://www.amazon.co.jp/exec/obidos/ASIN/4799326686/opc-22/ref=nosim'
    const url6 =
      'https://www.amazon.co.jp/exec/obidos/asin/4815608032/sgomis53040f-22?&linkCode=sl1&tag=sgomis53040f-22&linkId=6052383a45eacc078426c35cc299c339&language=ja_JP&ref_=as_li_ss_tl'
    const url7 = 'https://www.amazon.co.jp/exec/obidos/ASIN/4000614134?tag=hero719-22'

    expect(cleanAmazonUrl(url)).toEqual(
      'https://www.amazon.co.jp/%E5%AE%9A%E5%B9%B4%E5%89%8D%E3%81%A8%E5%AE%9A%E5%B9%B4%E5%BE%8C%E3%81%AE%E5%83%8D%E3%81%8D%E6%96%B9%EF%BD%9E%E3%82%B5%E3%83%BC%E3%83%89%E3%82%A8%E3%82%A4%E3%82%B8%E3%82%92%E7%94%9F%E3%81%8D%E3%82%8B%E6%80%9D%E8%80%83%EF%BD%9E-%E5%85%89%E6%96%87%E7%A4%BE%E6%96%B0%E6%9B%B8-%E7%9F%B3%E5%B1%B1-%E6%81%92%E8%B2%B4-ebook/dp/B0C42W5716',
    )
    expect(cleanAmazonUrl(url2)).toEqual(
      'https://www.amazon.co.jp/%E3%82%A8%E3%83%95%E3%82%A7%E3%82%AF%E3%83%81%E3%83%A5%E3%82%A8%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3-%E5%84%AA%E3%82%8C%E3%81%9F%E8%B5%B7%E6%A5%AD%E5%AE%B6%E3%81%8C%E5%AE%9F%E8%B7%B5%E3%81%99%E3%82%8B%E3%80%8C5%E3%81%A4%E3%81%AE%E5%8E%9F%E5%89%87%E3%80%8D-%E5%90%89%E7%94%B0-%E6%BA%80%E6%A2%A8-ebook/dp/B0C9CF55J6',
    )
    expect(cleanAmazonUrl(url3)).toEqual(
      'https://www.amazon.co.jp/%E3%81%95%E3%81%BF%E3%81%97%E3%81%84%E5%A4%9C%E3%81%AB%E3%81%AF%E3%83%9A%E3%83%B3%E3%82%92%E6%8C%81%E3%81%A6-%E4%B8%80%E8%88%AC%E6%9B%B8-%E5%8F%A4%E8%B3%80-%E5%8F%B2%E5%81%A5/dp/4591178544',
    )
    expect(cleanAmazonUrl(url4)).toEqual('https://www.amazon.co.jp/gp/product/B08J7GGY6N')
    expect(cleanAmazonUrl(url5)).toEqual('https://www.amazon.co.jp/exec/obidos/ASIN/4799326686')
    expect(cleanAmazonUrl(url6)).toEqual('https://www.amazon.co.jp/exec/obidos/asin/4815608032')
    expect(cleanAmazonUrl(url7)).toEqual('https://www.amazon.co.jp/exec/obidos/ASIN/4000614134')
  })
  it('形式がマッチしない場合、元のURLを返す', () => {
    const url = 'https://amzn.asia/d/imUy4q5'
    const url2 = 'https://amzn.to/3uxQ7Mp'
    const url3 = 'https://amzn.asia/d/8tTnOWq'

    expect(cleanAmazonUrl(url)).toEqual(url)
    expect(cleanAmazonUrl(url2)).toEqual(url2)
    expect(cleanAmazonUrl(url3)).toEqual(url3)
  })
})

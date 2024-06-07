import { getAmazonEmbeds } from '@/noteScraping/functions/amazon'

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

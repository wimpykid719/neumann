import { evaluateScore } from '@/noteScraping/functions/score'

const isInRangeZeroToOne = (value: number): boolean => {
  return value >= 0 && value <= 1
}

const addOneDayToCurrentDate = () => {
  const currentDate = new Date()
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000 // 1日分のミリ秒
  return new Date(currentDate.getTime() + oneDayInMilliseconds)
}

describe('score', () => {
  it('0~1の間でスコアが算出される', () => {
    const scoreValue = {
      likes: 100,
      publishedDate: new Date('2024-03-20T19:10:02.000+09:00'),
      user: {
        followers: 500,
        following: 200,
      },
    }

    const score = evaluateScore(scoreValue)

    expect(isInRangeZeroToOne(score)).toBe(true)
  })

  describe('いいね数が正規化の最大値500を超える場合', () => {
    it('0~1の間でスコアが算出される', () => {
      const scoreValue = {
        likes: 600,
        publishedDate: new Date(),
        user: {
          followers: 5000,
          following: 1,
        },
      }

      const score = evaluateScore(scoreValue)

      expect(isInRangeZeroToOne(score)).toBe(true)
    })
  })

  describe('日付が現在時刻を超える場合', () => {
    it('0~1の間でスコアが算出される', () => {
      const scoreValue = {
        likes: 600,
        publishedDate: addOneDayToCurrentDate(),
        user: {
          followers: 5000,
          following: 1,
        },
      }

      const score = evaluateScore(scoreValue)

      expect(isInRangeZeroToOne(score)).toBe(true)
    })
  })

  describe('FFが正規化の最大値3000を超える場合', () => {
    it('0~1の間でスコアが算出される', () => {
      const scoreValue = {
        likes: 600,
        publishedDate: new Date(),
        user: {
          followers: 5000,
          following: 1,
        },
      }

      const score = evaluateScore(scoreValue)

      expect(isInRangeZeroToOne(score)).toBe(true)
    })
  })
})

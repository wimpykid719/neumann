import { isLoggedInBefore } from '@/utils/localStorage'

describe('isLoggedInBefore', () => {
  describe('正常系', () => {
    it('localStorageに1という値がある際はユーザ作成・ログイン経歴があるとしてtrueを返す', () => {
      const result = isLoggedInBefore('1')

      expect(result).toEqual(true)
    })

    it('localStorageに0という値がある際はfalseを返す', () => {
      const result = isLoggedInBefore('0')

      expect(result).toEqual(false)
    })

    it('localStorageに値がない際はfalseを返す', () => {
      const result = isLoggedInBefore(null)

      expect(result).toEqual(false)
    })
  })

  describe('異常系', () => {
    it('localStorageに想定外の文字列がある際はfalseを返す', () => {
      const result = isLoggedInBefore('テスト')

      expect(result).toEqual(false)
    })
  })
})

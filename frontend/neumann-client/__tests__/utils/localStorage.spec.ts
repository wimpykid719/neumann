import { isLoggedInBefore } from '@/utils/localStorage'

jest.spyOn(Storage.prototype, 'getItem').mockImplementation(jest.fn())

describe('isLoggedInBefore', () => {
  describe('正常系', () => {
    it('localStorageに1という値がある際はユーザ作成・ログイン経歴があるとしてtrueを返す', () => {
      const mocklocalStorageItem = localStorage.getItem as jest.Mock
      mocklocalStorageItem.mockReturnValue('1')

      const result = isLoggedInBefore()
      expect(localStorage.getItem).toHaveBeenCalledWith('isLoggedIn')
      expect(result).toEqual(true)
    })

    it('localStorageに0という値がある際はfalseを返す', () => {
      const mocklocalStorageItem = localStorage.getItem as jest.Mock
      mocklocalStorageItem.mockReturnValue('0')

      const result = isLoggedInBefore()
      expect(localStorage.getItem).toHaveBeenCalledWith('isLoggedIn')
      expect(result).toEqual(false)
    })

    it('localStorageに値がない際はfalseを返す', () => {
      const mocklocalStorageItem = localStorage.getItem as jest.Mock
      mocklocalStorageItem.mockReturnValue(null)

      const result = isLoggedInBefore()
      expect(localStorage.getItem).toHaveBeenCalledWith('isLoggedIn')
      expect(result).toEqual(false)
    })
  })

  describe('異常系', () => {
    it('localStorageに想定外の文字列がある際はfalseを返す', () => {
      const mocklocalStorageItem = localStorage.getItem as jest.Mock
      mocklocalStorageItem.mockReturnValue('テスト')

      const result = isLoggedInBefore()
      expect(localStorage.getItem).toHaveBeenCalledWith('isLoggedIn')
      expect(result).toEqual(false)
    })
  })
})

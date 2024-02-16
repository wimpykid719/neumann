import SignupPage from '@/app/signup/page'
import { useAccessToken } from '@/contexts/AccessTokenContext'
import { FetchError } from '@/lib/errors'
import { postUserCreate } from '@/lib/wrappedFeatch/signupRequest'
import { toastTime } from '@/utils/toast'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}))

jest.mock('@/contexts/AccessTokenContext', () => ({
  useAccessToken: jest.fn().mockReturnValue({ setAccessToken: jest.fn() }),
}))

jest.mock('@/lib/wrappedFeatch/signupRequest', () => ({
  postUserCreate: jest.fn(),
}))

describe('SignupPage', () => {
  describe('正常系', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.runOnlyPendingTimers()
      jest.useRealTimers()
    })
    it('トースターが存在する', () => {
      render(<SignupPage />)
      expect(screen.getByTestId('toast')).toBeInTheDocument()
    })

    it('ユーザ作成後、アクセストークンが返り、トップページに移動', async () => {
      const flushPromises = () => new Promise(resolve => jest.requireActual('timers').setImmediate(resolve))
      const mockPostUserCreate = postUserCreate as jest.Mock
      mockPostUserCreate.mockResolvedValue({ token: 'dummyToken' })

      jest.useFakeTimers()

      render(<SignupPage />)

      expect(useRouter().push).not.toHaveBeenCalled()

      const userNameInput = screen.getByLabelText('ユーザ名')
      fireEvent.change(userNameInput, { target: { value: 'こんどう ひろき' } })

      const emailInput = screen.getByLabelText('メールアドレス')
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

      const passwordInput = screen.getByLabelText('パスワード')
      fireEvent.change(passwordInput, { target: { value: 'password' } })

      const submitButton = screen.getByRole('button', { name: '登録' })
      fireEvent.click(submitButton)

      // 非同期関数の処理が全て完了している事を確認
      await flushPromises()
      jest.advanceTimersByTime(toastTime.succeeded)

      await waitFor(async () => {
        expect(mockPostUserCreate).toHaveBeenCalledWith({
          name: 'こんどう ひろき',
          email: 'test@example.com',
          password: 'password',
        })
        expect(screen.queryByText('ユーザが作成されました')).toBeInTheDocument()
        expect(useAccessToken().setAccessToken).toHaveBeenCalledWith('dummyToken')
        expect(useRouter().push).toHaveBeenCalledWith('/')
      })
    })
  })
  describe('異常系', () => {
    it('ログイン失敗、トースターがエラーメッセージと共に表示', async () => {
      const mockPostUserCreate = postUserCreate as jest.Mock
      mockPostUserCreate.mockResolvedValue(new FetchError('ユーザ作成に失敗しました', 422))

      render(<SignupPage />)

      expect(useRouter().push).not.toHaveBeenCalled()
      expect(screen.queryByText('ユーザ作成に失敗しました')).not.toBeInTheDocument()

      const userNameInput = screen.getByLabelText('ユーザ名')
      fireEvent.change(userNameInput, { target: { value: 'こんどう ひろき' } })

      const emailInput = screen.getByLabelText('メールアドレス')
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

      const passwordInput = screen.getByLabelText('パスワード')
      fireEvent.change(passwordInput, { target: { value: 'password' } })

      const submitButton = screen.getByRole('button', { name: '登録' })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.queryByText('ユーザ作成に失敗しました')).toBeInTheDocument()
      })
    })
  })
})

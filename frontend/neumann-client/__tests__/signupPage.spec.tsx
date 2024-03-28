import SignupPage from '@/app/signup/page'
import { useAccessToken } from '@/contexts/AccessTokenContext'
import { useToast } from '@/contexts/ToastContext'
import { FetchError } from '@/lib/errors'
import { postUserCreate } from '@/lib/wrappedFeatch/requests/signup'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}))

jest.mock('@/contexts/AccessTokenContext', () => ({
  useAccessToken: jest.fn().mockReturnValue({ setAccessToken: jest.fn() }),
}))

jest.mock('@/contexts/ToastContext', () => ({
  useToast: jest.fn().mockReturnValue({ showToast: jest.fn() }),
}))

jest.mock('@/lib/wrappedFeatch/requests/signup', () => ({
  postUserCreate: jest.fn(),
}))

jest.mock('@/utils/sleep', () => ({
  sleep: jest.fn(),
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

    it('ユーザ作成後、アクセストークンが返り、トップページに移動', async () => {
      const mockPostUserCreate = postUserCreate as jest.Mock
      mockPostUserCreate.mockResolvedValue({ token: 'dummyToken' })

      jest.useFakeTimers()

      render(<SignupPage />)

      expect(useRouter().push).not.toHaveBeenCalled()
      expect(useToast().showToast).not.toHaveBeenCalled()

      const userNameInput = screen.getByLabelText('ユーザ名')
      fireEvent.change(userNameInput, { target: { value: 'kondou-hiroki' } })

      const emailInput = screen.getByLabelText('メールアドレス')
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

      const passwordInput = screen.getByLabelText('パスワード')
      fireEvent.change(passwordInput, { target: { value: 'password' } })

      const submitButton = screen.getByRole('button', { name: '登録' })
      fireEvent.click(submitButton)

      await waitFor(async () => {
        expect(mockPostUserCreate).toHaveBeenCalledWith({
          name: 'kondou-hiroki',
          email: 'test@example.com',
          password: 'password',
        })
        expect(useToast().showToast).toHaveBeenCalledWith('ユーザが作成されました', 'success')
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
      expect(useToast().showToast).not.toHaveBeenCalled()

      const userNameInput = screen.getByLabelText('ユーザ名')
      fireEvent.change(userNameInput, { target: { value: 'kondou-hiroki' } })

      const emailInput = screen.getByLabelText('メールアドレス')
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

      const passwordInput = screen.getByLabelText('パスワード')
      fireEvent.change(passwordInput, { target: { value: 'password' } })

      const submitButton = screen.getByRole('button', { name: '登録' })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(useToast().showToast).toHaveBeenCalledWith('ユーザ作成に失敗しました', 'error')
      })
    })
  })
})

import LoginPage from '@/app/login/page'
import { useAccessToken } from '@/contexts/AccessTokenContext'
import { useToast } from '@/contexts/ToastContext'
import { FetchError } from '@/lib/errors'
import { postAuthToken } from '@/lib/wrappedFeatch/requests/login'
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

jest.mock('@/lib/wrappedFeatch/requests/login', () => ({
  postAuthToken: jest.fn(),
}))

describe('loginPage', () => {
  describe('正常系', () => {
    it('ログイン後、アクセストークンが返り、トップページに移動', async () => {
      const mockPostAuthToken = postAuthToken as jest.Mock
      mockPostAuthToken.mockResolvedValue({ token: 'dummyToken' })

      render(<LoginPage />)

      expect(useRouter().push).not.toHaveBeenCalled()

      const emailInput = screen.getByLabelText('メールアドレス')
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

      const passwordInput = screen.getByLabelText('パスワード')
      fireEvent.change(passwordInput, { target: { value: 'password' } })

      const submitButton = screen.getByRole('button', { name: 'ログイン' })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(postAuthToken).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' })
        expect(useAccessToken().setAccessToken).toHaveBeenCalledWith('dummyToken')
        expect(useRouter().push).toHaveBeenCalledWith('/')
      })
    })
  })
  describe('異常系', () => {
    it('ログイン失敗、トースターがエラーメッセージと共に表示', async () => {
      const mockPostAuthToken = postAuthToken as jest.Mock
      mockPostAuthToken.mockResolvedValue(new FetchError('ログインに失敗しました', 404))

      render(<LoginPage />)

      expect(useRouter().push).not.toHaveBeenCalled()
      expect(useToast().showToast).not.toHaveBeenCalled()

      const emailInput = screen.getByLabelText('メールアドレス')
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

      const passwordInput = screen.getByLabelText('パスワード')
      fireEvent.change(passwordInput, { target: { value: 'password' } })

      const submitButton = screen.getByRole('button', { name: 'ログイン' })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(useToast().showToast).toHaveBeenCalledWith('ログインに失敗しました', 'error')
      })
    })
  })
})

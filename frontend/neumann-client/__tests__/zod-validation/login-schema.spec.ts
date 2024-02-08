import { loginValidationSchema } from '@/lib/zod-schema/login-validation'

describe('loginValidationSchema', () => {
  describe('正常系', () => {
    it('email/1文字以上255文字以下、password/8文字以上72文字以下バリデーションに引っかからない', () => {
      const loginData = {
        email: `${'a'.repeat(243)}@example.com`,
        password: 'a'.repeat(72),
      }
      expect(() => loginValidationSchema.parse(loginData)).not.toThrow()
    })
  })
  describe('異常系', () => {
    it('emailが空、エラーメッセージが返る', () => {
      const loginData = {
        email: '',
        password: 'example_user',
      }
      const result = loginValidationSchema.safeParse(loginData)
      expect(result.success).toEqual(false)
      expect((result as any).error.errors[0].message).toEqual('メールアドレスは必須です')
    })

    it('emailが256文字以上、エラーメッセージが返る', () => {
      const loginData = {
        email: `${'a'.repeat(244)}@example.com`,
        password: 'example_user',
      }
      const result = loginValidationSchema.safeParse(loginData)
      expect(result.success).toEqual(false)
      expect((result as any).error.errors[0].message).toEqual('メールアドレスは255文字以内で入力してください')
    })

    it('emailが不正な形式、エラーメッセージが返る', () => {
      const loginData = {
        email: 'example_user',
        password: 'example_user',
      }
      const result = loginValidationSchema.safeParse(loginData)
      expect(result.success).toEqual(false)
      expect((result as any).error.errors[0].message).toEqual('正しいメールアドレスを入力してください')
    })

    it('passwordが7文字以下、エラーメッセージが返る', () => {
      const loginData = {
        email: 'user@example.com',
        password: 'a'.repeat(7),
      }
      const result = loginValidationSchema.safeParse(loginData)
      expect(result.success).toEqual(false)
      expect((result as any).error.errors[0].message).toEqual('パスワードは8文字以上で入力してください')
    })

    it('passwordが73文字以上、エラーメッセージが返る', () => {
      const loginData = {
        email: 'user@example.com',
        password: 'a'.repeat(73),
      }
      const result = loginValidationSchema.safeParse(loginData)
      expect(result.success).toEqual(false)
      expect((result as any).error.errors[0].message).toEqual('パスワードは72文字以内で入力してください')
    })
  })
})

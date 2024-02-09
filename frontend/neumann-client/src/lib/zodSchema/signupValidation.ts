import validation from '@/text/validation.json'
import { z } from 'zod'

export type SignupValidation = z.infer<typeof SignupValidationSchema>

export const SignupValidationSchema = z.object({
  name: z.string().min(1, validation.nameMin).max(50, validation.nameMax),
  email: z.string().min(1, validation.emailMin).max(255, validation.emailMax).email(validation.emailIncorect),
  password: z.string().min(8, validation.passwordMin).max(72, validation.passwordMax),
})

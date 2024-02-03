import validation from '@/text/validation.json'
import { z } from 'zod'

export type LoginValidation = z.infer<typeof loginValidationSchema>

export const loginValidationSchema = z.object({
  email: z.string().min(1, validation.emailMin).email(validation.emailIncorect),
  password: z.string().min(8, validation.passwordMin),
})

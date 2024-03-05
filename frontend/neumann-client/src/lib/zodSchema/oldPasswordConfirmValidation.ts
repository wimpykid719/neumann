import validation from '@/text/validation.json'
import { z } from 'zod'

export type OldPasswordValidation = z.infer<typeof OldPasswordValidationSchema>

export const OldPasswordValidationSchema = z.object({
  oldPassword: z.string().min(8, validation.passwordMin).max(72, validation.passwordMax),
})

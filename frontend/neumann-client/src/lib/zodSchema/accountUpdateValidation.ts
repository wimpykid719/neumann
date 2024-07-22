import validation from '@/text/validation.json'
import { z } from 'zod'

export type AccountUpdateValidation = z.infer<typeof AccountUpdateValidationSchema>

export const AccountUpdateValidationSchema = z
  .object({
    newEmail: z.string().min(1, validation.emailMin).max(255, validation.emailMax).email(validation.emailIncorect),
    newPassword: z
      .string()
      .regex(/^$|^.{8,}$/, { message: validation.passwordMin })
      .max(72, validation.passwordMax)
      .optional(),
    newPasswordConfirm: z
      .string()
      .regex(/^$|^.{8,}$/, { message: validation.passwordMin })
      .max(72, validation.passwordMax)
      .optional(),
  })
  .refine(data => data.newPassword === data.newPasswordConfirm, {
    message: validation.passwordNoMatch,
    path: ['newPasswordConfirm'],
  })

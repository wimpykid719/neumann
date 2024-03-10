import validation from '@/text/validation.json'
import { z } from 'zod'

export type ProfileUpdateValidation = z.infer<typeof ProfileUpdateValidationSchema>

export const ProfileUpdateValidationSchema = z.object({
  name: z.string().max(30, validation.profileNameMax),
  bio: z.string().max(180, validation.bioMax),
  xTwitter: z.string().max(50, validation.xTwitterMax),
  instagram: z.string().max(50, validation.instagramMax),
  facebook: z.string().max(50, validation.facebookMax),
  linkedin: z.string().max(50, validation.linkedinMax),
  tiktok: z
    .string()
    .max(50, validation.tiktokMax)
    .regex(/(^[^@].*|\s*)$/, { message: validation.noNeedAtSign }),
  youtube: z
    .string()
    .max(50, validation.youtubeMax)
    .regex(/(^[^@].*|\s*)$/, { message: validation.noNeedAtSign }),
  website: z
    .string()
    .max(255, validation.websiteMax)
    .regex(/^(https:\/\/.*|\s*)$/, { message: validation.urlOnlyHttps })
    .regex(/^(https:\/\/[\w\-.]+(:\d+)?(\/[\w\-.]*)*(\?\S*)?)?$/, { message: validation.urlNotInvalid }),
})

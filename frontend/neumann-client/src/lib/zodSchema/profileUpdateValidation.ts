import validation from '@/text/validation.json'
import { z } from 'zod'

const MAX_IMAGE_SIZE = 5
const IMAGE_TYPES = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/webp']

const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
  const result = sizeInBytes / (1024 * 1024)
  return +result.toFixed(decimalsNum)
}

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
    .regex(/^(?!@).*/, { message: validation.noNeedAtSign }),
  youtube: z
    .string()
    .max(50, validation.youtubeMax)
    .regex(/^(?!@).*/, { message: validation.noNeedAtSign }),
  website: z
    .string()
    .max(255, validation.websiteMax)
    .regex(/^(https:\/\/.*|\s*)$/, { message: validation.urlOnlyHttps })
    .regex(/^(https:\/\/[\w\-.]+(:\d+)?(\/[\w\-.]*)*(\?\S*)?)?$/, { message: validation.urlNotInvalid }),
  avatar: z
    .custom<FileList>()
    .transform(file => file[0])
    .refine(file => !file || sizeInMB(file.size) <= MAX_IMAGE_SIZE, { message: validation.imageMaxSize })
    .refine(file => !file || IMAGE_TYPES.includes(file.type), {
      message: validation.imageTypes,
    }),
})

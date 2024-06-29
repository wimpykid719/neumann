export const base64UrlSafeEncode = (input: string) => Buffer.from(input).toString('base64url')
export const base64UrlSafeDecode = (input: string) => Buffer.from(input, 'base64url').toString()

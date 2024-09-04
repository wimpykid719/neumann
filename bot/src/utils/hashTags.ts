export const HASH_TAGS = [
  'ビジネス書評',
  'おすすめのビジネス書',
  'ビジネス書レビュー',
  'ビジネス書',
  'キャリア',
  'ビジネススキル',
  'マーケティング',
  '起業',
] as const
export type HashTags = (typeof HASH_TAGS)[number]

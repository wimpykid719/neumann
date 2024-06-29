type scoreValue = {
  likes: number
  publishedDate: Date
  user: {
    followers: number
    following: number
  }
}

export const evaluateScore = (scoreValue: scoreValue): number => {
  const now = new Date()

  // 記事のいいね数の評価 (単純な正規化)
  const likeScore = Math.min(scoreValue.likes / 500, 1)

  // 記事の公開日の評価 (日数を正規化)
  const daysSincePublished = Math.max((now.getTime() - scoreValue.publishedDate.getTime()) / (1000 * 60 * 60 * 24), 0)
  const dateScore = Math.max(1 - daysSincePublished / 30, 0) // 30日以内なら1、それ以降は徐々に減少

  // ユーザの評価 (フォロワーとフォローの比率)
  const userScore = scoreValue.user.followers / Math.max(scoreValue.user.following, 1) // 0除算を避けるための調整
  const normalizedUserScore = Math.min(userScore / 3000, 1)

  // 重み付け
  const wLike = 0.5
  const wDate = 0.3
  const wUser = 0.2

  // 総合評価
  return wLike * likeScore + wDate * dateScore + wUser * normalizedUserScore
}

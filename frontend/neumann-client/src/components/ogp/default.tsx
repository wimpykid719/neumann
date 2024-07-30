import BizRankIcon from '../common/icon/BizRankIcon'
export const revalidate = 'force-cache'
import app from '@/text/app.json'

export function Default() {
  return (
    <>
      <h1
        style={{
          display: 'flex',
          alignItems: 'center',
          borderRight: 'solid 1px #111827',
          padding: '32px 32px 32px 0',
        }}
      >
        <span
          style={{
            display: 'flex',
            marginRight: '32px',
          }}
        >
          <BizRankIcon width={144} height={144} />
        </span>
        <span
          style={{
            fontSize: 48,
            fontFamily: 'Inter',
          }}
        >
          {app.title}
        </span>
      </h1>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontSize: '30px',
          padding: '32px 0 0 32px',
        }}
      >
        <p
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          大量の書籍データから
          <br />
          本当に価値のあるビジネス書籍を独自
          <br />
          アルゴリズムで評価して紹介
        </p>
      </div>
    </>
  )
}

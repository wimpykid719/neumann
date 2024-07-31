import HeartIcon from '@/components/common/icon/HeartIcon'
import BizRankIcon from '../../common/icon/BizRankIcon'
export const revalidate = 'force-cache'
import app from '@/text/app.json'
import type { Book } from '@/types/book'
import { textEllipsis } from '@/utils/textEllipsis'

export type BookProps = {
  title: Book['title']
  imgUrl: Book['img_url']
  likesCount: Book['likes_count']
}

const DISPLAY_WORDS_TITLE = 100
const DISPLAY_WORDS_TITLE_CARD = 30

export default function Book({ title, imgUrl, likesCount }: BookProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: 320,
            height: 428,
            background: '#fff',
            borderRadius: '8px',
            marginRight: '64px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <img
              src={imgUrl}
              width={184}
              height={272}
              style={{
                width: 184,
                height: 272,
                borderRadius: '8px',
                objectFit: 'cover',
              }}
            />
            <span
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: '192PX',
                left: '152PX',
                padding: '0 12px',
                borderRadius: '8px',
                height: '32px',
                background: '#fff',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
              }}
            >
              <span
                style={{
                  width: 20,
                  color: '#FF0211',
                }}
              >
                <HeartIcon width={18} height={18} />
              </span>
              {likesCount}
            </span>
          </div>
          <p
            style={{
              color: '#6b7280',
              fontSize: '20px',
              padding: '0 32px',
            }}
          >
            {textEllipsis(title, DISPLAY_WORDS_TITLE_CARD)}
          </p>
        </div>
        <h1
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '392px',
            wordBreak: 'break-all',
            margin: 0,
            padding: 0,
          }}
        >
          {textEllipsis(title, DISPLAY_WORDS_TITLE)}
        </h1>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          fontWeight: 'bold',
        }}
      >
        <span
          style={{
            display: 'flex',
            marginRight: '16px',
          }}
        >
          <BizRankIcon width={64} height={64} />
        </span>
        <span
          style={{
            fontSize: 28,
            fontFamily: 'Inter',
          }}
        >
          {app.title}
        </span>
      </div>
    </div>
  )
}

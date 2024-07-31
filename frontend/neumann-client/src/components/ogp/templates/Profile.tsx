import FacebookIcon from '@/components/common/icon/FacebookIcon'
import InstagramIcon from '@/components/common/icon/InstagramIcon'
import LinkedInIcon from '@/components/common/icon/LinkedInIcon'
import TikTokIcon from '@/components/common/icon/TikTokIcon'
import URLIcon from '@/components/common/icon/URLIcon'
import XIcon from '@/components/common/icon/XIcon'
import YouTubeIcon from '@/components/common/icon/YouTubeIcon'
import app from '@/text/app.json'
import { User } from '@/types/user'
import { textEllipsis } from '@/utils/textEllipsis'
import BizRankIcon from '../../common/icon/BizRankIcon'

export type ProfileProps = Omit<User['profile'], 'x_twitter'> & {
  xTwitter: User['profile']['x_twitter']
}

const DISPLAY_WORDS_NAME = 30
const DISPLAY_WORDS_BIO = 140

export default function Profile({
  name,
  bio,
  xTwitter,
  instagram,
  facebook,
  linkedin,
  tiktok,
  youtube,
  website,
  avatar,
}: ProfileProps) {
  avatar = ''
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
          alignItems: 'center',
          height: 428,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: 144,
            height: 144,
            background: '#fff',
            borderRadius: '16px',
            marginRight: '44px',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
            position: 'relative',
            textAlign: 'center',
            overflow: 'hidden',
            fontSize: '36px',
          }}
        >
          {avatar ? (
            <img
              src={avatar}
              width={144}
              height={144}
              style={{
                width: 144,
                height: 144,
                borderRadius: '8px',
                objectFit: 'cover',
                position: 'absolute',
              }}
            />
          ) : (
            '(,,0‸0,,)'
          )}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 588,
            wordBreak: 'break-word',
          }}
        >
          <h1
            style={{
              fontSize: 60,
              margin: 0,
              padding: 0,
            }}
          >
            {textEllipsis(name, DISPLAY_WORDS_NAME)}
          </h1>
          <p
            style={{
              fontSize: 24,
            }}
          >
            {textEllipsis(bio, DISPLAY_WORDS_BIO)}
          </p>
          <ul
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              color: '#6B7280',
              margin: '32px 0 32px 0',
            }}
          >
            {xTwitter && (
              <li
                style={{
                  marginRight: '16px',
                }}
              >
                <XIcon width={32} height={32} />
              </li>
            )}
            {instagram && (
              <li
                style={{
                  marginRight: '16px',
                }}
              >
                <InstagramIcon width={32} height={32} />
              </li>
            )}
            {linkedin && (
              <li
                style={{
                  marginRight: '16px',
                }}
              >
                <LinkedInIcon width={32} height={32} />
              </li>
            )}
            {facebook && (
              <li
                style={{
                  marginRight: '16px',
                }}
              >
                <FacebookIcon width={32} height={32} />
              </li>
            )}
            {tiktok && (
              <li
                style={{
                  marginRight: '16px',
                }}
              >
                <TikTokIcon width={32} height={32} />
              </li>
            )}
            {youtube && (
              <li
                style={{
                  marginRight: '16px',
                }}
              >
                <YouTubeIcon width={32} height={32} />
              </li>
            )}
            {website && (
              <li>
                <URLIcon width={32} height={32} />
              </li>
            )}
          </ul>
        </div>
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

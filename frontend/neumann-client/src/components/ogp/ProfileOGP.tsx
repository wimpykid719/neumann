import Base from './templates/Base'
import Profile, { ProfileProps } from './templates/Profile'

export default function ProfileOGP({
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
  return (
    <Base
      contents={
        <Profile
          name={name}
          bio={bio}
          xTwitter={xTwitter}
          instagram={instagram}
          facebook={facebook}
          linkedin={linkedin}
          tiktok={tiktok}
          youtube={youtube}
          website={website}
          avatar={avatar}
        />
      }
    />
  )
}

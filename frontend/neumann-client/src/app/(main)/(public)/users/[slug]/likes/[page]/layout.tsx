import { failedPageMetadata } from '@/lib/metadata'
import app from '@/text/app.json'
import error from '@/text/error.json'
import { Metadata, ResolvingMetadata } from 'next'

type SlugProps = {
  slug: string
}

type PageProps = {
  page: string
}

type UserLikesProps = { params: SlugProps & PageProps }

const extractUsername = (input: string | null) => {
  if (!input) return null

  const regex = /^(.*?)\s*\|\s*BizRank$/
  const match = input.match(regex)

  return match ? match[1] : null
}

export async function generateMetadata({ params }: UserLikesProps, parent: ResolvingMetadata): Promise<Metadata> {
  const userProfileName = extractUsername((await parent).title?.absolute || null)

  if (!userProfileName) {
    console.error(error.failedUserProfileNameMetadata)
    return failedPageMetadata()
  }

  return {
    title: `${userProfileName} - いいね一覧 ${params.page}ページ目 | ${app.title}`,
  }
}

export default async function LikesLayout({ children }: { children: React.ReactNode; params: SlugProps }) {
  return <>{children}</>
}

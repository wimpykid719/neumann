import { MarkdownRenderer } from '@/components/common/MarkdownRender'
import BizRankIcon from '@/components/common/icon/BizRankIcon'
import { readMarkdown } from '@/lib/readMarkdown'
import app from '@/text/app.json'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: app.privacy,
}

export default function privacyPage() {
  const markdown = readMarkdown('src/md/privacy.md')
  return (
    <div className='break-words max-w-2xl mx-auto text-sm space-y-8'>
      <div className='text-xl font-bold text-center '>
        <BizRankIcon width={60} height={60} className='mr-2 inline' />
        {app.title}
      </div>
      <div className='space-y-4 text-center'>
        <p>
          本サービスは、以下のプライバシーポリシーを定め、個人の情報に関す本プライバシーポリシーは、
          <Link className='text-secondary hover:underline' href={'/'}>
            {app.title}
          </Link>
          （以下「当サービス」）が提供するサービスにおいて、ユーザーの個人情報の取り扱いについて説明するものです。
          当サービスを利用することで、本プライバシーポリシーに同意いただいたものとみなします。
        </p>
      </div>
      <MarkdownRenderer id={'clause-renderer'} className={'common-renderer'} children={markdown.content} />
    </div>
  )
}

import { MarkdownRenderer } from '@/components/common/MarkdownRender'
import BizRankIcon from '@/components/common/icon/BizRankIcon'
import { readMarkdown } from '@/lib/readMarkdown'
import app from '@/text/app.json'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: app.terms,
}

export default function termsPage() {
  const markdown = readMarkdown('src/md/terms.md')
  return (
    <div className='break-words max-w-2xl mx-auto text-sm space-y-8'>
      <div className='text-xl font-bold text-center '>
        <BizRankIcon width={60} height={60} className='mr-2 inline' />
        {app.title}
      </div>
      <div className='space-y-4 text-center'>
        <p>
          本利用規約（以下「本規約」）は、
          <Link className='text-secondary hover:underline' href={'/'}>
            {app.title}
          </Link>
          （以下「当サービス」）を運営する個人（以下「運営者」）が提供するサービスの利用条件を定めるものです。
        </p>
        <p>ユーザーは、本規約に同意した上で、当サービスを利用するものとします。</p>
      </div>
      <MarkdownRenderer id={'clause-renderer'} className={'common-renderer'} children={markdown.content} />
    </div>
  )
}

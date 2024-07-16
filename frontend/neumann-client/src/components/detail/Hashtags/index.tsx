import { BookDetail } from '@/types/book'

type HashtagsProps = {
  hashtags: BookDetail['note_reference']['hashtags']
}

const removeHashtag = (str: string) => str.replace(/^#/, '')

const noteHashtagUrl = (tag: string) => 'https://note.com/hashtag/' + removeHashtag(tag)

export default function Hashtags({ hashtags }: HashtagsProps) {
  return (
    <ul className='flex items-start flex-wrap'>
      {hashtags.map(tag => (
        <li className='mx-2 mb-4 border rounded-lg text-xs  text-center hover:opacity-70 border-gray-500 text-gray-500'>
          <a href={noteHashtagUrl(tag)} target='_blank' className='block px-2 py-2' rel='noreferrer'>
            {tag}
          </a>
        </li>
      ))}
    </ul>
  )
}

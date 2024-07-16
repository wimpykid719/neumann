'use client'

import { BookDetail } from '@/types/book'
import { useState } from 'react'

type HashtagsProps = {
  hashtags: BookDetail['note_reference']['hashtags']
}

const removeHashtag = (str: string) => str.replace(/^#/, '')

const noteHashtagUrl = (tag: string) => 'https://note.com/hashtag/' + removeHashtag(tag)

export default function Hashtags({ hashtags }: HashtagsProps) {
  const DISPLAY_COLLAPSE_LENGTH = 20
  const [isCollapse, setCollapse] = useState(DISPLAY_COLLAPSE_LENGTH < hashtags.length)

  return (
    <div>
      <ul className={`flex items-start flex-wrap ${isCollapse && 'overflow-hidden max-h-40 lg:max-h-56'}`}>
        {hashtags.map(tag => (
          <li
            key={tag}
            className='mx-2 mb-4 border rounded-lg text-xs text-center hover:opacity-70 border-gray-500 text-gray-500'
          >
            <a href={noteHashtagUrl(tag)} target='_blank' className='block px-2 py-2' rel='noreferrer'>
              {tag}
            </a>
          </li>
        ))}
      </ul>
      {isCollapse && (
        <div
          className={`
          bg-gradient-to-t from-gray-50 dark:from-gray-900
          flex justify-center
          items-end w-full relative
          h-24 ${isCollapse && '-mt-24'}
        `}
        >
          <button className='text-sm text-gray-500 hover:opacity-70' onClick={() => setCollapse(false)}>
            もっと見る
          </button>
        </div>
      )}
    </div>
  )
}

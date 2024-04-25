'use client'

import { FIRST_PAGE } from '@/utils/page'
import { range } from '@/utils/range'
import Ellipsis from './Ellipsis'
import Navigation from './Navigation'
import Number from './Number'

export type PaginationProps = {
  path?: string
  page: number
  lastPage: number
  disabled?: boolean
  // ページネーションの両端に絶対表示しておきたい数値の数
  // 例：1の場合で最終ページが10の場合 1,10が常に両端に表示される。2の場合は1 2, 9 10
  // が常に表示される
  boundaryCount?: number
  siblingCount?: number
  hideNextButton?: boolean
  hidePrevButton?: boolean
  showFirstButton?: boolean
  showLastButton?: boolean
}

type PageType = 'first' | 'previous' | 'next' | 'last' | 'start-ellipsis' | 'end-ellipsis'

export default function Pagination({
  path,
  page,
  lastPage,
  disabled = false,
  boundaryCount = 1,
  siblingCount = 1,
  hideNextButton = false,
  hidePrevButton = false,
  showFirstButton = false,
  showLastButton = false,
}: PaginationProps) {
  const startPages = range(1, Math.min(boundaryCount, lastPage))
  const endPages = range(Math.max(lastPage - boundaryCount + 1, boundaryCount + 1), lastPage)

  const siblingsStart = Math.max(
    Math.min(
      // Natural start
      page - siblingCount,
      // Lower boundary when page is high
      lastPage - boundaryCount - siblingCount * 2 - 1,
    ),
    // Greater than startPages
    boundaryCount + 2,
  )

  const siblingsEnd = Math.min(
    Math.max(
      // Natural end
      page + siblingCount,
      // Upper boundary when page is low
      boundaryCount + siblingCount * 2 + 2,
    ),
    // Less than endPages
    endPages.length > 0 ? endPages[0] - 2 : lastPage - 1,
  )

  // Basic list of items to render
  // e.g. itemList = ['first', 'previous', 1, 'ellipsis', 4, 5, 6, 'ellipsis', 10, 'next', 'last']
  const itemList = [
    ...(showFirstButton ? ['first' as const] : []),
    ...(hidePrevButton ? [] : ['previous' as const]),
    ...startPages,

    // Start ellipsis
    // eslint-disable-next-line no-nested-ternary
    ...(siblingsStart > boundaryCount + 2
      ? ['start-ellipsis' as const]
      : boundaryCount + 1 < lastPage - boundaryCount
        ? [boundaryCount + 1]
        : []),

    // Sibling pages
    ...range(siblingsStart, siblingsEnd),

    // End ellipsis
    // eslint-disable-next-line no-nested-ternary
    ...(siblingsEnd < lastPage - boundaryCount - 1
      ? ['end-ellipsis' as const]
      : lastPage - boundaryCount > boundaryCount
        ? [lastPage - boundaryCount]
        : []),

    ...endPages,
    ...(hideNextButton ? [] : ['next' as const]),
    ...(showLastButton ? ['last' as const] : []),
  ]

  const itemDom = (type: PageType) => {
    const buttonDisabled =
      disabled ||
      (type.indexOf('ellipsis') === -1 && (type === 'next' || type === 'last' ? page >= lastPage : page <= 1))

    switch (type) {
      case 'first':
        return (
          <Number
            path={path}
            page={FIRST_PAGE}
            selected={1 === page}
            disabled={disabled}
            ariaCurrent={1 === page ? 'true' : undefined}
          />
        )
      case 'previous':
        return <Navigation icon={<>{'<'}</>} page={page - 1} disabled={buttonDisabled} />
      case 'next':
        return <Navigation icon={<>{'>'}</>} page={page + 1} disabled={buttonDisabled} />
      case 'last':
        return (
          <Number
            path={path}
            page={lastPage}
            selected={lastPage === page}
            disabled={disabled}
            ariaCurrent={lastPage === page ? 'true' : undefined}
          />
        )
      default:
        return <Ellipsis />
    }
  }

  // Convert the basic item list to PaginationItem props objects
  const items = itemList.map(item => {
    return typeof item === 'number' ? (
      <Number
        path={path}
        page={item}
        selected={item === page}
        disabled={disabled}
        ariaCurrent={item === page ? 'true' : undefined}
      />
    ) : (
      itemDom(item)
    )
  })

  return (
    <div className='flex justify-center flex-col items-center w-full'>
      <ul
        className='
        flex
        sm:space-x-3 space-x-2
        justify-center items-center
        max-w-96 w-full
        overflow-x-scroll whitespace-nowrap hidden-scrollbar
      '
      >
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

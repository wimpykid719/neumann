'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Navigation = {
  name: string
  key: string
  href: string
}

type NavigationProps = {
  navigation: Navigation[]
}

export default function Tabs(props: NavigationProps) {
  const pathname = usePathname()
  const { navigation } = props

  const getTabStyle = (href: string) => (pathname.startsWith(href) ? 'border-b-2 main-border-color' : 'text-gray-300')

  return (
    <section className=''>
      <ul className='flex'>
        {navigation.map(item => (
          <li key={item.key} className={`w-28 h-8 text-center ${getTabStyle(item.href)}`}>
            <Link href={item.href}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

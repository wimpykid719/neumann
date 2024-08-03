'use client'

import { useDarkMode } from '@/hooks/useDarkMode'
import { FetchError } from '@/lib/errors'
import { getUserAnalytics } from '@/lib/wrappedFeatch/requests/analytic'
import error from '@/text/error.json'
import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts'
import useSWR from 'swr'

export default function UsersChart() {
  const isDarkMode = useDarkMode()
  const { data } = useSWR('/api/v1/user_analytics', getUserAnalytics)

  if (!data || data instanceof FetchError) {
    return <p>{error.failedUserAnalyticsFetch}</p>
  }

  return (
    <>
      <ul className='flex justify-between'>
        <li>ユーザー数</li>
        <li>{data.user_total}</li>
      </ul>
      <ResponsiveContainer width='100%' height={112}>
        <LineChart data={data.user_analytics}>
          <YAxis reversed hide />
          <Line
            type='monotone'
            dataKey='count'
            stroke={isDarkMode ? '#F76E76' : '#FF0211'}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  )
}

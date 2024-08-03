'use client'

import { useDarkMode } from '@/hooks/useDarkMode'
import { FetchError } from '@/lib/errors'
import { ResponseAnalytic } from '@/lib/wrappedFeatch/requests/analytic'
import error from '@/text/error.json'
import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts'

type UsersChartProps = {
  data: FetchError | ResponseAnalytic
}

export default function UsersChart({ data }: UsersChartProps) {
  const isDarkMode = useDarkMode()

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

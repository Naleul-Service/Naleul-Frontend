'use client'

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartSlice } from '../types'
import { toBarChartData } from '../utils/chart'
import { FALLBACK_COLOR, formatMinutes } from '../constants'

interface Props {
  slices: ChartSlice[]
  totalMinutes: number
}

const BAR_SIZE = 24
const BAR_GAP = 14 // 막대 사이 간격 (조정 가능)
const MARGIN_TOP = 0
const MARGIN_BOTTOM = 0

export function GoalCategoryBarChart({ slices, totalMinutes }: Props) {
  const data = toBarChartData(slices)
  const chartHeight = slices.length * (BAR_SIZE + BAR_GAP) + MARGIN_TOP + MARGIN_BOTTOM

  return (
    <div className="flex flex-col">
      {/* 총 시간 */}
      <div className="flex items-baseline gap-2">
        <span className="h3 tablet:h1 desktop:h1">{formatMinutes(totalMinutes)}</span>
        <span className="label-md text-[#8FA0A8]">총 소요 시간</span>
      </div>

      <div className="flex gap-[12px] pt-[20px]">
        {/* 범례 */}
        <ul
          className="flex w-[160px] shrink-0 flex-col justify-around"
          style={{ height: chartHeight }} // 차트와 동일한 높이
        >
          {slices.map((s) => (
            <li key={s.id} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: s.colorHex || FALLBACK_COLOR }}
              />
              <span className="body-md-medium flex-1 truncate text-gray-600">{s.name}</span>
            </li>
          ))}
        </ul>

        {/* 막대 차트 */}
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={data} layout="vertical" barSize={24} margin={{ right: 52, top: 4, bottom: 4 }}>
              <XAxis type="number" hide domain={[0, 'dataMax']} />
              <YAxis type="category" dataKey="name" width={0} hide />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                formatter={(value) => [formatMinutes(value as number), '소요 시간']}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: 'none',
                  boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)',
                  padding: '6px 12px',
                }}
              />
              <Bar dataKey="value" radius={[2, 6, 6, 2]} background={{ fill: '#F4F7F8', radius: 6 }}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.fill || FALLBACK_COLOR} />
                ))}
                <LabelList
                  dataKey="percentage"
                  position="right"
                  formatter={(v) => `${v}%`}
                  style={{ fontSize: 12, fontWeight: 500, fill: '#475660' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

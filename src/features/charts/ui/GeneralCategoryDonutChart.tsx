'use client'

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { ChartSlice } from '../types'
import { toPieChartData } from '../utils/chart'
import { FALLBACK_COLOR, formatMinutes } from '../constants'

interface Props {
  slices: ChartSlice[]
  totalMinutes: number
}

export function GeneralCategoryDonutChart({ slices, totalMinutes }: Props) {
  const data = toPieChartData(slices)

  return (
    <div className="flex items-center gap-8">
      {/* 도넛 차트 */}
      <div className="relative h-[168px] w-[168px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={76}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.fill || FALLBACK_COLOR} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [formatMinutes(value), '소요 시간']}
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: 'none',
                boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)',
                padding: '6px 12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* 중앙 텍스트 */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="text-xs text-gray-400">총 시간</span>
          <span className="text-base font-bold text-gray-800">{formatMinutes(totalMinutes)}</span>
        </div>
      </div>

      {/* 범례 */}
      <ul className="flex flex-1 flex-col gap-3">
        {slices.map((s) => (
          <li key={s.id} className="flex items-center gap-2.5">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: s.colorHex || FALLBACK_COLOR }}
            />
            <span className="flex-1 truncate text-sm text-gray-600">{s.name}</span>
            <span className="text-xs text-gray-400">{formatMinutes(s.totalMinutes)}</span>
            <span className="w-10 text-right text-sm font-semibold text-gray-800">{s.percentage}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

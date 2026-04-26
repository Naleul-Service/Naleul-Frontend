'use client'

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { GoalCategoryChart } from '../types'
import { toBarChartData } from '../utils/chart'
import { FALLBACK_COLOR, formatMinutes } from '../constants'

interface Props {
  data: GoalCategoryChart[]
}

export const BAR_SIZE = 18
export const BAR_GAP = 6
export const CHART_Y_PADDING = 14

export function getChartHeight(count: number): number {
  return count * BAR_SIZE + Math.max(0, count - 1) * BAR_GAP + CHART_Y_PADDING
}

export function GoalCategoryDetailChart({ data }: Props) {
  return (
    <div className="flex flex-col divide-y divide-gray-100">
      {data.map((goal) => {
        const chartData = toBarChartData(goal.generalCategories)
        const chartHeight = getChartHeight(chartData.length)

        return (
          <div key={goal.goalCategoryId} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
            {/* 목표 카테고리 헤더 */}
            <div className="flex items-center gap-x-1">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: goal.colorHex || FALLBACK_COLOR }} />
                <span className="text-sm font-semibold text-gray-800">{goal.goalCategoryName}</span>
              </div>
              <span className="text-primary-400 label-md">{formatMinutes(goal.totalMinutes)}</span>
            </div>

            {/* 막대 차트 */}
            <div style={{ height: chartHeight }} className="w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" barSize={BAR_SIZE} margin={{ right: 52 }}>
                  <XAxis type="number" hide domain={[0, 'dataMax']} />
                  <YAxis type="category" dataKey="name" width={0} hide />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    formatter={(value) => [formatMinutes(value), '소요 시간']}
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                      border: 'none',
                      boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)',
                      padding: '6px 12px',
                    }}
                  />
                  <Bar dataKey="value" radius={[2, 6, 6, 2]} background={{ fill: '#F4F7F8', radius: 6 }}>
                    {chartData.map((entry, i) => (
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

            {/* 범례 */}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              {goal.generalCategories.map((s) => (
                <span key={s.id} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: s.colorHex || FALLBACK_COLOR }}
                  />
                  {s.name}
                  <span className="text-gray-300">·</span>
                  <span className="text-gray-400">{formatMinutes(s.totalMinutes)}</span>
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

'use client'

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { AchievementChart } from '../types'

interface Props {
  data: AchievementChart
}

const ACHIEVED_COLOR = '#0D4556' // primary-400
const UNACHIEVED_COLOR = '#F4F7F8' // gray-100

export function AchievementDonutChart({ data }: Props) {
  const chartData = [
    { name: '달성', value: data.achievedCount, fill: ACHIEVED_COLOR },
    { name: '미달성', value: data.unachievedCount, fill: UNACHIEVED_COLOR },
  ]

  // 달성 없을 때 도넛이 비면 안 되니까 방어
  const safeData = data.totalCount === 0 ? [{ name: '없음', value: 1, fill: UNACHIEVED_COLOR }] : chartData

  return (
    <div className="flex flex-col items-center justify-between">
      {/* 도넛 */}
      <section className="relative h-[196px] w-[196px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={safeData}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={76}
              paddingAngle={data.totalCount === 0 ? 0 : 3}
              dataKey="value"
              strokeWidth={0}
              startAngle={90}
              endAngle={-270}
            >
              {safeData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* 중앙 달성률 */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span className="label-sm text-[#8FA0A8]">달성률</span>
          <span className="h3 text-gray-800">{data.achievementRate}%</span>
        </div>
      </section>

      {/* 통계 */}
      <section className="flex w-full flex-1 flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ACHIEVED_COLOR }} />
            <span className="label-md text-gray-500">달성</span>
            <span className="label-md text-primary-500 ml-auto">{data.achievedCount}개</span>
          </div>
          <div className="h-[8px] w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-[#0D4556] transition-all duration-500"
              style={{ width: `${data.achievementRate}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
            <span className="label-md text-gray-500">미달성</span>
            <span className="label-md text-primary-500 ml-auto">{data.unachievedCount}개</span>
          </div>
          <div className="h-[8px] w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gray-200 transition-all duration-500"
              style={{ width: `${100 - data.achievementRate}%` }}
            />
          </div>
        </div>
      </section>
    </div>
  )
}

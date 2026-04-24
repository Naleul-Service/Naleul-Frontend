'use client'

import { TaskActualItem } from '../types'
import { utcIsoToKstTimeLabel } from '@/src/lib/datetime'
import Badge from '@/src/components/common/Badge'
import { CheckIcon, TimeIcon } from '@/src/assets/svgComponents'

export function ActualTaskItem({ actual }: { actual: TaskActualItem }) {
  return (
    <li className="group flex flex-col gap-y-1 rounded-[10px] border border-gray-100 px-3 py-[10px]">
      {/* 상단 행: 체크 + 이름 */}
      <div className="flex items-center gap-x-[10px]">
        <CheckIcon width={20} height={20} />
        <p className="body-md-medium min-w-0 flex-1 text-gray-500">{actual.taskName}</p>
      </div>

      {/* 하단 행: 상세 정보 */}
      <div className="ml-8 flex flex-wrap items-center gap-[6px]">
        {actual.goalCategoryName && (
          <Badge
            textColor={actual.goalCategoryColorCode}
            bgColor={actual.goalCategoryColorCode}
            type="DOT"
            botColor={actual.goalCategoryColorCode}
          >
            {actual.goalCategoryName}
          </Badge>
        )}

        {actual.generalCategoryName && (
          <Badge
            textColor={actual.generalCategoryColorCode}
            bgColor={actual.generalCategoryColorCode}
            type="DOT"
            botColor={actual.generalCategoryColorCode}
          >
            {actual.generalCategoryName}
          </Badge>
        )}

        <div className="caption-md flex items-center text-[#34C759]">
          <TimeIcon width={24} height={24} />
          {utcIsoToKstTimeLabel(actual.actualStartAt)} ~ {utcIsoToKstTimeLabel(actual.actualEndAt)}
          {actual.actualDurationMinutes != null && <span className="ml-1">({actual.actualDurationMinutes}분)</span>}
        </div>
      </div>
    </li>
  )
}

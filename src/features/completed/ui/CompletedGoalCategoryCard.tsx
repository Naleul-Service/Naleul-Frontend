import { CompletedGoalCategory } from '../types'
import { formatMinutes } from '@/src/features/charts/constants'

interface Props {
  item: CompletedGoalCategory
}

export function CompletedGoalCategoryCard({ item }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-[0_2px_16px_0_rgba(0,0,0,0.06)]">
      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-base font-semibold text-gray-800">{item.goalCategoryName}</span>
          <span className="text-xs text-gray-400">{item.durationDays}일 동안 진행</span>
        </div>
        <span className="bg-primary-50 text-primary-400 rounded-full px-2.5 py-1 text-xs font-medium">완료</span>
      </div>

      {/* 회고 */}
      {item.achievement && (
        <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-600">{item.achievement}</p>
      )}

      {/* 통계 */}
      <div className="flex gap-3">
        <div className="flex flex-1 flex-col items-center gap-0.5 rounded-xl bg-gray-50 py-3">
          <span className="text-base font-bold text-gray-800">{formatMinutes(item.totalActualMinutes)}</span>
          <span className="text-xs text-gray-400">총 소요 시간</span>
        </div>
        <div className="flex flex-1 flex-col items-center gap-0.5 rounded-xl bg-gray-50 py-3">
          <span className="text-base font-bold text-gray-800">{item.taskCount}개</span>
          <span className="text-xs text-gray-400">완료 Task</span>
        </div>
        <div className="flex flex-1 flex-col items-center gap-0.5 rounded-xl bg-gray-50 py-3">
          <span className="text-base font-bold text-gray-800">{item.durationDays}일</span>
          <span className="text-xs text-gray-400">진행 기간</span>
        </div>
      </div>
    </div>
  )
}

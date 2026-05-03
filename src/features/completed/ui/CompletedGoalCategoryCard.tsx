import { CompletedGoalCategory } from '../types'
import { formatMinutes } from '@/src/features/charts/constants'

interface Props {
  item: CompletedGoalCategory
}

export function CompletedGoalCategoryCard({ item }: Props) {
  return (
    <div className="desktop:p-6 flex items-start gap-x-[20px] rounded-[12px] border border-gray-100 bg-white p-4">
      <div className="mt-3 h-[12px] w-[12px] rounded-full" style={{ backgroundColor: item.colorCode }} />
      <section className="flex w-full flex-col gap-3">
        {/* 헤더 */}
        <section className="flex flex-col">
          <span className="h4">{item.goalCategoryName}</span>
          <div className="flex items-center gap-x-1">
            <span className="label-md text-[#8FA0A8]">
              {item.startDate} → {item.endDate}
            </span>
            <span className="label-sm text-[#8FA0A8]">· {item.durationDays}일 동안 진행</span>
          </div>
        </section>

        {/* 달성 내용 */}
        {item.achievement && <p className="body-md text-gray-500">{item.achievement}</p>}

        {/* 일반 카테고리 */}
        <div className="flex flex-col gap-y-2">
          {item.generalCategories.map((generalCategory) => (
            <div
              className="label-lg rounded-[4px] border-l-[6px] bg-gray-50 px-4 py-2"
              key={generalCategory.generalCategoryId}
              // style 속성을 사용하여 컬러 코드를 직접 주입합니다.
              style={{ borderLeftColor: generalCategory.colorCode }}
            >
              {generalCategory.generalCategoryName}
            </div>
          ))}
        </div>

        {/* 통계 */}
        <div className="flex gap-3">
          <div className="flex flex-1 flex-col items-start gap-2 rounded-[8px] border border-gray-100 p-4">
            <span className="label-sm text-gray-300">소요 시간</span>
            <span className="h3 text-primary-600">{formatMinutes(item.totalActualMinutes)}</span>
          </div>
          <div className="flex flex-1 flex-col items-start gap-2 rounded-[8px] border border-gray-100 p-4">
            <span className="label-sm text-gray-300">완료 Task</span>
            <span className="h3 text-primary-600">{item.taskCount}개</span>
          </div>
          <div className="flex flex-1 flex-col items-start gap-2 rounded-[8px] border border-gray-100 p-4">
            <span className="label-sm text-gray-300">진행 기간</span>
            <span className="h3 text-primary-600">{item.durationDays}일</span>
          </div>
        </div>
      </section>
    </div>
  )
}

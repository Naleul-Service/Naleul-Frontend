// ScheduleHeader.tsx — ScheduleHeader 부분만 교체

// ─── MobileTabToggle (모바일 전용 아이콘 탭) ──────────────────────────────────
// DayPageContent의 mobileTab 상태를 ScheduleHeader에서도 제어해야 하므로
// Context에 mobileTab 추가 필요 (아래 Context 수정 참고)

import { useScheduleHeader } from '@/src/features/schedule/context/ScheduleHeaderContext'
import {
  SelectedScheduleIcon,
  SelectedTaskIcon,
  UnselectedScheduleIcon,
  UnselectedTaskIcon,
} from '@/src/assets/svgComponents'
import { CalendarPopover } from '@/src/features/schedule/components/CalendarPopover'
import { Button } from '@/src/components/common/Button'
import { cn } from '@/src/lib/utils'
import { ScheduleTabBar } from '@/src/features/schedule/components/ScheduleTabBar'
import { TaskFilterPopover } from '@/src/features/schedule/day/components/TaskFilterPopover'
import { Plus } from 'lucide-react'

type MobileTab = 'schedule' | 'timeline'

const MOBILE_ICON_TABS: {
  key: MobileTab
  label: string
  SelectedIcon: React.FC<React.SVGProps<SVGSVGElement>>
  UnselectedIcon: React.FC<React.SVGProps<SVGSVGElement>>
}[] = [
  {
    key: 'schedule',
    label: '일정',
    SelectedIcon: SelectedTaskIcon,
    UnselectedIcon: UnselectedTaskIcon,
  },
  {
    key: 'timeline',
    label: '타임라인',
    SelectedIcon: SelectedScheduleIcon,
    UnselectedIcon: UnselectedScheduleIcon,
  },
]

function MobileIconTabBar() {
  const { mobileTab, setMobileTab } = useScheduleHeader()

  return (
    <div className="tablet:hidden flex w-fit gap-x-1 rounded-[8px] bg-gray-50 p-1">
      {MOBILE_ICON_TABS.map(({ key, label, SelectedIcon, UnselectedIcon }) => {
        const isActive = mobileTab === key
        const Icon = isActive ? SelectedIcon : UnselectedIcon

        return (
          <button
            key={key}
            type="button"
            aria-label={label}
            aria-pressed={isActive}
            onClick={() => setMobileTab(key)}
            className={cn(
              'flex h-[32px] w-[32px] items-center justify-center rounded-[6px] transition-colors',
              isActive ? 'bg-white shadow-sm' : 'bg-transparent'
            )}
          >
            <Icon width={20} height={20} />
          </button>
        )
      })}
    </div>
  )
}

// ─── ScheduleHeader ───────────────────────────────────────────────────────────
export function ScheduleHeader() {
  const { filter, goalCategories, setPriority, setGoalCategory, setGeneralCategory, openAddTask, openAddTaskActual } =
    useScheduleHeader()

  const filterPopover = (
    <TaskFilterPopover
      filter={filter}
      goalCategories={goalCategories}
      onPriorityChange={setPriority}
      onGoalCategoryChange={setGoalCategory}
      onGeneralCategoryChange={setGeneralCategory}
    />
  )

  return (
    <div className="tablet:flex-row tablet:items-center tablet:justify-between flex w-full flex-col gap-y-3">
      {/* ── 좌측: TabBar (태블릿 이상은 Filter도 함께) ── */}
      <div className="flex shrink-0 items-center gap-x-2">
        <ScheduleTabBar />
        <div className="tablet:block hidden">{filterPopover}</div>
      </div>

      {/* ── 모바일 전용 우측: CalendarPopover / MobileIconTabBar + Filter ── */}
      <div className="tablet:hidden flex w-full items-center justify-between">
        <CalendarPopover />
        <div className="flex items-center gap-x-2">
          <MobileIconTabBar />
          {filterPopover}
        </div>
      </div>

      {/* ── 태블릿 전용 우측: CalendarPopover만 ── */}
      <div className="tablet:flex desktop:hidden hidden items-center">
        <CalendarPopover />
      </div>

      {/* ── 데스크탑 전용 우측: CalendarPopover + 버튼들 ── */}
      <div className="desktop:flex hidden items-center gap-x-3">
        <CalendarPopover />
        <Button size="md" variant="secondary" leftIcon={<Plus size={16} />} onClick={openAddTaskActual}>
          실행 완료 추가
        </Button>
        <Button size="md" leftIcon={<Plus size={16} />} onClick={openAddTask}>
          할 일 추가
        </Button>
      </div>
    </div>
  )
}

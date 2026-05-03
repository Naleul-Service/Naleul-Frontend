'use client'

import { useSearchParams } from 'next/navigation'
import { DayTaskList } from '@/src/features/schedule/day/components/DayTaskList'
import { DailyTimeTable } from '@/src/features/schedule/day/components/DailyTimeTable'
import { parseDateParam, toDateString } from '@/src/features/schedule/day/utils/day'
import { useScheduleHeader } from '@/src/features/schedule/context/ScheduleHeaderContext'
import {
  SelectedScheduleIcon,
  SelectedTaskIcon,
  UnselectedScheduleIcon,
  UnselectedTaskIcon,
} from '@/src/assets/svgComponents'
import { TabletTabBar } from '@/src/features/schedule/components/TabletTabBar'

// ─── Types ────────────────────────────────────────────────────────────────────

type MobileTab = 'schedule' | 'timeline'

// ─── 탭 설정 ──────────────────────────────────────────────────────────────────

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

const TABLET_TEXT_TABS: { key: MobileTab; label: string }[] = [
  { key: 'schedule', label: '일정' },
  { key: 'timeline', label: '타임라인' },
]

// ─── DayPageContent ───────────────────────────────────────────────────────────

export function DayPageContent() {
  const searchParams = useSearchParams()
  const selectedDate = parseDateParam(searchParams.get('date'))
  const dateString = toDateString(selectedDate)

  const { filter, mobileTab, setMobileTab } = useScheduleHeader() // mobileTab을 context에서

  const tableParams = { date: dateString }

  return (
    <main className="flex flex-col gap-4">
      {/* 태블릿 텍스트 탭 — tablet에서만 노출 */}
      <TabletTabBar activeTab={mobileTab} onChange={setMobileTab} />

      {/* 데스크탑 — 2컬럼 */}
      <div
        className="tablet:hidden desktop:grid hidden w-full gap-x-[32px] overflow-y-auto px-1"
        style={{
          maxHeight: 'calc(100svh - 120px)',
          gridTemplateColumns: '2fr 3fr',
        }}
      >
        <div className="min-w-0">
          <DayTaskList filter={filter} date={selectedDate} />
        </div>
        <div className="min-w-0">
          <DailyTimeTable params={tableParams} />
        </div>
      </div>

      {/* 모바일/태블릿 — 탭별 단일 컬럼 */}
      <div className="desktop:hidden">
        {mobileTab === 'schedule' && <DayTaskList filter={filter} date={selectedDate} />}
        {mobileTab === 'timeline' && <DailyTimeTable params={tableParams} />}
      </div>
    </main>
  )
}

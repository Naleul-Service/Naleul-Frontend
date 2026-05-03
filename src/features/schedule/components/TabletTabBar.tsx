// @/src/features/schedule/components/TabletTabBar.tsx
'use client'

import { cn } from '@/src/lib/utils'
import { MobileTab } from '@/src/features/schedule/context/ScheduleHeaderContext'

const TABLET_TEXT_TABS: { key: MobileTab; label: string }[] = [
  { key: 'schedule', label: '일정' },
  { key: 'timeline', label: '타임라인' },
]

interface TabletTabBarProps {
  activeTab: MobileTab
  onChange: (tab: MobileTab) => void
}

export function TabletTabBar({ activeTab, onChange }: TabletTabBarProps) {
  return (
    <div className="tablet:flex desktop:hidden hidden border-b border-gray-100">
      {TABLET_TEXT_TABS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={cn(
            'flex-1 pb-2 text-sm font-medium transition-colors',
            activeTab === key ? 'border-b-2 border-gray-700 text-gray-700' : 'text-gray-400 hover:text-gray-500'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

import { ScheduleTabBarContainer } from '@/src/features/schedule/components/ScheduleTabBarContainer'
import { CalendarPopover } from '@/src/features/schedule/components/CalendarPopover'

export default function ScheduleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <ScheduleTabBarContainer />
        </div>
        <CalendarPopover />
      </div>
      {children}
    </div>
  )
}

import Link from 'next/link'
import { SCHEDULE_TABS } from '@/src/features/schedule/constants'

interface ScheduleTabBarProps {
  currentPath: string
}

export function ScheduleTabBar({ currentPath }: ScheduleTabBarProps) {
  return (
    <nav className="flex w-[300px] gap-1 rounded-lg bg-gray-100 p-1">
      {SCHEDULE_TABS.map(({ label, href }) => {
        const isActive = currentPath.startsWith(href)

        return (
          <Link
            key={href}
            href={href}
            className={[
              'flex-1 rounded-md px-4 py-1.5 text-center text-sm font-medium transition-colors',
              isActive ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700',
            ].join(' ')}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

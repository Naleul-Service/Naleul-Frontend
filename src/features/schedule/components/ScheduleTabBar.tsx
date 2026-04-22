import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SCHEDULE_TABS } from '@/src/features/schedule/constants'

export function ScheduleTabBar() {
  const pathname = usePathname() // 쿼리스트링 없는 순수 pathname

  return (
    <nav className="flex w-[300px] gap-1 rounded-lg bg-gray-100 p-1">
      {SCHEDULE_TABS.map(({ label, href, pathname: tabPathname, ...rest }) => {
        const isActive = pathname === tabPathname // exact match
        const resolvedHref = 'getHref' in rest ? rest.getHref() : href

        return (
          <Link
            key={href}
            href={resolvedHref}
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

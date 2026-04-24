import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SCHEDULE_TABS } from '@/src/features/schedule/constants'

export function ScheduleTabBar() {
  const pathname = usePathname() // 쿼리스트링 없는 순수 pathname

  return (
    <nav className="label-md flex w-[193px] gap-1 rounded-[8px] bg-gray-50 px-[6px] py-[5px] text-gray-300">
      {SCHEDULE_TABS.map(({ label, href, pathname: tabPathname, ...rest }) => {
        const isActive = pathname === tabPathname // exact match
        const resolvedHref = 'getHref' in rest ? rest.getHref() : href

        return (
          <Link
            key={href}
            href={resolvedHref}
            className={[
              'flex-1 rounded-md px-4 py-1.5 text-center transition-colors',
              isActive ? 'bg-white text-gray-950 shadow-sm' : 'bg-gray-50 hover:text-gray-300',
            ].join(' ')}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

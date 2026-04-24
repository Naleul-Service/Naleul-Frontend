import { ReactElement } from 'react'

export interface NavItem {
  key: string
  label: string
  href: string
  selectedIcon: ReactElement
  unselectedIcon: ReactElement
  badge?: number | null
  getHref?: () => string // 동적 href가 필요한 경우에만
}

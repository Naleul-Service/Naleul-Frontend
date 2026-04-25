// app/schedule/layout.tsx — 서버 컴포넌트
import type { Metadata } from 'next'
import SchedulePageLayout from '@/src/features/schedule/day/components/SchedulePageLayout'

export const metadata: Metadata = {
  title: '일정 | 나를(Naleul)',
  description: '나의 일정을 관리해요',
}

export default function ScheduleLayout({ children }: { children: React.ReactNode }) {
  return <SchedulePageLayout>{children}</SchedulePageLayout>
}

// app/schedule/layout.tsx — 서버 컴포넌트
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '회고 | 나를(Naleul)',
  description: '나의 목표를 생성해요.',
}

export default function GoalLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

'use client'

import { ChartSection } from '@/src/features/charts/ui/ChartSection'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  return (
    <main>
      <ChartSection />
    </main>
  )
}

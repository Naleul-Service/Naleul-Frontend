'use client'

import { Button } from '@/src/components/common/Button'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  return (
    <main className="pl-[80px]">
      <Button
        onClick={() => {
          router.push('/category')
        }}
        variant={'outline'}
      >
        카테고리 설정
      </Button>
    </main>
  )
}

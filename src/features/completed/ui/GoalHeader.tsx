'use client'

import PageHeader from '@/src/components/layout/PageHeader'
import { Button } from '@/src/components/common/Button'
import { PlusIcon } from 'lucide-react'

export default function GoalHeader() {
  return (
    <PageHeader
      title="목표 달성"
      subtitle="지금까지 달성한 목표를 모아보아요"
      rightElement={
        <Button leftIcon={<PlusIcon size={14} />} variant={'primary'} size={'md'}>
          할 일 추가
        </Button>
      }
    />
  )
}

'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/src/components/common/Button'
import { useGoalCategories } from '@/src/features/category/hooks/useGoalCategories'
import PageHeader from '@/src/components/layout/PageHeader'
import PageLayout from '@/src/components/layout/PageLayout'
import EmptyCategory from '@/src/features/category/ui/EmptyCategory'
import { GoalCategoryList } from '@/src/features/category/ui/GoalCategoryList'
import { GoalCategoryModal } from '@/src/features/category/ui/modal/GoalCategoryModal'

export default function CategoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: categories = [] } = useGoalCategories()

  return (
    <PageLayout customClassName={'gap-y-6 mb-[40px]'}>
      <PageHeader
        title={'목표 관리'}
        subtitle="목표와 세부 목표를 관리해요"
        rightElement={
          <Button leftIcon={<Plus size={15} />} onClick={() => setIsModalOpen(true)}>
            <span className="tablet:block desktop:block hidden">목표 카테고리 추가</span>
            <span className="tablet:hidden desktop:hidden block">목표 추가</span>
          </Button>
        }
      />

      {categories.length === 0 ? (
        <EmptyCategory
          title="아직 목표 카테고리가 없어요."
          description="+ 목표 카테고리 추가 버튼을 눌러 시작해보세요."
        />
      ) : (
        <GoalCategoryList />
      )}

      <GoalCategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </PageLayout>
  )
}

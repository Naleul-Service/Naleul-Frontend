'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/src/components/common/Button'
import { GoalCategoryModal } from '@/src/features/category/components/GoalCategoryModal'
import { GoalCategoryList } from '@/src/features/category/components/GoalCategoryList'
import { useGoalCategories } from '@/src/features/category/hooks/useGoalCategories'

export default function CategoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: categories = [] } = useGoalCategories()

  return (
    <main className="flex-1 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-base font-medium">카테고리 관리</h1>
          <p className="text-muted-foreground mt-0.5 text-xs">목표와 일반 카테고리를 관리해요</p>
        </div>
        <Button leftIcon={<Plus size={15} />} onClick={() => setIsModalOpen(true)}>
          목표 카테고리 추가
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="border-border rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground text-sm">카테고리를 추가해 보세요</p>
        </div>
      ) : (
        <GoalCategoryList />
      )}

      <GoalCategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  )
}

'use client'

import { closestCenter, DndContext, DragOverlay } from '@dnd-kit/core'
import { useGoalCategories } from '@/src/features/category/hooks/useGoalCategories'
import { useDeleteGoalCategory } from '@/src/features/category/hooks/useGoalCategoryMutations'
import { useDeleteGeneralCategory } from '@/src/features/category/hooks/useGeneralCategoryMutations'
import { useGoalCategoryModals } from '@/src/features/category/hooks/useGoalCategoryModals'
import { useGoalCategoryDnd } from '@/src/features/category/hooks/useGoalCategoryDnd'
import { GeneralCategoryItemType, GoalCategory } from '@/src/features/category/api/goalCategory'
import { GeneralCategoryEditModal } from '@/src/features/category/ui/modal/GeneralCategoryEditModal'
import { GoalCategoryCompleteModal } from '@/src/features/category/ui/modal/GoalCategoryCompleteModal'
import { GoalCategoryEditModal } from '@/src/features/category/ui/modal/GoalCategoryEditModal'
import { GeneralCategoryModal } from '@/src/features/category/ui/modal/GeneralCategoryModal'
import GeneralCategoryItemOverlay from '@/src/features/category/ui/overlay/GeneralCategoryItemOverlay'
import GoalCategoryItem from '@/src/features/category/ui/GoalCategoryItem'
import GoalCategoryListSkeleton from '@/src/features/category/ui/skeleton/GoalCategoryListSkeleton'

export function GoalCategoryList() {
  const { data: categories = [], isLoading, isError } = useGoalCategories()
  const { mutate: deleteGoalCategory } = useDeleteGoalCategory()
  const { mutate: deleteGeneralCategory } = useDeleteGeneralCategory()

  const { goalModal, openGoalModal, closeGoalModal, generalEditModal, openGeneralEditModal, closeGeneralEditModal } =
    useGoalCategoryModals()

  const {
    sensors,
    activeItem,
    openMenuId,
    setOpenMenuId,
    openGeneralMenuId,
    setOpenGeneralMenuId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useGoalCategoryDnd(categories)

  if (isLoading) return <GoalCategoryListSkeleton />
  if (isError) return <p className="text-xs text-red-500">카테고리를 불러오지 못했어요</p>
  if (categories.length === 0) return null

  function handleDeleteGoalCategory(category: GoalCategory) {
    if (!confirm(`"${category.goalCategoryName}" 목표를 삭제할까요?\n하위 일반 카테고리도 함께 삭제돼요.`)) return
    deleteGoalCategory(category.goalCategoryId)
  }

  function handleDeleteGeneralCategory(item: GeneralCategoryItemType) {
    if (!confirm(`"${item.generalCategoryName}" 카테고리를 삭제할까요?`)) return
    deleteGeneralCategory(item.generalCategoryId)
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col gap-3">
          {categories.map((category) => (
            <GoalCategoryItem
              key={category.goalCategoryId}
              category={category}
              isMenuOpen={openMenuId === category.goalCategoryId}
              onMenuToggle={() =>
                setOpenMenuId((prev) => (prev === category.goalCategoryId ? null : category.goalCategoryId))
              }
              onMenuClose={() => setOpenMenuId(null)}
              onAddGeneral={() => openGoalModal('addGeneral', category)}
              onEdit={() => openGoalModal('editGoal', category)}
              onComplete={() => openGoalModal('complete', category)}
              onDelete={() => handleDeleteGoalCategory(category)}
              openGeneralMenuId={openGeneralMenuId}
              onGeneralMenuToggle={(id) => setOpenGeneralMenuId((prev) => (prev === id ? null : id))}
              onGeneralMenuClose={() => setOpenGeneralMenuId(null)}
              onEditGeneral={(item) => openGeneralEditModal(item, category)}
              onDeleteGeneral={handleDeleteGeneralCategory}
            />
          ))}
        </div>

        <DragOverlay>{activeItem && <GeneralCategoryItemOverlay item={activeItem} />}</DragOverlay>
      </DndContext>

      {goalModal.type === 'addGeneral' && goalModal.category && (
        <GeneralCategoryModal isOpen onClose={closeGoalModal} goalCategory={goalModal.category} />
      )}
      {goalModal.type === 'editGoal' && goalModal.category && (
        <GoalCategoryEditModal isOpen onClose={closeGoalModal} category={goalModal.category} />
      )}
      {goalModal.type === 'complete' && goalModal.category && (
        <GoalCategoryCompleteModal isOpen onClose={closeGoalModal} category={goalModal.category} />
      )}
      {generalEditModal.item && generalEditModal.goalCategory && (
        <GeneralCategoryEditModal
          isOpen
          onClose={closeGeneralEditModal}
          item={generalEditModal.item}
          goalCategory={generalEditModal.goalCategory}
        />
      )}
    </>
  )
}

import { useRef, useState } from 'react'
import { DragEndEvent, DragOverEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useQueryClient } from '@tanstack/react-query'
import { useUpdateGeneralCategories } from '@/src/features/category/hooks/useGoalCategories'
import { GeneralCategoryItemType, GoalCategory } from '@/src/features/category/api/goalCategory'

const parseGoalCategoryId = (id: string | number): number | null => {
  const str = String(id)
  if (str.startsWith('droppable-')) return Number(str.replace('droppable-', ''))
  return null
}

function resolveOverGoalCategoryId(cats: GoalCategory[], overId: string | number): number | null {
  const fromDroppable = parseGoalCategoryId(overId)
  if (fromDroppable !== null) return fromDroppable
  const found = cats.find((cat) => cat.generalCategories.some((g) => g.generalCategoryId === Number(overId)))
  return found?.goalCategoryId ?? null
}

export function useGoalCategoryDnd(categories: GoalCategory[]) {
  const queryClient = useQueryClient()
  const { mutate: updateGeneralCategories } = useUpdateGeneralCategories()

  const [activeItem, setActiveItem] = useState<GeneralCategoryItemType | null>(null)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [openGeneralMenuId, setOpenGeneralMenuId] = useState<number | null>(null)

  const originGoalCategoryIdRef = useRef<number | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const getSnapshot = () => queryClient.getQueryData<GoalCategory[]>(['goal-categories']) ?? []

  function handleDragStart(event: DragStartEvent) {
    setOpenMenuId(null)
    setOpenGeneralMenuId(null)

    const activeId = Number(event.active.id)
    const container = categories.find((cat) => cat.generalCategories.some((g) => g.generalCategoryId === activeId))
    originGoalCategoryIdRef.current = container?.goalCategoryId ?? null
    setActiveItem(container?.generalCategories.find((g) => g.generalCategoryId === activeId) ?? null)
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeId = Number(active.id)
    const snapshot = getSnapshot()
    const activeGoalCategoryId = originGoalCategoryIdRef.current
    if (!activeGoalCategoryId) return

    const overGoalCategoryId = resolveOverGoalCategoryId(snapshot, over.id)
    if (!overGoalCategoryId || activeGoalCategoryId === overGoalCategoryId) return

    queryClient.setQueryData<GoalCategory[]>(['goal-categories'], (prev) => {
      if (!prev) return prev
      const activeContainer = prev.find((c) => c.goalCategoryId === activeGoalCategoryId)
      const movingItem = activeContainer?.generalCategories.find((g) => g.generalCategoryId === activeId)
      if (!movingItem) return prev

      return prev.map((cat) => {
        if (cat.goalCategoryId === activeGoalCategoryId) {
          return { ...cat, generalCategories: cat.generalCategories.filter((g) => g.generalCategoryId !== activeId) }
        }
        if (cat.goalCategoryId === overGoalCategoryId) {
          return { ...cat, generalCategories: [...cat.generalCategories, movingItem] }
        }
        return cat
      })
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveItem(null)

    if (!over) {
      queryClient.invalidateQueries({ queryKey: ['goal-categories'] })
      originGoalCategoryIdRef.current = null
      return
    }

    const activeId = Number(active.id)
    const originGoalCategoryId = originGoalCategoryIdRef.current
    originGoalCategoryIdRef.current = null
    if (!originGoalCategoryId) return

    const snapshot = getSnapshot()
    const overGoalCategoryId = resolveOverGoalCategoryId(snapshot, over.id)
    if (!overGoalCategoryId) return

    const originContainer = snapshot.find((c) => c.goalCategoryId === originGoalCategoryId)
    const overContainer = snapshot.find((c) => c.goalCategoryId === overGoalCategoryId)
    if (!originContainer || !overContainer) return

    if (originGoalCategoryId === overGoalCategoryId) {
      const oldIndex = overContainer.generalCategories.findIndex((g) => g.generalCategoryId === activeId)
      const newIndex = overContainer.generalCategories.findIndex((g) => g.generalCategoryId === Number(over.id))
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return

      const reordered = arrayMove(overContainer.generalCategories, oldIndex, newIndex)
      queryClient.setQueryData<GoalCategory[]>(['goal-categories'], (prev) =>
        prev?.map((cat) => (cat.goalCategoryId === overGoalCategoryId ? { ...cat, generalCategories: reordered } : cat))
      )
      updateGeneralCategories({
        goalCategoryId: overGoalCategoryId,
        generalCategoryIds: reordered.map((g) => g.generalCategoryId),
      })
    } else {
      const originIds = originContainer.generalCategories
        .filter((g) => g.generalCategoryId !== activeId)
        .map((g) => g.generalCategoryId)
      const overIds = overContainer.generalCategories.map((g) => g.generalCategoryId)

      updateGeneralCategories({ goalCategoryId: originGoalCategoryId, generalCategoryIds: originIds })
      updateGeneralCategories({ goalCategoryId: overGoalCategoryId, generalCategoryIds: overIds })
    }
  }

  return {
    sensors,
    activeItem,
    openMenuId,
    setOpenMenuId,
    openGeneralMenuId,
    setOpenGeneralMenuId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  }
}

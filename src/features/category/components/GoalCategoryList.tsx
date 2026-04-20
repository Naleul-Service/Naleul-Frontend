'use client'

import { useRef, useState } from 'react'
import { GripVertical, Plus } from 'lucide-react'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useQueryClient } from '@tanstack/react-query'
import { useGoalCategories, useUpdateGeneralCategories } from '@/src/features/category/hooks/useGoalCategories'
import { GeneralCategoryItemType, GoalCategory } from '@/src/features/category/api/goalCategory'
import { GeneralCategoryModal } from './GeneralCategoryModal'
import { cn } from '@/src/lib/utils'

const STATUS_LABEL: Record<string, string> = {
  NOT_STARTED: '시작 전',
  IN_PROGRESS: '진행 중',
  COMPLETED: '완료',
}

const toDroppableId = (goalCategoryId: number) => `droppable-${goalCategoryId}`

const parseGoalCategoryId = (id: string | number): number | null => {
  const str = String(id)
  if (str.startsWith('droppable-')) return Number(str.replace('droppable-', ''))
  return null
}

// over.id에서 goalCategoryId 추출
function resolveOverGoalCategoryId(cats: GoalCategory[], overId: string | number): number | null {
  // droppable 영역
  const fromDroppable = parseGoalCategoryId(overId)
  if (fromDroppable !== null) return fromDroppable

  // generalCategoryId로 소속 찾기
  const found = cats.find((cat) => cat.generalCategories.some((g) => g.generalCategoryId === Number(overId)))
  return found?.goalCategoryId ?? null
}

export function GoalCategoryList() {
  const { data: categories = [], isLoading, isError } = useGoalCategories()
  const { mutate: updateGeneralCategories } = useUpdateGeneralCategories()
  const queryClient = useQueryClient()

  const [selectedGoalCategory, setSelectedGoalCategory] = useState<GoalCategory | null>(null)
  const [activeItem, setActiveItem] = useState<GeneralCategoryItemType | null>(null)

  // 드래그 시작 시점 원본 컨테이너 id 보존
  const originGoalCategoryIdRef = useRef<number | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const getSnapshot = () => queryClient.getQueryData<GoalCategory[]>(['goal-categories']) ?? []

  if (isLoading) return <GoalCategoryListSkeleton />
  if (isError) return <p className="text-xs text-red-500">카테고리를 불러오지 못했어요</p>
  if (categories.length === 0) return null

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = Number(event.active.id)
    const container = categories.find((cat) => cat.generalCategories.some((g) => g.generalCategoryId === activeId))
    originGoalCategoryIdRef.current = container?.goalCategoryId ?? null
    const item = container?.generalCategories.find((g) => g.generalCategoryId === activeId)
    setActiveItem(item ?? null)
  }

  // 컨테이너 간 이동 시 UI 즉시 반영 (optimistic)
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = Number(active.id)
    const snapshot = getSnapshot()

    const activeGoalCategoryId = originGoalCategoryIdRef.current
    if (!activeGoalCategoryId) return

    const overGoalCategoryId = resolveOverGoalCategoryId(snapshot, over.id)
    if (!overGoalCategoryId) return
    if (activeGoalCategoryId === overGoalCategoryId) return

    queryClient.setQueryData<GoalCategory[]>(['goal-categories'], (prev) => {
      if (!prev) return prev

      const activeContainer = prev.find((c) => c.goalCategoryId === activeGoalCategoryId)
      if (!activeContainer) return prev

      const movingItem = activeContainer.generalCategories.find((g) => g.generalCategoryId === activeId)
      if (!movingItem) return prev

      return prev.map((cat) => {
        if (cat.goalCategoryId === activeGoalCategoryId) {
          return {
            ...cat,
            generalCategories: cat.generalCategories.filter((g) => g.generalCategoryId !== activeId),
          }
        }
        if (cat.goalCategoryId === overGoalCategoryId) {
          return {
            ...cat,
            generalCategories: [...cat.generalCategories, movingItem],
          }
        }
        return cat
      })
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveItem(null)

    if (!over) {
      // 드롭 취소 — 원복
      queryClient.invalidateQueries({ queryKey: ['goal-categories'] })
      originGoalCategoryIdRef.current = null
      return
    }

    const activeId = Number(active.id)
    const originGoalCategoryId = originGoalCategoryIdRef.current
    originGoalCategoryIdRef.current = null

    if (!originGoalCategoryId) return

    const snapshot = getSnapshot()

    const originContainer = snapshot.find((c) => c.goalCategoryId === originGoalCategoryId)
    if (!originContainer) return

    const overGoalCategoryId = resolveOverGoalCategoryId(snapshot, over.id)
    if (!overGoalCategoryId) return

    const overContainer = snapshot.find((c) => c.goalCategoryId === overGoalCategoryId)
    if (!overContainer) return

    if (originGoalCategoryId === overGoalCategoryId) {
      // 같은 컨테이너 내 순서 변경
      const oldIndex = overContainer.generalCategories.findIndex((g) => g.generalCategoryId === activeId)
      const newIndex = overContainer.generalCategories.findIndex((g) => g.generalCategoryId === Number(over.id))

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return

      const reordered = arrayMove(overContainer.generalCategories, oldIndex, newIndex)

      // 캐시 업데이트
      queryClient.setQueryData<GoalCategory[]>(['goal-categories'], (prev) =>
        prev?.map((cat) => (cat.goalCategoryId === overGoalCategoryId ? { ...cat, generalCategories: reordered } : cat))
      )

      // PATCH 요청
      console.log(
        'PATCH 순서변경:',
        overGoalCategoryId,
        reordered.map((g) => g.generalCategoryId)
      )
      updateGeneralCategories({
        goalCategoryId: overGoalCategoryId,
        generalCategoryIds: reordered.map((g) => g.generalCategoryId),
      })
    } else {
      // 다른 컨테이너로 이동 — handleDragOver에서 캐시는 이미 반영됨
      // origin 컨테이너: 이동한 아이템 제외한 ids
      const originIds = originContainer.generalCategories
        .filter((g) => g.generalCategoryId !== activeId)
        .map((g) => g.generalCategoryId)

      // over 컨테이너: 현재 캐시 기준 ids (이미 movingItem 포함)
      const overIds = overContainer.generalCategories.map((g) => g.generalCategoryId)

      console.log('PATCH 컨테이너이동 origin:', originGoalCategoryId, originIds)
      console.log('PATCH 컨테이너이동 over:', overGoalCategoryId, overIds)

      updateGeneralCategories({
        goalCategoryId: originGoalCategoryId,
        generalCategoryIds: originIds,
      })
      updateGeneralCategories({
        goalCategoryId: overGoalCategoryId,
        generalCategoryIds: overIds,
      })
    }
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
              onAddGeneral={() => setSelectedGoalCategory(category)}
            />
          ))}
        </div>

        <DragOverlay>{activeItem && <GeneralCategoryItemOverlay item={activeItem} />}</DragOverlay>
      </DndContext>

      {selectedGoalCategory && (
        <GeneralCategoryModal
          isOpen={!!selectedGoalCategory}
          onClose={() => setSelectedGoalCategory(null)}
          goalCategory={selectedGoalCategory}
        />
      )}
    </>
  )
}

function GoalCategoryItem({ category, onAddGeneral }: { category: GoalCategory; onAddGeneral: () => void }) {
  const generalIds = category.generalCategories.map((g) => g.generalCategoryId)

  return (
    <div className="border-border bg-background rounded-lg border">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: category.colorCode }} />
        <div className="min-w-0 flex-1">
          <p className="text-foreground truncate text-sm font-medium">{category.goalCategoryName}</p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {category.goalCategoryStartDate} · {STATUS_LABEL[category.goalCategoryStatus]}
          </p>
        </div>
        <button
          onClick={onAddGeneral}
          className="text-muted-foreground hover:bg-muted hover:text-foreground flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1.5 text-xs transition-colors"
        >
          <Plus size={12} />
          일반 카테고리
        </button>
      </div>

      <SortableContext
        id={toDroppableId(category.goalCategoryId)}
        items={generalIds}
        strategy={verticalListSortingStrategy}
      >
        <DroppableContainer goalCategoryId={category.goalCategoryId} isEmpty={generalIds.length === 0}>
          {category.generalCategories.map((general) => (
            <SortableGeneralCategoryItem key={general.generalCategoryId} item={general} />
          ))}
        </DroppableContainer>
      </SortableContext>
    </div>
  )
}

function DroppableContainer({
  goalCategoryId,
  isEmpty,
  children,
}: {
  goalCategoryId: number
  isEmpty: boolean
  children: React.ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({ id: toDroppableId(goalCategoryId) })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col gap-1 px-4 pb-2 transition-colors',
        !isEmpty && 'border-border border-t pt-2',
        isEmpty && 'min-h-[32px] items-center justify-center',
        isOver && isEmpty && 'bg-muted rounded-b-lg'
      )}
    >
      {isEmpty && isOver && <p className="text-muted-foreground text-xs">여기에 놓기</p>}
      {!isEmpty && children}
    </div>
  )
}

function SortableGeneralCategoryItem({ item }: { item: GeneralCategoryItemType }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.generalCategoryId,
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'group flex items-center gap-2.5 rounded-md py-1.5 pr-1 pl-2',
        'hover:bg-muted transition-colors',
        isDragging && 'opacity-40'
      )}
    >
      <div className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.colorCode }} />
      <p className="text-foreground flex-1 text-xs">{item.generalCategoryName}</p>
      <button
        {...attributes}
        {...listeners}
        className="text-muted-foreground hover:text-foreground cursor-grab rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
        aria-label="드래그 핸들"
      >
        <GripVertical size={12} />
      </button>
    </div>
  )
}

function GeneralCategoryItemOverlay({ item }: { item: GeneralCategoryItemType }) {
  return (
    <div className="bg-background border-border flex items-center gap-2.5 rounded-md border py-1.5 pr-1 pl-2 shadow-sm">
      <div className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.colorCode }} />
      <p className="text-foreground flex-1 text-xs">{item.generalCategoryName}</p>
      <GripVertical size={12} className="text-muted-foreground" />
    </div>
  )
}

function GoalCategoryListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border-border bg-muted h-16 animate-pulse rounded-lg border" />
      ))}
    </div>
  )
}

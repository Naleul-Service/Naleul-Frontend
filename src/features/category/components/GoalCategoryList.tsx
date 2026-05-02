'use client'

import { useRef, useState } from 'react'
import { GripVertical, MoreVertical, Pencil, Plus, Trash2 } from 'lucide-react'
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
import { GoalCategoryContextMenu } from './GoalCategoryContextMenu'
import { GoalCategoryEditModal } from './GoalCategoryEditModal'
import { GoalCategoryCompleteModal } from './GoalCategoryCompleteModal'
import { useDeleteGoalCategory } from '@/src/features/category/hooks/useGoalCategoryMutations'
import { useDeleteGeneralCategory } from '@/src/features/category/hooks/useGeneralCategoryMutations'
import { cn } from '@/src/lib/utils'
import { GeneralCategoryEditModal } from '@/src/features/category/components/GeneralCategoryEditModal'
import { STATUS_BADGE_STYLE, STATUS_LABEL } from '@/src/features/category/constants'
import { Button } from '@/src/components/common/Button'
import Badge from '@/src/components/common/Badge'

// ─── 상수 / 유틸 ────────────────────────────────────────────

const toDroppableId = (goalCategoryId: number) => `droppable-${goalCategoryId}`

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

// ─── 모달 상태 타입 ──────────────────────────────────────────

type GoalModalType = 'addGeneral' | 'editGoal' | 'complete' | null

interface GoalModalState {
  type: GoalModalType
  category: GoalCategory | null
}

interface GeneralModalState {
  item: GeneralCategoryItemType | null
  goalCategory: GoalCategory | null
}

// ─── GoalCategoryList ────────────────────────────────────────

export function GoalCategoryList() {
  const { data: categories = [], isLoading, isError } = useGoalCategories()
  const { mutate: updateGeneralCategories } = useUpdateGeneralCategories()
  const { mutate: deleteGoalCategory } = useDeleteGoalCategory()
  const { mutate: deleteGeneralCategory } = useDeleteGeneralCategory()
  const queryClient = useQueryClient()

  const [goalModal, setGoalModal] = useState<GoalModalState>({ type: null, category: null })
  const [generalEditModal, setGeneralEditModal] = useState<GeneralModalState>({ item: null, goalCategory: null })
  const [activeItem, setActiveItem] = useState<GeneralCategoryItemType | null>(null)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null) // goalCategoryId
  const [openGeneralMenuId, setOpenGeneralMenuId] = useState<number | null>(null) // generalCategoryId

  const originGoalCategoryIdRef = useRef<number | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const openGoalModal = (type: GoalModalType, category: GoalCategory) => setGoalModal({ type, category })
  const closeGoalModal = () => setGoalModal({ type: null, category: null })

  const openGeneralEditModal = (item: GeneralCategoryItemType, goalCategory: GoalCategory) =>
    setGeneralEditModal({ item, goalCategory })
  const closeGeneralEditModal = () => setGeneralEditModal({ item: null, goalCategory: null })

  const getSnapshot = () => queryClient.getQueryData<GoalCategory[]>(['goal-categories']) ?? []

  if (isLoading) return <GoalCategoryListSkeleton />
  if (isError) return <p className="text-xs text-red-500">카테고리를 불러오지 못했어요</p>
  if (categories.length === 0) return null

  // ── DnD 핸들러 ───────────────────────────────────────────

  const handleDragStart = (event: DragStartEvent) => {
    setOpenMenuId(null)
    setOpenGeneralMenuId(null)

    const activeId = Number(event.active.id)
    const container = categories.find((cat) => cat.generalCategories.some((g) => g.generalCategoryId === activeId))
    originGoalCategoryIdRef.current = container?.goalCategoryId ?? null
    setActiveItem(container?.generalCategories.find((g) => g.generalCategoryId === activeId) ?? null)
  }

  const handleDragOver = (event: DragOverEvent) => {
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

  const handleDragEnd = (event: DragEndEvent) => {
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

  // ── 삭제 핸들러 ──────────────────────────────────────────

  const handleDeleteGoalCategory = (category: GoalCategory) => {
    if (!confirm(`"${category.goalCategoryName}" 목표를 삭제할까요?\n하위 일반 카테고리도 함께 삭제돼요.`)) return
    deleteGoalCategory(category.goalCategoryId)
  }

  const handleDeleteGeneralCategory = (item: GeneralCategoryItemType) => {
    if (!confirm(`"${item.generalCategoryName}" 카테고리를 삭제할까요?`)) return
    deleteGeneralCategory(item.generalCategoryId)
  }

  // ── 렌더 ─────────────────────────────────────────────────

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

      {/* 일반 카테고리 추가 */}
      {goalModal.type === 'addGeneral' && goalModal.category && (
        <GeneralCategoryModal isOpen onClose={closeGoalModal} goalCategory={goalModal.category} />
      )}

      {/* 목표 카테고리 수정 */}
      {goalModal.type === 'editGoal' && goalModal.category && (
        <GoalCategoryEditModal isOpen onClose={closeGoalModal} category={goalModal.category} />
      )}

      {/* 목표 완료 처리 */}
      {goalModal.type === 'complete' && goalModal.category && (
        <GoalCategoryCompleteModal isOpen onClose={closeGoalModal} category={goalModal.category} />
      )}

      {/* 일반 카테고리 수정 */}
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

// ─── GoalCategoryItem ────────────────────────────────────────

interface GoalCategoryItemProps {
  category: GoalCategory
  isMenuOpen: boolean
  onMenuToggle: () => void
  onMenuClose: () => void
  onAddGeneral: () => void
  onEdit: () => void
  onComplete: () => void
  onDelete: () => void
  openGeneralMenuId: number | null
  onGeneralMenuToggle: (id: number) => void
  onGeneralMenuClose: () => void
  onEditGeneral: (item: GeneralCategoryItemType) => void
  onDeleteGeneral: (item: GeneralCategoryItemType) => void
}

function GoalCategoryItem({
  category,
  isMenuOpen,
  onMenuToggle,
  onMenuClose,
  onAddGeneral,
  onEdit,
  onComplete,
  onDelete,
  openGeneralMenuId,
  onGeneralMenuToggle,
  onGeneralMenuClose,
  onEditGeneral,
  onDeleteGeneral,
}: GoalCategoryItemProps) {
  const generalIds = category.generalCategories.map((g) => g.generalCategoryId)
  const isCompleted = category.goalCategoryStatus === 'COMPLETED'
  const isEtc = category.goalCategoryName === '기타'

  return (
    <div className="bg-background rounded-[12px] border border-gray-100">
      <section className="flex items-center justify-between gap-3 px-4 py-3">
        <section className="flex items-center gap-x-4">
          <div
            className="h-4 w-4 shrink-0 rounded-full"
            style={{ backgroundColor: category.colorCode ? category.colorCode : '#637580' }}
          />
          <section className="flex flex-col gap-y-[2px]">
            <p className="h4 text-gray-950">{category.goalCategoryName}</p>
            <div className="flex items-center gap-x-1">
              <Badge
                opacity={100}
                bgColor={STATUS_BADGE_STYLE[category.goalCategoryStatus]?.bg}
                textColor={STATUS_BADGE_STYLE[category.goalCategoryStatus]?.text}
              >
                {STATUS_LABEL[category.goalCategoryStatus]}
              </Badge>
              <p className="body-md text-gray-500">{category.goalCategoryStartDate}</p>
            </div>
          </section>
        </section>

        <div className="flex shrink-0 items-center gap-[7px]">
          <Button
            onClick={onAddGeneral}
            variant={'secondary'}
            size={'sm'}
            leftIcon={<Plus size={12} className="text-primary-400" />}
          >
            <span className="tablet:block desktop:block hidden">세부 목표 추가</span>
            <span className="tablet:hidden desktop:hidden block">세부 목표</span>
          </Button>

          {!isEtc && (
            <GoalCategoryContextMenu
              isOpen={isMenuOpen}
              onToggle={onMenuToggle}
              onClose={onMenuClose}
              onEdit={onEdit}
              onComplete={onComplete}
              onDelete={onDelete}
              isCompleted={isCompleted}
            />
          )}
        </div>
      </section>

      <SortableContext
        id={toDroppableId(category.goalCategoryId)}
        items={generalIds}
        strategy={verticalListSortingStrategy}
      >
        <DroppableContainer goalCategoryId={category.goalCategoryId} isEmpty={generalIds.length === 0}>
          {category.generalCategories.map((general) => (
            <SortableGeneralCategoryItem
              key={general.generalCategoryId}
              item={general}
              isMenuOpen={openGeneralMenuId === general.generalCategoryId}
              onMenuToggle={() => onGeneralMenuToggle(general.generalCategoryId)}
              onMenuClose={onGeneralMenuClose}
              onEdit={() => onEditGeneral(general)}
              onDelete={() => onDeleteGeneral(general)}
            />
          ))}
        </DroppableContainer>
      </SortableContext>
    </div>
  )
}

// ─── DroppableContainer ──────────────────────────────────────

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
        'flex flex-col gap-1 px-2 pb-2 transition-colors',
        !isEmpty && 'border-t border-gray-100 pt-2',
        isEmpty && 'min-h-[32px] items-center justify-center',
        isOver && isEmpty && 'bg-muted rounded-b-lg'
      )}
    >
      {isEmpty && isOver && <p className="text-muted-foreground text-xs">여기에 놓기</p>}
      {!isEmpty && children}
    </div>
  )
}

// ─── SortableGeneralCategoryItem ─────────────────────────────

interface SortableGeneralCategoryItemProps {
  item: GeneralCategoryItemType
  isMenuOpen: boolean
  onMenuToggle: () => void
  onMenuClose: () => void
  onEdit: () => void
  onDelete: () => void
}

function SortableGeneralCategoryItem({
  item,
  isMenuOpen,
  onMenuToggle,
  onMenuClose,
  onEdit,
  onDelete,
}: SortableGeneralCategoryItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.generalCategoryId,
  })
  const isEtc = item.generalCategoryName === 'ETC'

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'group flex items-center justify-between rounded-[12px] px-[10px] py-3',
        'hover:bg-muted transition-colors',
        isDragging && 'opacity-40'
      )}
    >
      <section className="flex gap-x-[10px]">
        {!isEtc && (
          <button
            {...attributes}
            {...listeners}
            className="text-muted-foreground hover:text-foreground cursor-grab rounded p-0.5 transition-colors active:cursor-grabbing"
            aria-label="드래그 핸들"
          >
            <GripVertical size={16} className="text-gray-300" />
          </button>
        )}

        <section className="flex items-center gap-x-[10px]">
          <div
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: item.colorCode ? item.colorCode : '#BDC9CE' }}
          />
          <p className="body-md-medium flex-1 text-gray-950">{item.generalCategoryName}</p>
        </section>
      </section>

      {!isEtc && (
        <GeneralItemContextMenu
          isMenuOpen={isMenuOpen}
          onMenuToggle={onMenuToggle}
          onMenuClose={onMenuClose}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  )
}

// ─── GeneralItemContextMenu ──────────────────────────────────

interface GeneralItemContextMenuProps {
  isMenuOpen: boolean
  onMenuToggle: () => void
  onMenuClose: () => void
  onEdit: () => void
  onDelete: () => void
}

function GeneralItemContextMenu({
  isMenuOpen,
  onMenuToggle,
  onMenuClose,
  onEdit,
  onDelete,
}: GeneralItemContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null)

  // 외부 클릭 감지
  useState(() => {
    if (!isMenuOpen) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onMenuClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  })

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation()
          onMenuToggle()
        }}
        className={cn(
          'text-muted-foreground hover:text-foreground rounded p-0.5 transition-opacity group-hover:opacity-100',
          isMenuOpen && 'opacity-100'
        )}
        aria-label="더 보기"
      >
        <MoreVertical size={16} className="text-gray-300" />
      </button>

      {isMenuOpen && (
        <div className="bg-background border-border animate-in fade-in-0 zoom-in-95 absolute top-full right-0 z-50 mt-1 min-w-[112px] rounded-lg border py-1 shadow-md duration-100">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
              onMenuClose()
            }}
            className="text-foreground hover:bg-muted flex w-full items-center gap-2 px-3 py-2 text-xs transition-colors"
          >
            <Pencil size={12} />
            수정하기
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
              onMenuClose()
            }}
            className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 px-3 py-2 text-xs transition-colors"
          >
            <Trash2 size={12} />
            삭제하기
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Overlay / Skeleton ──────────────────────────────────────

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

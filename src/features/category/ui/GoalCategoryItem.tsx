import { GeneralCategoryItemType, GoalCategory } from '@/src/features/category/api/goalCategory'
import Badge from '@/src/components/common/Badge'
import { STATUS_BADGE_STYLE, STATUS_LABEL, toDroppableId } from '@/src/features/category/constants'
import { Button } from '@/src/components/common/Button'
import { Plus } from 'lucide-react'
import { GoalCategoryContextMenu } from '@/src/features/category/ui/GoalCategoryContextMenu'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import DroppableContainer from '@/src/features/category/ui/DroppableContainer'
import SortableGeneralCategoryItem from '@/src/features/category/ui/SortableGeneralCategoryItem'

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

export default function GoalCategoryItem({
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

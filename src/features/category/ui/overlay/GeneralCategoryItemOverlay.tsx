import { GeneralCategoryItemType } from '@/src/features/category/api/goalCategory'
import { GripVertical } from 'lucide-react'

export default function GeneralCategoryItemOverlay({ item }: { item: GeneralCategoryItemType }) {
  return (
    <div className="bg-background border-border flex items-center gap-2.5 rounded-md border py-1.5 pr-1 pl-2 shadow-sm">
      <div className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.colorCode }} />
      <p className="text-foreground flex-1 text-xs">{item.generalCategoryName}</p>
      <GripVertical size={12} className="text-muted-foreground" />
    </div>
  )
}

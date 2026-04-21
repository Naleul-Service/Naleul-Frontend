import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  year: number
  month: number
  onPrev: () => void
  onNext: () => void
}

export function CalendarHeader({ year, month, onPrev, onNext }: Props) {
  return (
    <div className="flex items-center justify-between px-1 pb-3">
      <span className="text-base font-medium">
        {year}년 {month}월
      </span>
      <div className="flex items-center gap-1">
        <button onClick={onPrev} className="hover:bg-muted rounded-md p-1" aria-label="이전 달">
          <ChevronLeft size={16} />
        </button>
        <button onClick={onNext} className="hover:bg-muted rounded-md p-1" aria-label="다음 달">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

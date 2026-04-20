'use client'

import { useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/src/components/common/Button'

// 간단한 달력 — 추후 react-day-picker 등으로 교체 가능하도록 props 구조만 잡아둠
// 지금은 네이티브 input[type=date] 팝업으로 처리
export function CalendarPopover() {
  const router = useRouter()
  const pathname = usePathname()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.value) return
    // 현재 탭 경로 유지하면서 date만 교체
    router.push(`${pathname}?date=${e.target.value}`)
  }

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" aria-label="날짜 선택" onClick={() => inputRef.current?.showPicker()}>
        <CalendarIcon size={16} />
      </Button>

      {/* 숨겨진 date input — showPicker()로 브라우저 달력 열기 */}
      <input
        ref={inputRef}
        type="date"
        className="pointer-events-none absolute inset-0 opacity-0"
        onChange={handleDateChange}
        defaultValue={new Date().toISOString().split('T')[0]}
      />
    </div>
  )
}

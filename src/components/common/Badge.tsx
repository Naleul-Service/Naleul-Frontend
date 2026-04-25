import { cn } from '@/src/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  bgColor: string | null // #ffffff 형식
  textColor: string | null // #ffffff 형식
  type?: 'DOT' | 'DEFAULT'
  botColor?: string | null // #ffffff 형식
  opacity?: number // 0 ~ 100 사이의 숫자 (기본값 10으로 설정)
}

const FALLBACK_COLOR = '#9CA3AF'

export default function Badge({
  children,
  bgColor,
  textColor,
  botColor,
  type = 'DEFAULT',
  opacity = 100, // 배경 투명도 기본값 10%
}: BadgeProps) {
  const isDotType = type === 'DOT'

  return (
    <div
      className={cn(
        'flex w-fit items-center rounded-full',
        isDotType ? 'label-sm gap-x-1 px-[10px] py-1' : 'label-md px-2 py-[1px]'
      )}
      style={{
        // color-mix를 사용해 배경색과 투명(transparent)을 섞습니다.
        backgroundColor: `color-mix(in srgb, ${bgColor ?? FALLBACK_COLOR}, transparent ${100 - opacity}%)`,
        color: textColor ?? FALLBACK_COLOR,
      }}
    >
      {isDotType && (
        <div className="h-[6px] w-[6px] rounded-full" style={{ backgroundColor: botColor ?? FALLBACK_COLOR }} />
      )}
      {children}
    </div>
  )
}

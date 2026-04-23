import { cn } from '@/src/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  bgColor: string
  textColor: string
  type?: 'DOT' | 'DEFAULT'
  botColor?: string
}

export default function Badge({ children, bgColor, textColor, botColor, type = 'DEFAULT' }: BadgeProps) {
  return (
    <div
      className={cn(
        `${type === 'DOT' ? 'label-sm gap-x-1 px-[10px] py-1' : 'label-md px-2 py-[1px]'} flex w-fit items-center rounded-full`,
        bgColor,
        textColor
      )}
    >
      {type === 'DOT' ? <div className={cn('h-[6px] w-[6px] rounded-full', botColor)} /> : null}
      {children}
    </div>
  )
}

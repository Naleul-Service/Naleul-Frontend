import { cn } from '@/src/lib/utils'

interface PageLayoutProps {
  children: React.ReactNode
  customClassName?: string
}

export default function PageLayout({ children, customClassName }: PageLayoutProps) {
  return <div className={cn('flex min-h-screen flex-col p-[20px]', customClassName)}>{children}</div>
}

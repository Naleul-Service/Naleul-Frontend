import Badge from '../common/Badge'

interface PageHeaderProps {
  title: string
  subtitle?: string
  rightElement?: React.ReactNode
}

export default function PageHeader({ title, subtitle, rightElement }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <section className="flex flex-col gap-y-1">
        <div className="flex items-center gap-x-1">
          <h1 className="h2 text-gray-950">{title}</h1>
          <Badge bgColor={'#C4DDE3'} textColor={'#0D4556'} opacity={90}>
            Beta
          </Badge>
        </div>

        <h2 className="body-md text-gray-500">{subtitle}</h2>
      </section>
      {rightElement ? rightElement : null}
    </div>
  )
}

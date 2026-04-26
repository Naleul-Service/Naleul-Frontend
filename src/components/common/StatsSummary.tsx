import { ReactNode } from 'react'

export default function GoalStatsItem({
  title,
  content,
  badge,
  indicator,
}: {
  title: string
  content: string
  badge?: ReactNode
  indicator?: string
}) {
  return (
    <div className="flex h-[120px] w-full flex-col justify-between rounded-[12px] border border-gray-100 bg-gray-50 px-6 py-5">
      <div className="flex gap-x-2">
        <label className="body-md-medium text-gray-500">{title}</label>
        {badge ? badge : null}
      </div>

      <div className="flex items-end justify-between">
        <div className="display-xl text-primary-600">{content}</div>
        <p className="label-sm mb-1 text-gray-300">{indicator}</p>
      </div>
    </div>
  )
}

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
    <div className="desktop:px-6 tablet:px-5 tablet:py-4 desktop:py-5 desktop:h-[120px] tablet:h-[100px] flex h-[88px] w-full flex-col justify-between rounded-[12px] border border-gray-100 bg-gray-50 p-3">
      <div className="flex gap-x-2">
        <label className="label-sm tablet:body-md-medium desktop:body-md-medium text-gray-500">{title}</label>
        {badge ? badge : null}
      </div>

      <div className="tablet:justify-between desktop:justify-between tablet:items-end desktop:items-end tablet:flex-row flex flex-col">
        <p className="desktop:hidden tablet:hidden label-sm block text-gray-300">{indicator}</p>
        <div className="h3 tablet:h1 desktop:display-xl text-primary-600">{content}</div>
        <p className="desktop:block tablet:block desktop:label-sm tablet:label-md mb-1 hidden text-gray-300">
          {indicator}
        </p>
      </div>
    </div>
  )
}

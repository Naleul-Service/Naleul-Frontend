export default function SectionWrapper({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section className="desktop:p-5 tablet:py-5 tablet:px-6 flex w-full flex-col gap-y-[6px] rounded-[12px] border border-gray-100 bg-white px-4 py-3">
      <div className="flex flex-col gap-y-1">
        <h2 className="label-lg tablet:h4 desktop:h4">{title}</h2>
        {subtitle && <p className="body-sm text-[#8FA0A8]">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

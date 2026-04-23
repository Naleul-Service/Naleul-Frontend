interface EmptyCategoryProps {
  title: string
  description: string
}

export default function EmptyCategory({ title, description }: EmptyCategoryProps) {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-y-2 rounded-[12px] border-[1px] border-gray-100">
      <p className="h3 text-gray-500">{title}</p>
      <p className="body-md text-gray-300">{description}</p>
    </div>
  )
}

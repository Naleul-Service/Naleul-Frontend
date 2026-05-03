export default function CardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-[0_2px_16px_0_rgba(0,0,0,0.06)]">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-32 animate-pulse rounded-md bg-gray-100" />
          <div className="h-3 w-20 animate-pulse rounded-md bg-gray-100" />
        </div>
        <div className="h-6 w-12 animate-pulse rounded-full bg-gray-100" />
      </div>
      <div className="h-16 animate-pulse rounded-xl bg-gray-100" />
      <div className="flex gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 flex-1 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    </div>
  )
}

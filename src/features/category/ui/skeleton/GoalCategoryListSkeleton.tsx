export default function GoalCategoryListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border-border bg-muted h-16 animate-pulse rounded-lg border" />
      ))}
    </div>
  )
}

export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-[120px] items-center justify-center rounded-xl bg-gray-50">
      <p className="text-sm text-gray-300">{message}</p>
    </div>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import { useCompletedGoalCategories } from '../hooks/useCompletedGoalCategories'
import { CompletedGoalCategoryCard } from './CompletedGoalCategoryCard'
import CardSkeleton from '@/src/features/category/ui/skeleton/CardSkeleton'

export function CompletedGoalCategoryList() {
  const { data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useCompletedGoalCategories()

  // 무한 스크롤 - IntersectionObserver
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!bottomRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(bottomRef.current)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isPending) {
    return (
      <div className="flex flex-col gap-3 p-4">
        {[0, 1, 2].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <p className="text-sm text-gray-300">불러오는 중 오류가 발생했습니다</p>
      </div>
    )
  }

  const items = data.pages.flatMap((page) => page.content)

  if (items.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <p className="text-sm text-gray-300">완료된 목표가 없습니다</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-2">
      <h1 className="h3">완료 목표</h1>
      <div className="flex flex-col gap-y-2">
        {items.map((item) => (
          <CompletedGoalCategoryCard key={item.goalCategoryId} item={item} />
        ))}

        {/* 무한 스크롤 트리거 */}
        <div ref={bottomRef} />

        {isFetchingNextPage && <CardSkeleton />}
      </div>
    </div>
  )
}

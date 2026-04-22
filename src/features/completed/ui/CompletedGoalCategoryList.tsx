'use client'

import { useEffect, useRef } from 'react'
import { useCompletedGoalCategories } from '../hooks/useCompletedGoalCategories'
import { CompletedGoalCategoryCard } from './CompletedGoalCategoryCard'

function CardSkeleton() {
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
    <div className="flex flex-col gap-3 p-4">
      {items.map((item) => (
        <CompletedGoalCategoryCard key={item.goalCategoryId} item={item} />
      ))}

      {/* 무한 스크롤 트리거 */}
      <div ref={bottomRef} />

      {isFetchingNextPage && <CardSkeleton />}
    </div>
  )
}

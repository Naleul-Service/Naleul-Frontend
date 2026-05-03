import { useState } from 'react'
import type { ReviewType } from '../types'

function today() {
  return new Date().toISOString().slice(0, 10)
}

export function useRetrospectiveFilter() {
  const [reviewType, setReviewType] = useState<ReviewType | undefined>()
  const [baseDate, setBaseDate] = useState(today())
  const [goalCategoryId, setGoalCategoryId] = useState<number | undefined>()
  const [generalCategoryId, setGeneralCategoryId] = useState<number | undefined>()
  const [page, setPage] = useState(0)

  function handleFilterTypeChange(type: ReviewType | undefined) {
    setReviewType(type)
    setBaseDate('')
    setGeneralCategoryId(undefined)
    setPage(0)
  }

  function handleGoalCategoryChange(id: number | undefined) {
    setGoalCategoryId(id)
    setGeneralCategoryId(undefined)
    setPage(0)
  }

  function handleGeneralCategoryChange(id: number | undefined) {
    setGeneralCategoryId(id)
    setPage(0)
  }

  function handleDateChange(d: string) {
    setBaseDate(d)
    setPage(0)
  }

  return {
    reviewType,
    baseDate,
    goalCategoryId,
    generalCategoryId,
    page,
    setPage,
    handleFilterTypeChange,
    handleGoalCategoryChange,
    handleGeneralCategoryChange,
    handleDateChange,
  }
}

import { GoalCategoryStatus } from '@/src/features/category/api/goalCategory'

export const STATUS_LABEL: Record<GoalCategoryStatus, string> = {
  NOT_STARTED: '시작 전',
  IN_PROGRESS: '진행 중',
  COMPLETED: '완료',
  STOPPED: '중단',
}

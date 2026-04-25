import { GoalCategoryStatus } from '@/src/features/category/api/goalCategory'

export const STATUS_LABEL: Record<GoalCategoryStatus, string> = {
  NOT_STARTED: '시작 전',
  IN_PROGRESS: '진행 중',
  COMPLETED: '완료',
  STOPPED: '중단',
}
export const STATUS_BADGE_STYLE: Record<GoalCategoryStatus, { bg: string; text: string }> = {
  NOT_STARTED: { bg: '#E0E7EA', text: '#475660' },
  IN_PROGRESS: { bg: '#C4DDE3', text: '#0D4556' },
  COMPLETED: { bg: '#EBF6F1', text: '#1F5C3A' },
  STOPPED: { bg: '#EBF6F1', text: '#1F5C3A' },
}

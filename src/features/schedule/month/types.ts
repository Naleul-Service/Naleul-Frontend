import { Task } from '@/src/features/task/types'

export interface MonthlyTasksParams {
  year: number
  month: number // 1~12
}

// json.data.tasksByDate 를 반환하므로 Record가 곧 response
export type MonthlyTasksResponse = Record<string, Task[]>

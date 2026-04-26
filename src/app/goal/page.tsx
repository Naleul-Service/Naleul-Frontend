import { CompletedGoalCategoryList } from '@/src/features/completed/ui/CompletedGoalCategoryList'
import GoalHeader from '@/src/features/completed/ui/GoalHeader'
import GoalStatsSummary from '@/src/features/completed/ui/GoalStatsSummary'

export default function GoalPage() {
  return (
    <main className="flex flex-col gap-y-6 p-5">
      <GoalHeader />
      <GoalStatsSummary />
      <CompletedGoalCategoryList />
    </main>
  )
}

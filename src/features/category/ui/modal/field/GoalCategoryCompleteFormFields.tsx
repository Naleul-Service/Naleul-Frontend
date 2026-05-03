import { Input } from '@/src/components/common/Input'
import Label from '@/src/components/common/Label'
import { GoalCategory } from '@/src/features/category/api/goalCategory'

interface GoalCategoryCompleteFormFieldsProps {
  category: GoalCategory
  goalCategoryEndDate: string
  onEndDateChange: (value: string) => void
  achievement: string
  onAchievementChange: (value: string) => void
  achievementError: string
}

export function GoalCategoryCompleteFormFields({
  category,
  goalCategoryEndDate,
  onEndDateChange,
  achievement,
  onAchievementChange,
  achievementError,
}: GoalCategoryCompleteFormFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* 안내 */}
      <div className="bg-muted rounded-lg px-3 py-2.5">
        <p className="text-muted-foreground text-xs leading-relaxed">
          <span className="text-foreground font-medium">{category.goalCategoryName}</span> 목표를 완료 처리해요.
          <br />
          완료 후에는 상태가 <span className="font-medium">완료</span>로 변경돼요.
        </p>
      </div>

      {/* 종료일 */}
      <Input
        label="종료일"
        type="date"
        value={goalCategoryEndDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        min={category.goalCategoryStartDate}
      />

      {/* 달성 내용 */}
      <div className="flex flex-col gap-1.5">
        <Label isRequired>달성 내용</Label>
        <textarea
          value={achievement}
          onChange={(e) => onAchievementChange(e.target.value)}
          placeholder="목표를 어떻게 달성했는지 기록해보세요"
          rows={3}
          maxLength={200}
          className={[
            'border-border bg-background text-foreground placeholder:text-muted-foreground w-full resize-none rounded-lg border px-3 py-2.5 text-xs transition-colors outline-none',
            'focus:border-foreground',
            achievementError ? 'border-destructive' : '',
          ].join(' ')}
        />
        <div className="flex justify-between">
          {achievementError ? <p className="text-destructive text-xs">{achievementError}</p> : <span />}
          <p className="text-muted-foreground text-xs">{achievement.length}/200</p>
        </div>
      </div>
    </div>
  )
}

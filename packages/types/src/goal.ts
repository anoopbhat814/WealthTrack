export type GoalKind = 'RETIREMENT' | 'HOME' | 'EDUCATION' | 'EMERGENCY' | 'TRAVEL' | 'CUSTOM';

export interface GoalView {
  id: string;
  kind: GoalKind;
  name: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  targetDate: string;
  progress: number;
  projectedCompletion: string | null;
  onTrack: boolean;
}

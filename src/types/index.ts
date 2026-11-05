export type RoutineCategory = 'morning' | 'lunch' | 'evening' | 'night';

export interface RoutineItemConfig {
  id: string;
  title: string;
  timeHint: string;
  category: RoutineCategory;
  description: string;
  type: 'standard' | 'one-thing' | 'timer' | 'record';
  fallbackText?: string;
  isCustom?: boolean;
}

export interface DayRoutineStatus {
  completed: boolean;
  completedAt?: string;
  fallbackUsed?: boolean;
  note?: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  routines: Record<string, DayRoutineStatus>;
  oneThing: {
    title: string;
    isFallback: boolean; // 독서 15분 대체
    completed: boolean;
    completedAt?: string;
  };
  nextOneThing: string; // 내일 해야 할 가장 중요한 일 1가지
  reading: {
    bookTitle: string;
    pages?: string;
    keyInsight: string;
  };
  review: {
    content: string;
    mood?: 'great' | 'good' | 'soso' | 'tired';
  };
  studyTimerMinutes?: number; // 오늘 집중한 시간(분)
  updatedAt: string;
}

export interface AppState {
  hasCompletedOnboarding?: boolean;
  routinesConfig: RoutineItemConfig[];
  logs: Record<string, DailyLog>; // key: YYYY-MM-DD
}

import type { AppState, DailyLog, RoutineItemConfig } from '../types';

export const DEFAULT_ROUTINES: RoutineItemConfig[] = [
  {
    id: 'wake-up',
    title: '아침 7시 기상',
    timeHint: '07:00 AM',
    category: 'morning',
    description: '알람 소리에 미루지 않고 눈뜨기',
    type: 'standard',
  },
  {
    id: 'morning-walk',
    title: '아침 15분 산책',
    timeHint: '기상 직후',
    category: 'morning',
    description: '햇빛을 쬐며 뇌를 깨우는 15분 산책',
    type: 'standard',
  },
  {
    id: 'one-thing',
    title: '가장 중요한 일 1가지 수행',
    timeHint: '오전 골든타임',
    category: 'morning',
    description: '오늘 나를 가장 크게 성장시킬 단 하나의 핵심 과업',
    type: 'one-thing',
    fallbackText: '없을 시 독서 15분으로 대체',
  },
  {
    id: 'lunch-walk',
    title: '점심 15분 산책',
    timeHint: '점심 식사 후',
    category: 'lunch',
    description: '식후 가벼운 산책으로 오후 집중력 충전',
    type: 'standard',
  },
  {
    id: 'evening-study',
    title: '퇴근 후 자기계발 1시간',
    timeHint: '저녁/퇴근 후',
    category: 'evening',
    description: '딴짓 없이 온전히 나만을 위해 60분 몰입',
    type: 'timer',
  },
  {
    id: 'daily-record',
    title: '오늘 하루 및 독서 기록 + 내일 One Thing 메모',
    timeHint: '취침 전 마감',
    category: 'night',
    description: '오늘의 회고와 독서 노트, 내일의 가장 중요한 일 1가지 정하기',
    type: 'record',
  },
];

const STORAGE_KEY = 'one_routine_app_data_v1';

export function getTodayDateString(offsetDays = 0): string {
  const d = new Date();
  if (offsetDays !== 0) {
    d.setDate(d.getDate() + offsetDays);
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateKorean(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${month}월 ${day}일 (${days[date.getDay()]})`;
}

export function getPreviousDateString(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() - 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getNextDateString(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed) {
        return {
          hasCompletedOnboarding: parsed.hasCompletedOnboarding ?? true, // 이미 저장된 데이터가 있으면 온보딩 완료로 간주
          routinesConfig: parsed.routinesConfig || DEFAULT_ROUTINES,
          logs: parsed.logs || {},
        };
      }
    }
  } catch (e) {
    console.error('Failed to load app state from localStorage:', e);
  }
  // 신규 사용자: 온보딩 모달을 띄워 추천 루틴을 확인하도록 함
  return {
    hasCompletedOnboarding: false,
    routinesConfig: DEFAULT_ROUTINES,
    logs: {},
  };
}

export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save app state to localStorage:', e);
  }
}

// 특정 날짜의 DailyLog 가져오기 (없으면 이전 날짜의 nextOneThing을 연동해 초기화)
export function getOrCreateDailyLog(state: AppState, dateStr: string): DailyLog {
  if (state.logs[dateStr]) {
    return state.logs[dateStr];
  }

  // 어제의 기록에서 'nextOneThing'이 있었는지 확인하여 자동 세팅
  const prevDate = getPreviousDateString(dateStr);
  const prevLog = state.logs[prevDate];
  const inheritedOneThing = prevLog?.nextOneThing?.trim() || '';

  const initialRoutines: Record<string, { completed: boolean; completedAt?: string; fallbackUsed?: boolean }> = {};
  state.routinesConfig.forEach((r) => {
    initialRoutines[r.id] = { completed: false };
  });

  const newLog: DailyLog = {
    date: dateStr,
    routines: initialRoutines,
    oneThing: {
      title: inheritedOneThing,
      isFallback: false,
      completed: false,
    },
    nextOneThing: '',
    reading: {
      bookTitle: '',
      pages: '',
      keyInsight: '',
    },
    review: {
      content: '',
      mood: 'good',
    },
    studyTimerMinutes: 0,
    updatedAt: new Date().toISOString(),
  };

  return newLog;
}

// 스트릭(연속 달성일수) 계산
// 기준: 하루 루틴 중 하나 이상 완료했거나 One Thing을 완료한 날
export function calculateStreak(logs: Record<string, DailyLog>): { currentStreak: number; bestStreak: number } {
  const dates = Object.keys(logs).sort().reverse();
  if (dates.length === 0) return { currentStreak: 0, bestStreak: 0 };

  const isDayCompleted = (dateStr: string) => {
    const log = logs[dateStr];
    if (!log) return false;
    const completedCount = Object.values(log.routines || {}).filter((r) => r.completed).length;
    return completedCount >= 3 || log.oneThing?.completed;
  };

  const today = getTodayDateString();
  const yesterday = getPreviousDateString(today);

  let currentStreak = 0;
  let checkDate = isDayCompleted(today) ? today : (isDayCompleted(yesterday) ? yesterday : null);

  if (checkDate) {
    while (isDayCompleted(checkDate)) {
      currentStreak++;
      checkDate = getPreviousDateString(checkDate);
    }
  }

  // 전체 최고 스트릭 계산
  const allDates = Object.keys(logs).sort();
  let bestStreak = 0;
  let tempStreak = 0;
  let lastDate: string | null = null;

  for (const d of allDates) {
    if (isDayCompleted(d)) {
      if (lastDate && getNextDateString(lastDate) === d) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
      if (tempStreak > bestStreak) bestStreak = tempStreak;
      lastDate = d;
    } else {
      tempStreak = 0;
    }
  }

  return { currentStreak, bestStreak: Math.max(bestStreak, currentStreak) };
}

// 백업 데이터 JSON 다운로드
export function exportDataAsJson(state: AppState) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `one_routine_backup_${getTodayDateString()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// 백업 데이터 JSON 복원
export function importDataFromJson(file: File): Promise<AppState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.logs) {
          resolve(parsed);
        } else {
          reject(new Error('올바른 백업 파일 형식이 아닙니다.'));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('파일 읽기 오류'));
    reader.readAsText(file);
  });
}

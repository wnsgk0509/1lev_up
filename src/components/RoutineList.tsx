import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Sun, 
  Footprints, 
  Target, 
  Utensils, 
  Laptop, 
  Moon, 
  Timer, 
  PenTool, 
  Sparkles,
  BookOpen,
  Sliders,
  Plus
} from 'lucide-react';
import type { DailyLog, RoutineItemConfig } from '../types';

interface RoutineListProps {
  routinesConfig: RoutineItemConfig[];
  dailyLog: DailyLog;
  onToggleRoutine: (routineId: string) => void;
  onOpenTimerModal: () => void;
  onOpenRecordModal: () => void;
  onOpenOneThingFallback: () => void;
  onOpenSettings: () => void;
  onOpenOnboarding: () => void;
}

export const RoutineList: React.FC<RoutineListProps> = ({
  routinesConfig,
  dailyLog,
  onToggleRoutine,
  onOpenTimerModal,
  onOpenRecordModal,
  onOpenOneThingFallback,
  onOpenSettings,
  onOpenOnboarding,
}) => {
  // 아이콘 매핑
  const getRoutineIcon = (id: string) => {
    switch (id) {
      case 'wake-up':
        return <Sun className="w-4 h-4 text-amber-500" />;
      case 'morning-walk':
        return <Footprints className="w-4 h-4 text-emerald-500" />;
      case 'one-thing':
        return <Target className="w-4 h-4 text-indigo-500" />;
      case 'lunch-walk':
        return <Utensils className="w-4 h-4 text-teal-500" />;
      case 'evening-study':
        return <Laptop className="w-4 h-4 text-violet-500" />;
      case 'daily-record':
        return <Moon className="w-4 h-4 text-sky-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
    }
  };

  // 진행률 계산
  const totalCount = routinesConfig.length;
  const completedCount = routinesConfig.filter(r => {
    if (r.id === 'one-thing') {
      return dailyLog.oneThing.completed;
    }
    return dailyLog.routines[r.id]?.completed;
  }).length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-4">
      {/* 진행 상황 요약 바 */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <span>오늘의 최소 루틴 달성</span>
            <span className="text-slate-400 font-normal">({completedCount}/{totalCount})</span>
          </span>
          <span className="font-bold text-indigo-600">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          {progressPercent === 100 
            ? '🎉 완벽한 하루입니다! 당신의 지속 가능한 시스템이 작동하고 있어요.'
            : '💡 완벽하지 않아도 괜찮습니다. 힘든 날에도 "최소 기준"만 챙겨보세요.'}
        </p>
      </div>

      {/* 루틴 체크 리스트 */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            오늘의 루틴 체크
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenSettings}
              className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-medium px-2 py-0.5 rounded hover:bg-slate-100 transition-colors"
            >
              <Sliders className="w-3 h-3" />
              <span>루틴 직접 수정 / 추가</span>
            </button>
          </div>
        </div>

        {routinesConfig.map((routine) => {
          // one-thing인 경우 dailyLog.oneThing.completed와 동기화
          const isCompleted = routine.id === 'one-thing' 
            ? dailyLog.oneThing.completed 
            : !!dailyLog.routines[routine.id]?.completed;
          const status = dailyLog.routines[routine.id];

          return (
            <div
              key={routine.id}
              className={`group flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all duration-200 ${
                isCompleted
                  ? 'bg-slate-50/80 border-slate-200 text-slate-400'
                  : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-xs text-slate-800'
              }`}
            >
              <div 
                className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                onClick={() => onToggleRoutine(routine.id)}
              >
                {/* 체크박스 */}
                <button
                  type="button"
                  className={`p-1 rounded-lg transition-colors shrink-0 ${
                    isCompleted
                      ? 'text-emerald-500 hover:text-emerald-600'
                      : 'text-slate-300 hover:text-indigo-500'
                  }`}
                  aria-label={isCompleted ? '완료 취소' : '루틴 완료'}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 fill-emerald-50 text-emerald-500" />
                  ) : (
                    <Circle className="w-6 h-6 stroke-[1.5]" />
                  )}
                </button>

                {/* 텍스트 내용 */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 p-1 rounded-md bg-slate-100 group-hover:bg-slate-200/70 transition-colors">
                      {getRoutineIcon(routine.id)}
                    </span>
                    <h3 className={`text-sm sm:text-base font-semibold truncate ${
                      isCompleted ? 'line-through text-slate-400 font-normal' : 'text-slate-800'
                    }`}>
                      {routine.id === 'one-thing' && dailyLog.oneThing.isFallback
                        ? '가장 중요한 일 (독서 15분으로 대체 진행)'
                        : routine.title}
                    </h3>
                    <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 shrink-0">
                      {routine.timeHint}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-0.5 truncate pl-7">
                    {routine.id === 'one-thing' && dailyLog.oneThing.title && !dailyLog.oneThing.isFallback
                      ? `🎯 "${dailyLog.oneThing.title}"`
                      : routine.description}
                  </p>
                </div>
              </div>

              {/* 액션 버튼들 (타이머, 기록 모달, 대체 토글 등) */}
              <div className="flex items-center gap-1.5 pl-2 shrink-0">
                {/* 1) 원씽 대체 버튼 */}
                {routine.id === 'one-thing' && (
                  <button
                    onClick={onOpenOneThingFallback}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 text-xs transition-colors"
                    title="원씽을 독서 15분으로 대체 / 복귀"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                )}

                {/* 2) 퇴근 후 자기계발 몰입 타이머 열기 */}
                {routine.id === 'evening-study' && (
                  <button
                    onClick={onOpenTimerModal}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 text-xs font-medium transition-colors border border-violet-100"
                    title="몰입 1시간 타이머 시작하기"
                  >
                    <Timer className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">1시간 타이머</span>
                  </button>
                )}

                {/* 3) 오늘 하루 및 독서 기록 모달 열기 */}
                {routine.id === 'daily-record' && (
                  <button
                    onClick={onOpenRecordModal}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-medium transition-colors border border-indigo-100"
                    title="하루 회고 & 독서 기록 작성하기"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {dailyLog.review.content || dailyLog.reading.bookTitle ? '기록 수정' : '기록 작성'}
                    </span>
                  </button>
                )}

                {/* 완료 시간 배지 */}
                {status?.completedAt && (
                  <span className="text-[10px] text-slate-400 hidden md:inline-block">
                    {status.completedAt}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {routinesConfig.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-indigo-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">
              현재 설정된 루틴이 없습니다
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              추천 예시 루틴을 가져오거나, 나만의 새로운 루틴을 직접 추가해보세요.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={onOpenOnboarding}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>추천 예시 루틴 불러오기</span>
              </button>
              <button
                onClick={onOpenSettings}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>직접 추가하기</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

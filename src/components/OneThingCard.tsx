import React, { useState } from 'react';
import { Target, CheckCircle2, Circle, BookOpen, Edit3, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { DailyLog } from '../types';

interface OneThingCardProps {
  dailyLog: DailyLog;
  onUpdateOneThing: (updates: Partial<DailyLog['oneThing']>) => void;
  onOpenReadingModal: () => void;
}

export const OneThingCard: React.FC<OneThingCardProps> = ({
  dailyLog,
  onUpdateOneThing,
  onOpenReadingModal,
}) => {
  const { oneThing } = dailyLog;
  const [isEditing, setIsEditing] = useState(false);
  const [inputText, setInputText] = useState(oneThing.title);

  const handleToggleComplete = () => {
    const nextCompleted = !oneThing.completed;
    onUpdateOneThing({
      completed: nextCompleted,
      completedAt: nextCompleted ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
    });

    if (nextCompleted) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#3b82f6', '#10b981', '#f59e0b'],
      });
    }
  };

  const handleSaveText = () => {
    onUpdateOneThing({ title: inputText.trim() });
    setIsEditing(false);
  };

  const handleToggleFallback = () => {
    const nextFallback = !oneThing.isFallback;
    onUpdateOneThing({ isFallback: nextFallback });
  };

  const currentDisplayTitle = oneThing.isFallback
    ? '📖 독서 15분 몰입하기 (One Thing 대체)'
    : (oneThing.title ? oneThing.title : '오늘 가장 중요한 1가지 일을 등록해보세요');

  return (
    <div className={`relative overflow-hidden rounded-2xl border transition-all duration-300 shadow-sm ${
      oneThing.completed
        ? 'bg-gradient-to-br from-emerald-50 to-teal-50/70 border-emerald-200'
        : 'bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/60 border-indigo-100 hover:border-indigo-200 shadow-indigo-100/30'
    } p-5 sm:p-6 mb-6`}>
      {/* 백그라운드 장식 아이콘 */}
      <div className="absolute -right-4 -bottom-4 text-indigo-500/5 pointer-events-none select-none">
        <Target size={140} />
      </div>

      <div className="relative z-10">
        {/* 상단 레이블 & 대체 액션 */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-600 text-white shadow-xs">
              <Target className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
              The ONE Thing
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              · 오늘 나를 가장 크게 바꿀 단 하나의 과업
            </span>
          </div>

          {/* 없을 시 독서 15분으로 대체 토글 */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToggleFallback}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1 ${
                oneThing.isFallback
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200'
              }`}
              title="오늘 마땅한 원씽이 없거나 지쳤을 땐 독서 15분으로 대체할 수 있습니다."
            >
              <BookOpen className="w-3 h-3 text-amber-600" />
              <span>{oneThing.isFallback ? '원래 일로 복귀' : '독서 15분으로 대체'}</span>
            </button>
          </div>
        </div>

        {/* 메인 내용 영역 */}
        <div className="flex items-start sm:items-center justify-between gap-4 mt-2">
          <div className="flex-1 min-w-0">
            {isEditing && !oneThing.isFallback ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="예: 프로젝트 핵심 기능 기획서 초안 완성하기"
                  className="w-full text-base sm:text-lg font-semibold px-3 py-1.5 bg-white border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveText();
                    if (e.key === 'Escape') setIsEditing(false);
                  }}
                />
                <button
                  onClick={handleSaveText}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1 shrink-0"
                >
                  <Check className="w-4 h-4" />
                  <span>저장</span>
                </button>
              </div>
            ) : (
              <div className="group flex items-start gap-2">
                <p className={`text-base sm:text-xl font-bold tracking-tight break-keep ${
                  oneThing.completed
                    ? 'line-through text-slate-400'
                    : oneThing.title || oneThing.isFallback
                    ? 'text-slate-900'
                    : 'text-slate-400 italic'
                }`}>
                  {currentDisplayTitle}
                </p>

                {!oneThing.isFallback && (
                  <button
                    onClick={() => {
                      setInputText(oneThing.title);
                      setIsEditing(true);
                    }}
                    className="opacity-60 group-hover:opacity-100 p-1 text-slate-400 hover:text-indigo-600 transition-all shrink-0 mt-0.5"
                    title="원씽 내용 수정"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* 부가 설명 및 상태 메시지 */}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              {oneThing.completed ? (
                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded font-medium">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  {oneThing.completedAt ? `${oneThing.completedAt}에 완료됨!` : '오늘의 핵심 과업 달성!'}
                </span>
              ) : (
                <span>
                  {oneThing.isFallback
                    ? '📖 책을 펴고 타이머를 15분 맞춰보세요. 작은 한 걸음도 훌륭합니다.'
                    : '💡 아침 산책 후 의사결정 에너지가 가장 맑을 때 즉시 시작하세요.'}
                </span>
              )}

              {oneThing.isFallback && (
                <button
                  onClick={onOpenReadingModal}
                  className="text-xs text-indigo-600 hover:underline font-medium ml-1"
                >
                  독서 기록 작성하기 →
                </button>
              )}
            </div>
          </div>

          {/* 완료 토글 버튼 (대형 체크박스) */}
          <button
            onClick={handleToggleComplete}
            className={`shrink-0 flex items-center justify-center p-2 rounded-xl transition-all duration-200 ${
              oneThing.completed
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 hover:bg-emerald-600'
                : 'bg-white border-2 border-slate-300 text-slate-300 hover:border-indigo-400 hover:text-indigo-400 hover:shadow-xs'
            }`}
            title={oneThing.completed ? '완료 취소' : '오늘의 One Thing 완료!'}
          >
            {oneThing.completed ? (
              <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />
            ) : (
              <Circle className="w-8 h-8 sm:w-9 sm:h-9 stroke-[1.5]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

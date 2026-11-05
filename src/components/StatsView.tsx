import React, { useState } from 'react';
import { 
  Flame, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Trophy, 
  ChevronLeft, 
  ChevronRight,
  Smile,
  Meh,
  Frown,
  Award
} from 'lucide-react';
import type { DailyLog } from '../types';
import { formatDateKorean } from '../utils/storage';

interface StatsViewProps {
  logs: Record<string, DailyLog>;
  streak: { currentStreak: number; bestStreak: number };
  onSelectDate: (dateStr: string) => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  logs,
  streak,
  onSelectDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth(); // 0 ~ 11

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // 이번 달의 날짜들 계산
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0(일) ~ 6(토)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 총 기록된 일수
  const totalLoggedDays = Object.keys(logs).length;
  // 전체 완료된 One Thing 수
  const totalCompletedOneThings = Object.values(logs).filter(l => l.oneThing?.completed).length;

  return (
    <div className="space-y-6">
      {/* 통계 요약 카드들 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>현재 스트릭</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">
            {streak.currentStreak}
            <span className="text-xs font-normal text-slate-500 ml-1">일 연속</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
            <Trophy className="w-4 h-4 text-indigo-500" />
            <span>최고 스트릭</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">
            {streak.bestStreak}
            <span className="text-xs font-normal text-slate-500 ml-1">일 달성</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>One Thing 완료</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">
            {totalCompletedOneThings}
            <span className="text-xs font-normal text-slate-500 ml-1">회</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
            <CalendarIcon className="w-4 h-4 text-blue-500" />
            <span>기록된 일수</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">
            {totalLoggedDays}
            <span className="text-xs font-normal text-slate-500 ml-1">일</span>
          </div>
        </div>
      </div>

      {/* 캘린더 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-indigo-600" />
            <span>{year}년 {month + 1}월 달성 현황</span>
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-2">
          <span className="text-rose-500">일</span>
          <span>월</span>
          <span>화</span>
          <span>수</span>
          <span>목</span>
          <span>금</span>
          <span className="text-blue-500">토</span>
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {/* 전달 빈칸 */}
          {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-14 sm:h-16 rounded-lg bg-slate-50/50" />
          ))}

          {/* 이번 달 날짜들 */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const log = logs[dateStr];
            
            // 완료된 루틴 수 계산
            const completedCount = log 
              ? Object.values(log.routines || {}).filter(r => r.completed).length + (log.oneThing?.completed ? 1 : 0)
              : 0;

            const hasOneThing = log?.oneThing?.completed;
            const hasReview = Boolean(log?.review?.content || log?.reading?.bookTitle);

            return (
              <div
                key={dateStr}
                onClick={() => onSelectDate(dateStr)}
                className={`h-14 sm:h-16 p-1.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  log
                    ? 'border-indigo-100 bg-indigo-50/20 hover:bg-indigo-50/50 hover:border-indigo-300'
                    : 'border-slate-100 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{dayNum}</span>
                  {hasOneThing && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" title="One Thing 완료" />
                  )}
                </div>

                <div className="flex items-end justify-between">
                  {completedCount > 0 ? (
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded">
                      {completedCount}개 완료
                    </span>
                  ) : <span />}

                  {hasReview && (
                    <span className="text-[10px] text-amber-600 font-medium" title="일기/독서 기록 있음">
                      ✍️
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 최근 하루 회고 목록 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>최근 하루 회고 피드</span>
        </h2>

        <div className="space-y-3">
          {Object.entries(logs)
            .filter(([_, log]) => log.review?.content)
            .sort(([a], [b]) => b.localeCompare(a))
            .slice(0, 5)
            .map(([dateStr, log]) => (
              <div
                key={dateStr}
                onClick={() => onSelectDate(dateStr)}
                className="p-3.5 rounded-xl bg-slate-50/70 hover:bg-indigo-50/40 border border-slate-200/70 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <span className="font-semibold text-slate-700">
                    {formatDateKorean(dateStr)}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    {log.review.mood === 'great' && <span className="flex items-center text-emerald-600"><Award className="w-3 h-3 mr-0.5" />최고</span>}
                    {log.review.mood === 'good' && <span className="flex items-center text-blue-600"><Smile className="w-3 h-3 mr-0.5" />만족</span>}
                    {log.review.mood === 'soso' && <span className="flex items-center text-amber-600"><Meh className="w-3 h-3 mr-0.5" />보통</span>}
                    {log.review.mood === 'tired' && <span className="flex items-center text-rose-600"><Frown className="w-3 h-3 mr-0.5" />피곤</span>}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
                  {log.review.content}
                </p>
                {log.nextOneThing && (
                  <p className="text-[11px] text-indigo-600 mt-1 font-medium">
                    🎯 내일 One Thing: {log.nextOneThing}
                  </p>
                )}
              </div>
            ))}

          {Object.entries(logs).filter(([_, log]) => log.review?.content).length === 0 && (
            <p className="text-xs text-slate-400 text-center py-6">
              아직 작성된 하루 회고가 없습니다. 오늘 밤 첫 기록을 남겨보세요!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

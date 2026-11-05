import React, { useState, useEffect, useRef } from 'react';
import { 
  loadAppState, 
  saveAppState, 
  getOrCreateDailyLog, 
  getTodayDateString, 
  calculateStreak, 
  exportDataAsJson, 
  importDataFromJson 
} from './utils/storage';
import type { AppState, DailyLog, RoutineItemConfig } from './types';
import { Header } from './components/Header';
import { OneThingCard } from './components/OneThingCard';
import { RoutineList } from './components/RoutineList';
import { StatsView } from './components/StatsView';
import { BooksView } from './components/BooksView';
import { RecordModal } from './components/RecordModal';
import { EveningTimerModal } from './components/EveningTimerModal';
import { RoutineManagerModal } from './components/RoutineManagerModal';
import { OnboardingModal } from './components/OnboardingModal';
import { Sparkles, Quote } from 'lucide-react';

export const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(loadAppState);
  const [currentDate, setCurrentDate] = useState<string>(getTodayDateString());
  const [activeTab, setActiveTab] = useState<'today' | 'stats' | 'books'>('today');

  // 모달 제어 상태
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    return !appState.hasCompletedOnboarding;
  });

  // 숨겨진 파일 인풋 (백업 가져오기용)
  const fileInputRef = useRef<HTMLInputElement>(null);

  // appState 변경 시마다 localStorage에 동기화
  useEffect(() => {
    saveAppState(appState);
  }, [appState]);

  // 현재 날짜의 DailyLog 가져오기 (없으면 이전 날짜의 nextOneThing 계승하여 생성)
  const currentDailyLog: DailyLog = getOrCreateDailyLog(appState, currentDate);

  // 스트릭 계산
  const streak = calculateStreak(appState.logs);

  // DailyLog 업데이트 헬퍼
  const updateDailyLog = (updatedLog: DailyLog) => {
    setAppState((prev) => ({
      ...prev,
      logs: {
        ...prev.logs,
        [currentDate]: {
          ...updatedLog,
          updatedAt: new Date().toISOString(),
        },
      },
    }));
  };

  // One Thing 업데이트
  const handleUpdateOneThing = (updates: Partial<DailyLog['oneThing']>) => {
    const updatedOneThing = {
      ...currentDailyLog.oneThing,
      ...updates,
    };

    // one-thing 루틴의 상태도 연동
    const updatedRoutines = {
      ...currentDailyLog.routines,
      'one-thing': {
        completed: Boolean(updatedOneThing.completed),
        completedAt: updatedOneThing.completedAt,
        fallbackUsed: updatedOneThing.isFallback,
      },
    };

    updateDailyLog({
      ...currentDailyLog,
      oneThing: updatedOneThing,
      routines: updatedRoutines,
    });
  };

  // 루틴 토글 핸들러
  const handleToggleRoutine = (routineId: string) => {
    if (routineId === 'one-thing') {
      handleUpdateOneThing({ completed: !currentDailyLog.oneThing.completed });
      return;
    }

    const currentStatus = currentDailyLog.routines[routineId] || { completed: false };
    const nextCompleted = !currentStatus.completed;

    const updatedRoutines = {
      ...currentDailyLog.routines,
      [routineId]: {
        ...currentStatus,
        completed: nextCompleted,
        completedAt: nextCompleted 
          ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          : undefined,
      },
    };

    updateDailyLog({
      ...currentDailyLog,
      routines: updatedRoutines,
    });
  };

  // 퇴근 후 1시간 타이머 완료 핸들러
  const handleTimerComplete = (durationMinutes: number) => {
    const updatedRoutines = {
      ...currentDailyLog.routines,
      'evening-study': {
        completed: true,
        completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    };

    updateDailyLog({
      ...currentDailyLog,
      studyTimerMinutes: (currentDailyLog.studyTimerMinutes || 0) + durationMinutes,
      routines: updatedRoutines,
    });

    setIsTimerModalOpen(false);
  };

  // 하루 및 독서 기록 저장 핸들러
  const handleSaveRecord = (data: {
    reading: DailyLog['reading'];
    review: DailyLog['review'];
    nextOneThing: string;
  }) => {
    const updatedRoutines = {
      ...currentDailyLog.routines,
      'daily-record': {
        completed: true,
        completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    };

    updateDailyLog({
      ...currentDailyLog,
      reading: data.reading,
      review: data.review,
      nextOneThing: data.nextOneThing,
      routines: updatedRoutines,
    });

    // 만약 다음 날의 데이터가 아직 없거나 nextOneThing이 비어있다면, 자동으로 다음 날 oneThing.title에도 반영
    const nextDate = getTodayDateString(1);
    if (!appState.logs[nextDate] || !appState.logs[nextDate].oneThing.title) {
      setAppState((prev) => {
        const existingNextLog = prev.logs[nextDate] || getOrCreateDailyLog(prev, nextDate);
        return {
          ...prev,
          logs: {
            ...prev.logs,
            [nextDate]: {
              ...existingNextLog,
              oneThing: {
                ...existingNextLog.oneThing,
                title: data.nextOneThing,
              },
            },
          },
        };
      });
    }
  };

  // 루틴 설정 저장 핸들러
  const handleSaveRoutinesConfig = (newConfig: RoutineItemConfig[]) => {
    setAppState((prev) => ({
      ...prev,
      hasCompletedOnboarding: true,
      routinesConfig: newConfig,
    }));
  };

  // 온보딩에서 추천 루틴 적용 핸들러
  const handleApplyOnboardingRoutines = (selectedRoutines: RoutineItemConfig[]) => {
    setAppState((prev) => ({
      ...prev,
      hasCompletedOnboarding: true,
      routinesConfig: selectedRoutines,
    }));
  };

  // JSON 백업 내보내기 & 가져오기
  const handleExport = () => {
    exportDataAsJson(appState);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importDataFromJson(file);
      setAppState(imported);
      alert('데이터가 성공적으로 복원되었습니다!');
    } catch (err: any) {
      alert(`복원 실패: ${err.message || '파일을 확인해주세요.'}`);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* 백업 파일 인풋 (숨김) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportFile}
        accept=".json"
        className="hidden"
      />

      {/* 헤더 */}
      <Header
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        streak={streak}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExport={handleExport}
        onImportClick={() => fileInputRef.current?.click()}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      {/* 메인 컨테이너 */}
      <main className="max-w-3xl mx-auto px-4 pt-6">
        {activeTab === 'today' && (
          <div className="animate-in fade-in duration-200">
            {/* 1. 오늘의 최상단 The ONE Thing 카드 (사용자 핵심 요구사항) */}
            <OneThingCard
              dailyLog={currentDailyLog}
              onUpdateOneThing={handleUpdateOneThing}
              onOpenReadingModal={() => setIsRecordModalOpen(true)}
            />

            {/* 2. 최소 루틴 타임라인 체크리스트 */}
            <RoutineList
              routinesConfig={appState.routinesConfig}
              dailyLog={currentDailyLog}
              onToggleRoutine={handleToggleRoutine}
              onOpenTimerModal={() => setIsTimerModalOpen(true)}
              onOpenRecordModal={() => setIsRecordModalOpen(true)}
              onOpenOneThingFallback={() => {
                handleUpdateOneThing({ isFallback: !currentDailyLog.oneThing.isFallback });
              }}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenOnboarding={() => setIsOnboardingOpen(true)}
            />

            {/* 3. 오늘 기록된 요약 카드 (기록이 있을 때 바로 확인 가능) */}
            {(currentDailyLog.reading.bookTitle || currentDailyLog.review.content) && (
              <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>오늘 작성한 하루 & 독서 기록</span>
                  </span>
                  <button
                    onClick={() => setIsRecordModalOpen(true)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    수정하기
                  </button>
                </div>

                {currentDailyLog.reading.bookTitle && (
                  <div className="mb-3 text-xs">
                    <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 inline-block mb-1">
                      📖 {currentDailyLog.reading.bookTitle} {currentDailyLog.reading.pages && `(${currentDailyLog.reading.pages})`}
                    </span>
                    {currentDailyLog.reading.keyInsight && (
                      <p className="text-slate-600 pl-1 italic">
                        "{currentDailyLog.reading.keyInsight}"
                      </p>
                    )}
                  </div>
                )}

                {currentDailyLog.review.content && (
                  <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="font-medium text-slate-500 mb-1">하루 회고:</p>
                    <p className="leading-relaxed whitespace-pre-line">{currentDailyLog.review.content}</p>
                  </div>
                )}

                {currentDailyLog.nextOneThing && (
                  <div className="mt-2.5 text-xs text-indigo-700 bg-indigo-50/70 p-2.5 rounded-lg border border-indigo-100 flex items-center gap-2">
                    <span className="font-bold shrink-0">🎯 내일의 One Thing:</span>
                    <span className="truncate">{currentDailyLog.nextOneThing}</span>
                  </div>
                )}
              </div>
            )}

            {/* 하단 시스템 철학 안내 배너 */}
            <div className="mt-8 p-4 rounded-xl bg-slate-100/70 border border-slate-200/80 text-center text-xs text-slate-500 leading-relaxed">
              <Quote className="w-4 h-4 text-slate-400 mx-auto mb-1 opacity-70" />
              "우리는 우리가 반복적으로 하는 행동의 결과다. 탁월함은 행동이 아니라 습관이다."
              <span className="block text-[11px] text-slate-400 mt-0.5 font-normal">
                의지력에 기대지 마세요. 시스템이 당신을 자동으로 데려다줍니다.
              </span>
            </div>
          </div>
        )}

        {/* 캘린더 & 통계 탭 */}
        {activeTab === 'stats' && (
          <div className="animate-in fade-in duration-200">
            <StatsView
              logs={appState.logs}
              streak={streak}
              onSelectDate={(dateStr) => {
                setCurrentDate(dateStr);
                setActiveTab('today');
              }}
            />
          </div>
        )}

        {/* 독서 서재 탭 */}
        {activeTab === 'books' && (
          <div className="animate-in fade-in duration-200">
            <BooksView
              logs={appState.logs}
              onSelectDate={(dateStr) => {
                setCurrentDate(dateStr);
                setActiveTab('today');
              }}
              onOpenRecordForDate={(dateStr) => {
                setCurrentDate(dateStr);
                setIsRecordModalOpen(true);
              }}
            />
          </div>
        )}
      </main>

      {/* 모달들 */}
      <RecordModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        dailyLog={currentDailyLog}
        onSaveRecord={handleSaveRecord}
      />

      <EveningTimerModal
        isOpen={isTimerModalOpen}
        onClose={() => setIsTimerModalOpen(false)}
        onComplete={handleTimerComplete}
      />

      <RoutineManagerModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        routinesConfig={appState.routinesConfig}
        onSaveRoutines={handleSaveRoutinesConfig}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      {/* 최초 사용 또는 템플릿 다시 보기 온보딩 팝업 */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onApplyRoutines={handleApplyOnboardingRoutines}
        onOpenCustomizer={() => setIsSettingsOpen(true)}
      />
    </div>
  );
};

export default App;

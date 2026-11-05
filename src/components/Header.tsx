import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Calendar as CalendarIcon, 
  BookOpen, 
  CheckCircle2, 
  Download, 
  Upload,
  Settings,
  Sparkles,
  Cloud,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { formatDateKorean, getTodayDateString, getPreviousDateString, getNextDateString } from '../utils/storage';

interface HeaderProps {
  currentDate: string;
  onDateChange: (newDate: string) => void;
  streak: { currentStreak: number; bestStreak: number };
  activeTab: 'today' | 'stats' | 'books';
  setActiveTab: (tab: 'today' | 'stats' | 'books') => void;
  onExport: () => void;
  onImportClick: () => void;
  onOpenSettings: () => void;
  onOpenOnboarding: () => void;
  user?: { email?: string } | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  onDateChange,
  streak,
  activeTab,
  setActiveTab,
  onExport,
  onImportClick,
  onOpenSettings,
  onOpenOnboarding,
  user,
  onOpenAuth,
  onLogout,
}) => {
  const todayStr = getTodayDateString();
  const isToday = currentDate === todayStr;

  const handlePrevDay = () => {
    onDateChange(getPreviousDateString(currentDate));
  };

  const handleNextDay = () => {
    onDateChange(getNextDateString(currentDate));
  };

  const handleGoToday = () => {
    onDateChange(todayStr);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-3xl mx-auto px-4 py-3">
        {/* 상단 로고 및 유틸리티 */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-sm shadow-indigo-200">
              <span className="text-lg">1</span>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                1lev_up
                <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                  하루 1레벨 업 루틴
                </span>
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                의지력이 필요 없는 나만의 지속 가능한 하루
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* 클라우드 로그인 / 프로필 버튼 */}
            {user ? (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-xs">
                <UserIcon className="w-3.5 h-3.5 text-indigo-600" />
                <span className="max-w-[100px] sm:max-w-[140px] truncate text-slate-700 font-medium">
                  {user.email?.split('@')[0]}
                </span>
                <button
                  onClick={onLogout}
                  className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors ml-0.5"
                  title="로그아웃"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors shadow-2xs"
                title="로그인하고 기기 간 클라우드 실시간 동기화하기"
              >
                <Cloud className="w-3.5 h-3.5 text-indigo-600" />
                <span>동기화</span>
              </button>
            )}

            {/* 추천 예시 팝업 버튼 */}
            <button
              onClick={onOpenOnboarding}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
              title="추천 예시 루틴 팝업 열기"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>추천 예시</span>
            </button>

            {/* 스트릭 배지 */}
            <div 
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold shadow-xs"
              title={`현재 ${streak.currentStreak}일 연속 달성 중! (최고 기록: ${streak.bestStreak}일)`}
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{streak.currentStreak}일 연속</span>
            </div>

            {/* 백업 / 복원 버튼 */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
              <button
                onClick={onExport}
                className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-white rounded-md transition-all text-xs flex items-center"
                title="데이터 백업 (JSON 다운로드)"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onImportClick}
                className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-white rounded-md transition-all text-xs flex items-center"
                title="데이터 복원 (JSON 가져오기)"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 설정 버튼 */}
            <button
              onClick={onOpenSettings}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="루틴 목록 관리"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('today')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'today'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>오늘의 루틴</span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'stats'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>캘린더 & 통계</span>
            </button>

            <button
              onClick={() => setActiveTab('books')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'books'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>독서 서재</span>
            </button>
          </div>

          {/* 날짜 네비게이션 (오늘 탭일 때만 활성) */}
          {activeTab === 'today' && (
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevDay}
                className="p-1 rounded hover:bg-slate-100 text-slate-600 transition-colors"
                title="이전 날"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-1 px-1.5 text-xs sm:text-sm font-semibold text-slate-800">
                <span>{formatDateKorean(currentDate)}</span>
                {!isToday && (
                  <button
                    onClick={handleGoToday}
                    className="ml-1 text-[11px] font-medium px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                  >
                    오늘로
                  </button>
                )}
              </div>

              <button
                onClick={handleNextDay}
                className="p-1 rounded hover:bg-slate-100 text-slate-600 transition-colors"
                title="다음 날"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

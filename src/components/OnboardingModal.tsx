import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Sun, 
  Footprints, 
  Target, 
  Utensils, 
  Laptop, 
  Moon, 
  ArrowRight,
  Sliders,
  Check,
  Circle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { RoutineItemConfig } from '../types';
import { DEFAULT_ROUTINES } from '../utils/storage';

interface OnboardingModalProps {
  isOpen: boolean;
  onApplyRoutines: (selectedRoutines: RoutineItemConfig[]) => void;
  onOpenCustomizer: () => void;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onApplyRoutines,
  onOpenCustomizer,
  onClose,
}) => {
  // 사용자가 추천 루틴 중 원하는 항목만 켜고 끌 수 있도록 선택 상태 관리
  const [selectedIds, setSelectedIds] = useState<string[]>(
    DEFAULT_ROUTINES.map(r => r.id)
  );

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectAll = () => {
    setSelectedIds(DEFAULT_ROUTINES.map(r => r.id));
  };

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

  const handleApplyDefault = () => {
    const chosen = DEFAULT_ROUTINES.filter(r => selectedIds.includes(r.id));
    onApplyRoutines(chosen.length > 0 ? chosen : DEFAULT_ROUTINES);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onClose();
  };

  const handleStartBlank = () => {
    // 핵심 2가지(원씽 + 기록)만 남기거나 빈 템플릿
    const minimal = DEFAULT_ROUTINES.filter(r => r.id === 'one-thing' || r.id === 'daily-record');
    onApplyRoutines(minimal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 비주얼 헤더 */}
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 px-6 py-6 text-white text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-indigo-100 text-xs font-semibold backdrop-blur-xs mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>1lev_up 최소 습관 시스템 가이드</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-1.5">
            매일 1레벨 업! 나만의 지속 가능한 루틴
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100/90 max-w-md mx-auto leading-relaxed">
            의지력으로 억지로 버티지 마세요. 지치고 힘든 날에도 무너지지 않는 <strong>"최소한의 기본 루틴 예시"</strong>를 준비했습니다.
          </p>
        </div>

        {/* 본문: 추천 루틴 예시 리스트 */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span>추천 시스템 루틴 예시 (6가지)</span>
              <span className="text-indigo-600 font-semibold">({selectedIds.length}/{DEFAULT_ROUTINES.length})</span>
            </span>
            <button
              onClick={selectAll}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              전체 선택
            </button>
          </div>

          <div className="space-y-2">
            {DEFAULT_ROUTINES.map((routine) => {
              const isSelected = selectedIds.includes(routine.id);
              const isCore = routine.id === 'one-thing' || routine.id === 'daily-record';

              return (
                <div
                  key={routine.id}
                  onClick={() => toggleSelect(routine.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/50 border-indigo-200 text-slate-900 shadow-2xs'
                      : 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      type="button"
                      className={`shrink-0 transition-colors ${
                        isSelected ? 'text-indigo-600' : 'text-slate-300'
                      }`}
                    >
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 fill-indigo-100 text-indigo-600" />
                      ) : (
                        <Circle className="w-5 h-5 stroke-[1.5]" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="shrink-0 p-1 rounded-md bg-white border border-slate-100 shadow-2xs">
                          {getRoutineIcon(routine.id)}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold truncate">
                          {routine.title}
                        </h4>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-500 font-medium border border-slate-200 shrink-0">
                          {routine.timeHint}
                        </span>
                        {isCore && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold shrink-0">
                            핵심
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 pl-6 truncate">
                        {routine.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400 text-center leading-relaxed">
            * 시작한 뒤 언제든 설정 메뉴에서 루틴의 이름, 시간, 설명을 자유롭게 수정하거나 새로운 루틴을 추가/삭제할 수 있습니다.
          </p>
        </div>

        {/* 하단 액션 버튼들 */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200/80 space-y-2">
          {/* 메인 버튼: 예시 그대로 사용하기 */}
          <button
            onClick={handleApplyDefault}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-200 transition-all transform active:scale-98 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>이 예시 그대로 내 루틴으로 사용하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* 보조 버튼들 */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <button
              onClick={() => {
                onClose();
                onOpenCustomizer();
              }}
              className="text-slate-600 hover:text-indigo-600 font-medium flex items-center gap-1 py-1"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>직접 하나씩 수정하며 만들기</span>
            </button>

            <button
              onClick={handleStartBlank}
              className="text-slate-400 hover:text-slate-600 transition-colors py-1"
            >
              빈 루틴으로 시작
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Sparkles, 
  Edit3, 
  Check, 
  ArrowUp, 
  ArrowDown,
  BookOpen
} from 'lucide-react';
import type { RoutineItemConfig, RoutineCategory } from '../types';
import { DEFAULT_ROUTINES } from '../utils/storage';

interface RoutineManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  routinesConfig: RoutineItemConfig[];
  onSaveRoutines: (newConfig: RoutineItemConfig[]) => void;
  onOpenOnboarding: () => void;
}

export const RoutineManagerModal: React.FC<RoutineManagerModalProps> = ({
  isOpen,
  onClose,
  routinesConfig,
  onSaveRoutines,
  onOpenOnboarding,
}) => {
  const [routines, setRoutines] = useState<RoutineItemConfig[]>(routinesConfig);
  const [editingId, setEditingId] = useState<string | null>(null);

  // 수정 중인 임시 데이터
  const [editTitle, setEditTitle] = useState('');
  const [editTimeHint, setEditTimeHint] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCategory, setEditCategory] = useState<RoutineCategory>('morning');

  // 신규 추가 폼 상태
  const [newTitle, setNewTitle] = useState('');
  const [newTimeHint, setNewTimeHint] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<RoutineCategory>('morning');

  // 모달이 열릴 때 동기화
  React.useEffect(() => {
    if (isOpen) {
      setRoutines(routinesConfig);
      setEditingId(null);
    }
  }, [isOpen, routinesConfig]);

  if (!isOpen) return null;

  // 수정 모드 시작
  const handleStartEdit = (routine: RoutineItemConfig) => {
    setEditingId(routine.id);
    setEditTitle(routine.title);
    setEditTimeHint(routine.timeHint);
    setEditDesc(routine.description);
    setEditCategory(routine.category);
  };

  // 수정 사항 저장
  const handleSaveEdit = (id: string) => {
    if (!editTitle.trim()) return;
    const updated = routines.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          title: editTitle.trim(),
          timeHint: editTimeHint.trim() || '일상',
          description: editDesc.trim(),
          category: editCategory,
        };
      }
      return r;
    });
    setRoutines(updated);
    onSaveRoutines(updated);
    setEditingId(null);
  };

  // 루틴 삭제
  const handleDeleteRoutine = (id: string) => {
    if (window.confirm('이 루틴을 삭제하시겠습니까?')) {
      const updated = routines.filter(r => r.id !== id);
      setRoutines(updated);
      onSaveRoutines(updated);
      if (editingId === id) setEditingId(null);
    }
  };

  // 순서 위로 이동
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...routines];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setRoutines(updated);
    onSaveRoutines(updated);
  };

  // 순서 아래로 이동
  const handleMoveDown = (index: number) => {
    if (index === routines.length - 1) return;
    const updated = [...routines];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setRoutines(updated);
    onSaveRoutines(updated);
  };

  // 신규 루틴 추가
  const handleAddRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: RoutineItemConfig = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      timeHint: newTimeHint.trim() || '일상',
      description: newDesc.trim() || '나만의 일상 루틴',
      category: newCategory,
      type: 'standard',
      isCustom: true,
    };

    const updated = [...routines, newItem];
    setRoutines(updated);
    onSaveRoutines(updated);
    setNewTitle('');
    setNewTimeHint('');
    setNewDesc('');
  };

  // 기본 추천 예시 루틴으로 재설정
  const handleResetToDefault = () => {
    if (window.confirm('추천 예시 루틴(6가지)으로 다시 설정하시겠습니까? 기존 커스텀 루틴은 초기화됩니다.')) {
      setRoutines(DEFAULT_ROUTINES);
      onSaveRoutines(DEFAULT_ROUTINES);
      setEditingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              루틴 직접 수정 & 관리
            </h2>
            <p className="text-xs text-slate-500">
              내 하루 리듬에 맞게 루틴의 이름, 시간, 순서를 자유롭게 조정하세요
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 본문 스크롤 */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* 상단 액션 바: 추천 예시 팝업 열기 & 기본 복원 */}
          <div className="flex items-center justify-between bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100">
            <button
              onClick={() => {
                onClose();
                onOpenOnboarding();
              }}
              className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>추천 예시 팝업 다시 보기</span>
            </button>

            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1"
              title="초기 6가지 추천 루틴으로 리셋"
            >
              <RotateCcw className="w-3 h-3" />
              <span>추천 예시로 초기화</span>
            </button>
          </div>

          {/* 현재 루틴 목록 (수정 및 순서 이동 가능) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                현재 루틴 목록 ({routines.length}개)
              </span>
              <span className="text-[11px] text-slate-400">
                수정(✏️) 또는 순서 이동(▲▼) 가능
              </span>
            </div>

            {routines.map((routine, idx) => {
              const isEditing = editingId === routine.id;

              if (isEditing) {
                return (
                  <div key={routine.id} className="p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-200 space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">루틴 제목</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-indigo-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">시간대 / 시점</label>
                        <input
                          type="text"
                          value={editTimeHint}
                          onChange={(e) => setEditTimeHint(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-indigo-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">시간대 분류</label>
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value as RoutineCategory)}
                          className="w-full px-2 py-1.5 bg-white border border-indigo-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="morning">☀️ 아침</option>
                          <option value="lunch">🥗 점심</option>
                          <option value="evening">💻 저녁/퇴근 후</option>
                          <option value="night">🌙 취침 전</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">설명</label>
                        <input
                          type="text"
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-indigo-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-1.5 pt-1">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2.5 py-1 rounded bg-slate-200 text-slate-700 hover:bg-slate-300 font-medium"
                      >
                        취소
                      </button>
                      <button
                        onClick={() => handleSaveEdit(routine.id)}
                        className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 font-semibold flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>수정 완료</span>
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={routine.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all text-xs"
                >
                  <div className="min-w-0 flex-1 mr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 truncate">
                        {routine.title}
                      </span>
                      <span className="text-[10px] bg-slate-200/70 px-1.5 py-0.5 rounded text-slate-600 shrink-0 font-medium">
                        {routine.timeHint}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] truncate mt-0.5">
                      {routine.description}
                    </p>
                  </div>

                  {/* 제어 버튼군: 순서 이동, 수정, 삭제 */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleMoveUp(idx)}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 transition-colors"
                      title="위로 이동"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(idx)}
                      disabled={idx === routines.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 transition-colors"
                      title="아래로 이동"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleStartEdit(routine)}
                      className="p-1 text-slate-400 hover:text-indigo-600 transition-colors ml-0.5"
                      title="루틴 수정"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteRoutine(routine.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                      title="루틴 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {routines.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                등록된 루틴이 없습니다. 아래에서 새 루틴을 추가해보세요.
              </p>
            )}
          </div>

          {/* 새 루틴 추가 폼 */}
          <form onSubmit={handleAddRoutine} className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/30 space-y-3">
            <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>새로운 나만의 루틴 추가</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5 font-medium">루틴 이름</label>
                <input
                  type="text"
                  placeholder="예: 영양제 챙겨먹기, 저녁 스트레칭"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5 font-medium">시간대 / 시점</label>
                <input
                  type="text"
                  placeholder="예: 아침 식후, 밤 10시"
                  value={newTimeHint}
                  onChange={(e) => setNewTimeHint(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5 font-medium">시간대 분류</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as RoutineCategory)}
                  className="w-full text-xs px-2 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700"
                >
                  <option value="morning">☀️ 아침</option>
                  <option value="lunch">🥗 점심</option>
                  <option value="evening">💻 저녁/퇴근 후</option>
                  <option value="night">🌙 취침 전</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-0.5 font-medium">간단한 설명</label>
                <input
                  type="text"
                  placeholder="예: 물 한 잔과 함께 오메가3 섭취"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!newTitle.trim()}
              className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>루틴 추가하기</span>
            </button>
          </form>
        </div>

        {/* 하단 닫기 */}
        <div className="p-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
          >
            저장 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};

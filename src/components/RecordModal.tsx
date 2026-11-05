import React, { useState, useEffect } from 'react';
import { X, BookOpen, PenTool, Target, Sparkles, Check, Smile, Meh, Frown, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { DailyLog } from '../types';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyLog: DailyLog;
  onSaveRecord: (data: {
    reading: DailyLog['reading'];
    review: DailyLog['review'];
    nextOneThing: string;
  }) => void;
}

export const RecordModal: React.FC<RecordModalProps> = ({
  isOpen,
  onClose,
  dailyLog,
  onSaveRecord,
}) => {
  const [bookTitle, setBookTitle] = useState('');
  const [pages, setPages] = useState('');
  const [keyInsight, setKeyInsight] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [mood, setMood] = useState<'great' | 'good' | 'soso' | 'tired'>('good');
  const [nextOneThing, setNextOneThing] = useState('');

  // dailyLog가 변경되거나 모달이 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setBookTitle(dailyLog.reading.bookTitle || '');
      setPages(dailyLog.reading.pages || '');
      setKeyInsight(dailyLog.reading.keyInsight || '');
      setReviewContent(dailyLog.review.content || '');
      setMood(dailyLog.review.mood || 'good');
      setNextOneThing(dailyLog.nextOneThing || '');
    }
  }, [isOpen, dailyLog]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveRecord({
      reading: {
        bookTitle: bookTitle.trim(),
        pages: pages.trim(),
        keyInsight: keyInsight.trim(),
      },
      review: {
        content: reviewContent.trim(),
        mood,
      },
      nextOneThing: nextOneThing.trim(),
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-600 text-white">
              <PenTool className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                오늘 하루 및 독서 기록
              </h2>
              <p className="text-xs text-slate-500">
                하루를 매듭짓고, 내일의 가장 중요한 일 1가지를 정합니다
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 폼 본문 (스크롤) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* 섹션 1: 독서 기록 */}
          <div className="bg-amber-50/40 rounded-xl p-4 border border-amber-100 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>오늘의 독서 기록</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-600 mb-1 font-medium">
                  책 제목
                </label>
                <input
                  type="text"
                  placeholder="예: 아주 작은 습관의 힘, 원씽"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  className="w-full text-sm px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">
                  분량 / 시간
                </label>
                <input
                  type="text"
                  placeholder="예: 15분 또는 p.30-55"
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                  className="w-full text-sm px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-600 mb-1 font-medium">
                인상 깊은 문장 & 내 생각
              </label>
              <textarea
                rows={3}
                placeholder="마음에 와닿은 한 구절이나 내 삶에 적용할 아이디어를 적어보세요."
                value={keyInsight}
                onChange={(e) => setKeyInsight(e.target.value)}
                className="w-full text-sm p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
          </div>

          {/* 섹션 2: 오늘 하루 회고 */}
          <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>오늘 하루 짧은 회고</span>
              </div>

              {/* 기분 선택 */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setMood('great')}
                  className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
                    mood === 'great' ? 'bg-emerald-100 text-emerald-800 font-bold ring-1 ring-emerald-300' : 'text-slate-400 hover:bg-slate-200/60'
                  }`}
                  title="최고였어요"
                >
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">최고</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMood('good')}
                  className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
                    mood === 'good' ? 'bg-blue-100 text-blue-800 font-bold ring-1 ring-blue-300' : 'text-slate-400 hover:bg-slate-200/60'
                  }`}
                  title="만족해요"
                >
                  <Smile className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">만족</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMood('soso')}
                  className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
                    mood === 'soso' ? 'bg-amber-100 text-amber-800 font-bold ring-1 ring-amber-300' : 'text-slate-400 hover:bg-slate-200/60'
                  }`}
                  title="보통이에요"
                >
                  <Meh className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden sm:inline">보통</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMood('tired')}
                  className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
                    mood === 'tired' ? 'bg-rose-100 text-rose-800 font-bold ring-1 ring-rose-300' : 'text-slate-400 hover:bg-slate-200/60'
                  }`}
                  title="지쳤지만 잘 버텼어요"
                >
                  <Frown className="w-3.5 h-3.5 text-rose-600" />
                  <span className="hidden sm:inline">피곤</span>
                </button>
              </div>
            </div>

            <textarea
              rows={3}
              placeholder="오늘 잘한 점, 감사했던 순간, 또는 내일 나아지고 싶은 점을 가볍게 적어보세요."
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              className="w-full text-sm p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* 섹션 3: ⭐ 내일 해야 할 가장 중요한 일 1가지 (Next One Thing) */}
          <div className="bg-gradient-to-br from-indigo-50/70 to-blue-50/50 rounded-xl p-4 border border-indigo-200/80 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center">
                <Target className="w-3.5 h-3.5" />
              </span>
              <span className="text-sm font-bold text-indigo-950">
                내일 해야 할 가장 중요한 일 1가지 (Next ONE Thing)
              </span>
            </div>

            <p className="text-xs text-indigo-700/80 leading-relaxed">
              💡 자기 전 내일 할 단 하나의 일만 미리 정해두세요. 내일 아침 눈떴을 때 의사결정 고민 없이 바로 몰입할 수 있습니다.
            </p>

            <input
              type="text"
              placeholder="예: 핵심 보고서 1차 초안 작성, 알고리즘 2문제 풀이 등"
              value={nextOneThing}
              onChange={(e) => setNextOneThing(e.target.value)}
              className="w-full text-sm font-semibold px-3 py-2.5 bg-white border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
            />
            <p className="text-[11px] text-slate-400">
              * 여기에 적은 내용은 내일 날짜 앱 화면의 최상단 'The ONE Thing' 카드에 자동으로 연결됩니다.
            </p>
          </div>

          {/* 하단 저장 버튼 */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium"
            >
              닫기
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>기록 저장 & 루틴 완료</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

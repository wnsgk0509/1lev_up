import React, { useState } from 'react';
import { BookOpen, Calendar, Quote, Search } from 'lucide-react';
import type { DailyLog } from '../types';
import { formatDateKorean } from '../utils/storage';

interface BooksViewProps {
  logs: Record<string, DailyLog>;
  onSelectDate: (dateStr: string) => void;
  onOpenRecordForDate: (dateStr: string) => void;
}

export const BooksView: React.FC<BooksViewProps> = ({
  logs,
  onSelectDate,
  onOpenRecordForDate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // 독서 기록이 있는 날짜들만 필터링 및 최신순 정렬
  const readingList = Object.entries(logs)
    .filter(([_, log]) => log.reading?.bookTitle?.trim() || log.reading?.keyInsight?.trim())
    .map(([dateStr, log]) => ({
      dateStr,
      bookTitle: log.reading.bookTitle || '무제',
      pages: log.reading.pages,
      keyInsight: log.reading.keyInsight,
    }))
    .sort((a, b) => b.dateStr.localeCompare(a.dateStr));

  const filteredList = readingList.filter(item => 
    item.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.keyInsight && item.keyInsight.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* 서재 상단 배너 & 검색 */}
      <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-5 rounded-2xl border border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-800 font-bold text-base">
            <BookOpen className="w-5 h-5 text-amber-600" />
            <span>나만의 독서 서재 & 인사이트 노트</span>
          </div>
          <p className="text-xs text-amber-900/70 mt-1">
            총 <span className="font-bold text-amber-700">{readingList.length}권</span>의 독서 기록과 문장들이 쌓여가고 있습니다.
          </p>
        </div>

        {/* 검색 인풋 */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="책 제목 또는 문장 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* 독서 기록 리스트 (카드 그리드) */}
      {filteredList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredList.map((item) => (
            <div
              key={item.dateStr}
              className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* 상단 날짜 및 분량 */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDateKorean(item.dateStr)}</span>
                  </div>
                  {item.pages && (
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-medium text-[11px] border border-amber-100">
                      {item.pages}
                    </span>
                  )}
                </div>

                {/* 책 제목 */}
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5 mb-2.5">
                  <span className="text-amber-500">📖</span>
                  <span>{item.bookTitle}</span>
                </h3>

                {/* 인상 깊은 구절 / 생각 */}
                {item.keyInsight && (
                  <div className="relative bg-slate-50/70 rounded-lg p-3 text-xs sm:text-sm text-slate-700 leading-relaxed border border-slate-100">
                    <Quote className="w-4 h-4 text-slate-300 absolute -top-1.5 -left-1 transform -scale-x-100 opacity-60" />
                    <p className="pl-2 italic">"{item.keyInsight}"</p>
                  </div>
                )}
              </div>

              {/* 하단 바로가기 액션 */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => onSelectDate(item.dateStr)}
                  className="text-slate-500 hover:text-indigo-600 transition-colors font-medium"
                >
                  이 날짜 루틴 보기 →
                </button>
                <button
                  onClick={() => onOpenRecordForDate(item.dateStr)}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  기록 수정
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-700">기록된 독서 노트가 없습니다</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            오늘 루틴에서 독서를 하거나 밤에 하루 기록을 작성할 때 읽은 책의 구절을 적어보세요.
          </p>
        </div>
      )}
    </div>
  );
};

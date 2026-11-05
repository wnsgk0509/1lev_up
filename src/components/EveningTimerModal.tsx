import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, CheckCircle2, Laptop, Bell } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EveningTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (durationMinutes: number) => void;
}

export const EveningTimerModal: React.FC<EveningTimerModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [isRunning, setIsRunning] = useState(false);

  // 모달 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(selectedMinutes * 60);
      setIsRunning(false);
    }
  }, [isOpen, selectedMinutes]);

  // 타이머 인터벌
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      // 축하 및 완료 처리
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
      onComplete(selectedMinutes);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft, selectedMinutes, onComplete]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progress = ((selectedMinutes * 60 - timeLeft) / (selectedMinutes * 60)) * 100;

  const handlePresetChange = (mins: number) => {
    setSelectedMinutes(mins);
    setTimeLeft(mins * 60);
    setIsRunning(false);
  };

  const handleFinishEarly = () => {
    const elapsedMinutes = Math.round((selectedMinutes * 60 - timeLeft) / 60);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    onComplete(Math.max(1, elapsedMinutes));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-violet-600 text-white">
              <Laptop className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                퇴근 후 자기계발 몰입 타이머
              </h2>
              <p className="text-xs text-slate-500">
                스마트폰을 멀리하고 나만의 성장에 온전히 몰입하세요
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 시간 프리셋 선택 */}
        <div className="flex items-center justify-center gap-2 my-5">
          {[30, 45, 60, 90].map((mins) => (
            <button
              key={mins}
              onClick={() => handlePresetChange(mins)}
              disabled={isRunning}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedMinutes === mins
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50'
              }`}
            >
              {mins}분 {mins === 60 && '⭐️ (기본)'}
            </button>
          ))}
        </div>

        {/* 타이머 원형 디스플레이 */}
        <div className="flex flex-col items-center justify-center my-4">
          <div className="relative w-52 h-52 flex items-center justify-center">
            {/* 배경 원 SVG */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="104"
                cy="104"
                r="90"
                stroke="#f1f5f9"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="104"
                cy="104"
                r="90"
                stroke="#7c3aed"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={565.48}
                strokeDashoffset={565.48 - (565.48 * progress) / 100}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>

            {/* 타이머 텍스트 중앙 */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold tracking-tight text-slate-800 font-mono">
                {formattedTime}
              </span>
              <span className="text-xs text-slate-400 mt-1 font-medium">
                {isRunning ? '몰입 진행 중...' : '준비 완료'}
              </span>
            </div>
          </div>
        </div>

        {/* 제어 버튼 */}
        <div className="flex items-center justify-center gap-4 mt-3 mb-2">
          <button
            onClick={() => {
              setTimeLeft(selectedMinutes * 60);
              setIsRunning(false);
            }}
            className="p-3 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="초기화"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-4 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-200 transition-all transform active:scale-95 flex items-center justify-center"
            title={isRunning ? '일시정지' : '시작'}
          >
            {isRunning ? (
              <Pause className="w-6 h-6 fill-white" />
            ) : (
              <Play className="w-6 h-6 fill-white ml-0.5" />
            )}
          </button>

          <button
            onClick={handleFinishEarly}
            className="p-3 rounded-full text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
            title="지금까지 집중한 시간으로 완료 처리"
          >
            <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>

        {/* 하단 팁 */}
        <div className="mt-4 p-3 rounded-xl bg-violet-50/60 border border-violet-100 flex items-start gap-2">
          <Bell className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
          <p className="text-xs text-violet-900 leading-relaxed">
            퇴근 후 1시간은 남들의 시선에서 벗어나 내 삶의 방향키를 쥐는 시간입니다. 집중이 끝난 후 오늘 하루 기록을 남겨보세요.
          </p>
        </div>
      </div>
    </div>
  );
};

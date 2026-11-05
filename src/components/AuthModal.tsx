import React, { useState } from 'react';
import { X, Cloud, Mail, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  // 소셜 로그인 핸들러 (Google)
  const handleOAuthLogin = async (provider: 'google' | 'kakao') => {
    if (!isSupabaseConfigured) {
      setMessage({
        type: 'error',
        text: 'Supabase 연동 정보가 설정되지 않았습니다. .env 파일에 VITE_SUPABASE_URL 및 VITE_SUPABASE_PUBLISHABLE_KEY를 등록해주세요.',
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || '로그인 중 오류가 발생했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  // 이메일 매직 링크 로그인
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    if (!isSupabaseConfigured) {
      setMessage({
        type: 'error',
        text: 'Supabase 연동 정보가 설정되지 않았습니다. .env 설정을 확인해주세요.',
      });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: '입력하신 이메일로 로그인 인증 링크가 발송되었습니다. 메일함을 확인해주세요!',
      });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || '로그인 링크 발송 실패' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-600 text-white">
              <Cloud className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                클라우드 동기화 & 로그인
              </h2>
              <p className="text-xs text-slate-500">
                모바일과 PC 어디서든 내 루틴을 안전하게 이어가세요
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

        {/* 혜택 안내 배너 */}
        <div className="my-4 p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-indigo-900">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>로그인 시 이런 점이 좋아요</span>
          </div>
          <ul className="text-indigo-800/80 space-y-1 pl-4 list-disc text-[11px]">
            <li>현재 브라우저에 작성된 루틴과 기록이 내 계정으로 <strong>자동 보존</strong>됩니다.</li>
            <li>스마트폰, 태블릿, PC 어디서 접속해도 <strong>실시간 동기화</strong>됩니다.</li>
            <li>기기 변경이나 캐시 삭제 시에도 <strong>데이터 유실 위험 0%</strong>!</li>
          </ul>
        </div>

        {/* 안내 메시지 알림 */}
        {message && (
          <div className={`p-3 rounded-xl text-xs flex items-start gap-2 mb-4 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <p className="leading-relaxed">{message.text}</p>
          </div>
        )}

        {/* 소셜 로그인 버튼들 */}
        <div className="space-y-2.5 my-2">
          {/* 구글 로그인 */}
          <button
            type="button"
            onClick={() => handleOAuthLogin('google')}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-2.5 shadow-2xs disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google 계정으로 계속하기</span>
          </button>

          {/* 카카오 로그인 */}
          <button
            type="button"
            onClick={() => handleOAuthLogin('kakao')}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#FEE500] hover:bg-[#FDD835] text-[#3C1E1E] font-semibold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-2xs disabled:opacity-50"
          >
            <span className="font-black text-xs">💬</span>
            <span>카카오로 3초 만에 시작하기</span>
          </button>
        </div>

        {/* 구분선 */}
        <div className="relative flex py-3 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="shrink mx-3 text-slate-400 text-[11px]">또는 이메일 간편 로그인</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* 이메일 매직 링크 폼 */}
        <form onSubmit={handleEmailLogin} className="space-y-2.5">
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <span>로그인 링크 전송</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* 게스트 안내 */}
        <p className="text-[11px] text-slate-400 text-center mt-4">
          * 로그인하지 않아도 현재 브라우저의 로컬 저장소로 계속 이용하실 수 있습니다.
        </p>
      </div>
    </div>
  );
};

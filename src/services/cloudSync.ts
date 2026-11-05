import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { AppState, DailyLog, RoutineItemConfig } from '../types';

export interface UserProfile {
  id: string;
  email?: string;
  nickname?: string;
  currentStreak: number;
  bestStreak: number;
}

// 1. 클라우드에서 전체 사용자 데이터 로드
export async function fetchCloudState(userId: string): Promise<AppState | null> {
  if (!isSupabaseConfigured) return null;

  try {
    // 루틴 목록 가져오기
    const { data: routinesData, error: routinesError } = await supabase
      .from('routines')
      .select('*')
      .eq('user_id', userId)
      .order('order_index', { ascending: true });

    if (routinesError) throw routinesError;

    // 일별 기록 로그 가져오기
    const { data: logsData, error: logsError } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', userId);

    if (logsError) throw logsError;

    // RoutineItemConfig[] 매핑
    const routinesConfig: RoutineItemConfig[] = (routinesData || []).map((r) => ({
      id: r.id,
      title: r.title,
      timeHint: r.time_hint,
      category: r.category,
      description: r.description || '',
      type: r.type,
      fallbackText: r.fallback_text || undefined,
      isCustom: r.is_custom,
    }));

    // DailyLog Record 매핑
    const logs: Record<string, DailyLog> = {};
    (logsData || []).forEach((row) => {
      logs[row.date] = {
        date: row.date,
        routines: row.routines || {},
        oneThing: row.one_thing || { title: '', isFallback: false, completed: false },
        nextOneThing: row.next_one_thing || '',
        reading: row.reading || { bookTitle: '', pages: '', keyInsight: '' },
        review: row.review || { content: '', mood: 'good' },
        studyTimerMinutes: row.study_timer_minutes || 0,
        updatedAt: row.updated_at,
      };
    });

    return {
      hasCompletedOnboarding: true,
      routinesConfig,
      logs,
    };
  } catch (err) {
    console.error('Failed to fetch cloud state from Supabase:', err);
    return null;
  }
}

// 2. 스마트 병합: 로컬 데이터를 클라우드로 마이그레이션 및 동기화
export async function migrateLocalToCloud(userId: string, localState: AppState): Promise<AppState> {
  if (!isSupabaseConfigured) return localState;

  try {
    // 1) 클라우드에 기존 루틴이 있는지 확인
    const { data: existingRoutines } = await supabase
      .from('routines')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    // 클라우드 루틴이 비어있다면 로컬 루틴 업로드
    if (!existingRoutines || existingRoutines.length === 0) {
      const routineRows = localState.routinesConfig.map((r, idx) => ({
        user_id: userId,
        title: r.title,
        time_hint: r.timeHint,
        category: r.category,
        description: r.description,
        type: r.type,
        fallback_text: r.fallbackText || null,
        order_index: idx,
        is_custom: Boolean(r.isCustom),
      }));

      if (routineRows.length > 0) {
        await supabase.from('routines').insert(routineRows);
      }
    }

    // 2) 로컬 daily_logs 중 클라우드에 없거나 최신인 것 upsert
    const logEntries = Object.entries(localState.logs);
    if (logEntries.length > 0) {
      const logRows = logEntries.map(([date, log]) => ({
        user_id: userId,
        date,
        routines: log.routines,
        one_thing: log.oneThing,
        next_one_thing: log.nextOneThing || '',
        reading: log.reading,
        review: log.review,
        study_timer_minutes: log.studyTimerMinutes || 0,
        updated_at: log.updatedAt || new Date().toISOString(),
      }));

      await supabase.from('daily_logs').upsert(logRows, { onConflict: 'user_id,date' });
    }

    // 클라우드의 최종 상태를 다시 로드하여 반환
    const cloudMerged = await fetchCloudState(userId);
    return cloudMerged || localState;
  } catch (err) {
    console.error('Failed to migrate local data to cloud:', err);
    return localState;
  }
}

// 3. 단일 날짜 DailyLog 클라우드 저장
export async function saveDailyLogToCloud(userId: string, dateStr: string, log: DailyLog): Promise<void> {
  if (!isSupabaseConfigured) return;

  try {
    await supabase.from('daily_logs').upsert({
      user_id: userId,
      date: dateStr,
      routines: log.routines,
      one_thing: log.oneThing,
      next_one_thing: log.nextOneThing || '',
      reading: log.reading,
      review: log.review,
      study_timer_minutes: log.studyTimerMinutes || 0,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,date' });
  } catch (err) {
    console.error('Failed to save daily log to cloud:', err);
  }
}

// 4. 루틴 목록 전체 클라우드 동기화
export async function saveRoutinesToCloud(userId: string, routines: RoutineItemConfig[]): Promise<void> {
  if (!isSupabaseConfigured) return;

  try {
    // 기존 루틴 삭제 후 재등록
    await supabase.from('routines').delete().eq('user_id', userId);

    const routineRows = routines.map((r, idx) => ({
      user_id: userId,
      title: r.title,
      time_hint: r.timeHint,
      category: r.category,
      description: r.description,
      type: r.type,
      fallback_text: r.fallbackText || null,
      order_index: idx,
      is_custom: Boolean(r.isCustom),
    }));

    if (routineRows.length > 0) {
      await supabase.from('routines').insert(routineRows);
    }
  } catch (err) {
    console.error('Failed to save routines to cloud:', err);
  }
}

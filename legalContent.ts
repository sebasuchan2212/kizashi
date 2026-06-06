import type { KizashiInput, KizashiResult } from '../domain/types';
import { mockAnalyzeKizashi } from './mockAnalyzeKizashi';

export interface AnalyzeResponse {
  result: KizashiResult;
  source: 'ai' | 'fallback';
  message?: string;
}

export async function analyzeKizashi(input: KizashiInput): Promise<AnalyzeResponse> {
  const fallback = () => ({
    result: mockAnalyzeKizashi(input),
    source: 'fallback' as const,
    message: 'AI診断APIに接続できなかったため、ローカル診断エンジンで結果を生成しました。'
  });

  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 22000);

    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: controller.signal
    });

    window.clearTimeout(timer);

    if (!response.ok) {
      return fallback();
    }

    const data = (await response.json()) as AnalyzeResponse;
    if (!data?.result?.headline || !Array.isArray(data.result.next_actions)) {
      return fallback();
    }

    return data;
  } catch {
    return fallback();
  }
}

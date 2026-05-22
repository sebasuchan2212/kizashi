import type { KizashiInput, KizashiResult } from '../domain/types';
import { KizashiAnalyzer } from '../engine/KizashiAnalyzer';

const analyzer = new KizashiAnalyzer();

export function mockAnalyzeKizashi(input: KizashiInput): KizashiResult {
  return analyzer.analyze(input);
}

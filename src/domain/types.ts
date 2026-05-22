export type Domain = '恋愛' | '仕事' | 'ウェルネス';
export type TimeHorizon = '2週間' | '1か月' | '3か月';
export type ScenarioName = '楽観' | '基準' | '注意';
export type EmotionalTone = '静かな不安' | '期待と迷い' | '整理途中' | '負荷が高い' | '前向きな揺れ';

export interface KizashiInput {
  domain: Domain;
  question: string;
  stateSummary: string;
  timeHorizon: TimeHorizon;
  emotionIntensity: number;
}

export interface Scenario {
  name: ScenarioName;
  probability_band: string;
  reading: string;
}

export interface FactorCard {
  factor: string;
  observation: string;
  meaning: string;
  caveat: string;
}

export interface KizashiResult {
  headline: string;
  summary: string;
  domain: Domain;
  emotional_tone: EmotionalTone;
  scenarios: Scenario[];
  factor_cards: FactorCard[];
  counter_signal: string;
  next_actions: string[];
  reflection_prompt: string;
  scope_note: string;
  safety_note: string;
  is_safety_stopped: boolean;
}

export interface SafetyFinding {
  stopped: boolean;
  matchedTerms: string[];
  reason: string;
}

export interface Analyzer {
  analyze(input: KizashiInput): KizashiResult;
}

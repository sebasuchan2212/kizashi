import { SCOPE_NOTE } from '../domain/constants';
import type { Analyzer, KizashiInput, KizashiResult } from '../domain/types';
import { ActionPlanner } from './ActionPlanner';
import { CounterSignalBuilder } from './CounterSignalBuilder';
import { EmotionalToneClassifier } from './EmotionalToneClassifier';
import { FactorLibrary } from './FactorLibrary';
import { SafetyChecker } from './SafetyChecker';
import { ScenarioGenerator } from './ScenarioGenerator';
import { TextSummarizer } from './TextSummarizer';

export class KizashiAnalyzer implements Analyzer {
  constructor(
    private readonly safetyChecker = new SafetyChecker(),
    private readonly summarizer = new TextSummarizer(),
    private readonly toneClassifier = new EmotionalToneClassifier(),
    private readonly factorLibrary = new FactorLibrary(),
    private readonly scenarioGenerator = new ScenarioGenerator(),
    private readonly counterSignalBuilder = new CounterSignalBuilder(),
    private readonly actionPlanner = new ActionPlanner()
  ) {}

  public analyze(input: KizashiInput): KizashiResult {
    const normalized = this.normalizeInput(input);
    const safety = this.safetyChecker.inspect(normalized);

    if (safety.stopped) {
      return this.createSafetyResult(normalized, safety.reason);
    }

    return {
      headline: this.summarizer.createHeadline(normalized),
      summary: this.summarizer.createSummary(normalized),
      domain: normalized.domain,
      emotional_tone: this.toneClassifier.classify(normalized),
      scenarios: this.scenarioGenerator.generate(normalized),
      factor_cards: this.factorLibrary.buildFactors(normalized),
      counter_signal: this.counterSignalBuilder.build(normalized),
      next_actions: this.actionPlanner.createActions(normalized),
      reflection_prompt: this.actionPlanner.createReflection(normalized),
      scope_note: SCOPE_NOTE,
      safety_note: '',
      is_safety_stopped: false
    };
  }

  private normalizeInput(input: KizashiInput): KizashiInput {
    return {
      ...input,
      question: input.question.trim(),
      stateSummary: input.stateSummary.trim(),
      emotionIntensity: Math.min(5, Math.max(1, Math.round(input.emotionIntensity)))
    };
  }

  private createSafetyResult(input: KizashiInput, reason: string): KizashiResult {
    return {
      headline: 'いまは安全の確保を優先してください',
      summary: 'この内容は通常の自己省察結果として扱うよりも、信頼できる人や専門窓口につながることが大切です。',
      domain: input.domain,
      emotional_tone: '負荷が高い',
      scenarios: [],
      factor_cards: [],
      counter_signal: '',
      next_actions: [
        '今すぐひとりで抱え込まず、信頼できる人に連絡してください。',
        '危険が差し迫っている場合は、地域の緊急窓口や公的相談窓口につながってください。'
      ],
      reflection_prompt: '',
      scope_note: SCOPE_NOTE,
      safety_note: `${reason} 本サービスでは、医療・法律・投資・採用その他の専門判断は行いません。安全に関わる内容は、専門機関や公的窓口への相談を優先してください。`,
      is_safety_stopped: true
    };
  }
}

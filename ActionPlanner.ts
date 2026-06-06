import { SAFETY_TERMS } from '../domain/constants';
import type { KizashiInput, SafetyFinding } from '../domain/types';

export class SafetyChecker {
  private readonly terms: string[];

  constructor(terms: string[] = SAFETY_TERMS) {
    this.terms = terms;
  }

  public inspect(input: KizashiInput): SafetyFinding {
    const text = `${input.question}\n${input.stateSummary}`.toLowerCase();
    const matchedTerms = this.terms.filter((term) => text.includes(term.toLowerCase()));
    const urgentByIntensity = input.emotionIntensity >= 5 && /怖い|限界|無理|危険|助けて/.test(text);

    if (matchedTerms.length > 0 || urgentByIntensity) {
      return {
        stopped: true,
        matchedTerms: urgentByIntensity ? [...matchedTerms, '高い感情強度'] : matchedTerms,
        reason: '安全・専門判断に関わる可能性があるため、通常診断を停止します。'
      };
    }

    return {
      stopped: false,
      matchedTerms: [],
      reason: ''
    };
  }
}

import type { KizashiInput } from '../domain/types';

export class TextSummarizer {
  public createSummary(input: KizashiInput): string {
    const source = input.stateSummary.trim() || input.question.trim();
    const normalized = source.replace(/\s+/g, ' ');
    if (normalized.length <= 118) return normalized;
    return `${normalized.slice(0, 116)}…`;
  }

  public createHeadline(input: KizashiInput): string {
    const domainLead = {
      恋愛: '関係の流れを急がず、距離感の兆しを読む時です',
      仕事: '選択を急がず、負荷と可能性の輪郭を整理する時です',
      ウェルネス: '今の揺れを責めず、整え直す小さな兆しを見る時です'
    } satisfies Record<string, string>;

    return domainLead[input.domain];
  }
}

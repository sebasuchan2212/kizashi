import type { EmotionalTone, KizashiInput } from '../domain/types';

export class EmotionalToneClassifier {
  public classify(input: KizashiInput): EmotionalTone {
    const text = `${input.question} ${input.stateSummary}`;
    if (input.emotionIntensity >= 4 && /不安|怖い|苦しい|限界|つらい|辛い/.test(text)) return '負荷が高い';
    if (/好き|期待|楽しみ|進展|挑戦|始めたい/.test(text)) return '期待と迷い';
    if (/迷う|わからない|整理|モヤモヤ|もやもや/.test(text)) return '整理途中';
    if (/頑張りたい|変えたい|前向き|改善/.test(text)) return '前向きな揺れ';
    return '静かな不安';
  }
}

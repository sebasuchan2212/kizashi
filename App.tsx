import type { Domain, KizashiInput } from '../domain/types';

export class CounterSignalBuilder {
  public build(input: KizashiInput): string {
    const signals: Record<Domain, string> = {
      恋愛: '相手から具体的な日程提案、継続的な連絡、安心できる言葉が増えている場合、注意シナリオは弱まります。',
      仕事: '具体的な条件改善、相談できる相手、試せる選択肢がすでにある場合、注意シナリオは弱まります。',
      ウェルネス: '休息後に気分が軽くなる、信頼できる人に話すと整理される場合、注意シナリオは弱まります。'
    };
    return signals[input.domain];
  }
}

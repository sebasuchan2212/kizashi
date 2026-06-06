import type { Domain, KizashiInput, Scenario } from '../domain/types';

export class ScenarioGenerator {
  public generate(input: KizashiInput): Scenario[] {
    const bands = this.pickBands(input.emotionIntensity);
    const readings: Record<Domain, Record<'optimistic' | 'baseline' | 'caution', string>> = {
      恋愛: {
        optimistic: '穏やかな確認や自然な接点によって、関係の温度感を前向きに見直せる余地があります。',
        baseline: '今は相手の反応を急かすより、事実と期待を分けて距離感を整える時期と読めます。',
        caution: '不安から一方的に追いかけると、相手にも自分にも負担が強まる可能性があります。'
      },
      仕事: {
        optimistic: '小さな検証行動を始めることで、今後の選択肢が増え、納得感が戻る余地があります。',
        baseline: '現時点では、大きな決断より、条件・負荷・得たい成果を整理する段階と読めます。',
        caution: '疲労や焦りが強いまま判断すると、極端な二択に見えてしまう可能性があります。'
      },
      ウェルネス: {
        optimistic: '短い記録や休息の調整によって、気分の波を少し扱いやすくできる余地があります。',
        baseline: '今は原因を一つに決めず、事実・感情・体調を分けて観察する時期と読めます。',
        caution: '無理に前向きになろうとすると、かえって自己責めが強まる可能性があります。'
      }
    };

    const selected = readings[input.domain];

    return [
      { name: '楽観', probability_band: bands.optimistic, reading: selected.optimistic },
      { name: '基準', probability_band: bands.baseline, reading: selected.baseline },
      { name: '注意', probability_band: bands.caution, reading: selected.caution }
    ];
  }

  private pickBands(intensity: number): { optimistic: string; baseline: string; caution: string } {
    if (intensity >= 4) {
      return { optimistic: '20-30%', baseline: '40-50%', caution: '25-35%' };
    }
    if (intensity <= 2) {
      return { optimistic: '25-35%', baseline: '45-55%', caution: '15-25%' };
    }
    return { optimistic: '20-30%', baseline: '45-55%', caution: '20-30%' };
  }
}

import type { Domain, FactorCard, KizashiInput } from '../domain/types';

export class FactorLibrary {
  public buildFactors(input: KizashiInput): FactorCard[] {
    const factories: Record<Domain, (input: KizashiInput) => FactorCard[]> = {
      恋愛: this.loveFactors,
      仕事: this.workFactors,
      ウェルネス: this.wellnessFactors
    };

    return factories[input.domain](input);
  }

  private loveFactors(input: KizashiInput): FactorCard[] {
    return [
      {
        factor: '距離感の変化',
        observation: '相談文には、相手との関係性や反応を慎重に見極めたい気持ちが含まれています。',
        meaning: '関係を進めたい気持ちと、踏み込みすぎたくない気持ちが同時に動いている可能性があります。',
        caveat: '相手の本心は入力文だけでは断定できません。行動・言葉・頻度を分けて見る必要があります。'
      },
      {
        factor: '期待と不安の拮抗',
        observation: `感情強度は${input.emotionIntensity}/5で、気持ちの比重がやや大きくなっている可能性があります。`,
        meaning: '結論を急ぐほど、相手の反応を強く読みすぎるリスクがあります。',
        caveat: '不安の強さは、現実の悪化だけでなく、待つ時間の長さでも強まります。'
      },
      {
        factor: '対話の余地',
        observation: '問いの中心は、関係を壊すことではなく、どう受け止めるかにあります。',
        meaning: '小さな確認や穏やかな対話で、読み筋が変わる余地があります。',
        caveat: '相手の状況やタイミングが見えていない場合、判断は控えめにするほうが安全です。'
      }
    ];
  }

  private workFactors(input: KizashiInput): FactorCard[] {
    return [
      {
        factor: '負荷と納得感',
        observation: '相談文には、現在の状況を続けるか、方向を変えるかの迷いが含まれています。',
        meaning: '疲労だけでなく、納得感の低下が判断を揺らしている可能性があります。',
        caveat: '退職・転職・契約判断は、収入や条件の事実確認なしには判断できません。'
      },
      {
        factor: '選択肢の見え方',
        observation: `見たい時間軸は${input.timeHorizon}で、短中期の整理が求められています。`,
        meaning: '今は大きな決断より、選択肢を比較できる状態に戻すことが有効かもしれません。',
        caveat: '選択肢が少なく見える時ほど、感情的な二択に寄りやすくなります。'
      },
      {
        factor: '実行可能な一歩',
        observation: '問いは、現状を変えたい意思と、失敗を避けたい慎重さの両方を含んでいます。',
        meaning: '小さな検証行動を挟むことで、次の判断材料が増える可能性があります。',
        caveat: '採用・評価・収益の結果を保証するものではありません。'
      }
    ];
  }

  private wellnessFactors(input: KizashiInput): FactorCard[] {
    return [
      {
        factor: '感情の滞留',
        observation: '相談文には、状態を客観視したい、またはモヤモヤを言語化したい流れがあります。',
        meaning: '今は原因を一つに決めるより、感情と事実を分けることが助けになる可能性があります。',
        caveat: '医療的な診断や治療判断は行えません。強い不調が続く場合は専門家への相談が優先です。'
      },
      {
        factor: '生活リズムとの接点',
        observation: `感情強度は${input.emotionIntensity}/5で、セルフケアの余地を確認する段階です。`,
        meaning: '睡眠・食事・休息・予定の詰まり方が、気分の見え方に影響している可能性があります。',
        caveat: '生活要因だけで説明できない場合もあるため、断定は避ける必要があります。'
      },
      {
        factor: '自己責めの緩和',
        observation: '悩みを言葉にしようとしている時点で、整理に向かう力が残っています。',
        meaning: '小さな記録や振り返りによって、自分の状態を扱いやすくできる可能性があります。',
        caveat: '記録がつらさを強める場合は、無理に続けない設計が必要です。'
      }
    ];
  }
}

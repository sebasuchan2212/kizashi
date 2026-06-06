import type { Domain, KizashiInput } from '../domain/types';

export class ActionPlanner {
  public createActions(input: KizashiInput): string[] {
    const actions: Record<Domain, string[]> = {
      恋愛: [
        '送る前提ではなく、10分だけ相手に伝えたいことの下書きを作る。',
        '相手の反応を「事実」と「自分の解釈」に分けて3行で書く。'
      ],
      仕事: [
        '今日中に、今の仕事で負荷が高い要素を3つだけ書き出す。',
        '次の一手を決める前に、収入・時間・学びの条件を1つずつ確認する。'
      ],
      ウェルネス: [
        '今夜、気分・体調・出来事をそれぞれ1行ずつ記録する。',
        '10分だけ予定を減らし、休息・水分・睡眠のどれか一つを整える。'
      ]
    };

    return actions[input.domain];
  }

  public createReflection(input: KizashiInput): string {
    const prompts: Record<Domain, string> = {
      恋愛: '相手の反応ではなく、自分が大切にしたい関係の形は何ですか？',
      仕事: 'いまの選択で、守りたいものと変えたいものはそれぞれ何ですか？',
      ウェルネス: '最近の自分を責めずに見るなら、何を一番休ませてあげたいですか？'
    };
    return prompts[input.domain];
  }
}

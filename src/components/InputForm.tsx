import { useState } from 'react';
import type { Domain, KizashiInput, TimeHorizon } from '../domain/types';
import { DOMAINS } from '../domain/constants';

interface InputFormProps {
  onSubmit: (input: KizashiInput) => void;
}

const sampleByDomain: Record<Domain, Pick<KizashiInput, 'question' | 'stateSummary'>> = {
  恋愛: {
    question: '連絡頻度が減った相手との距離感をどう見ればいいか',
    stateSummary: '以前より返信が遅くなり、こちらから連絡することが増えました。嫌われたのか、ただ忙しいだけなのか判断できず、追いかけすぎるのも怖いです。'
  },
  仕事: {
    question: '今の仕事を続けながら副業を伸ばすべきか',
    stateSummary: '今の仕事に不満はありますが、すぐ辞めるほどではありません。AIやWeb系の副業を伸ばしたい一方で、時間と体力が足りず迷っています。'
  },
  ウェルネス: {
    question: '最近のモヤモヤをどう整理すればいいか',
    stateSummary: '大きな問題があるわけではないのに、気分が重い日が増えています。やることは多いのに集中しづらく、自分を責めがちです。'
  }
};

export function InputForm({ onSubmit }: InputFormProps) {
  const [domain, setDomain] = useState<Domain>('恋愛');
  const [question, setQuestion] = useState(sampleByDomain.恋愛.question);
  const [stateSummary, setStateSummary] = useState(sampleByDomain.恋愛.stateSummary);
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>('1か月');
  const [emotionIntensity, setEmotionIntensity] = useState(3);
  const [error, setError] = useState('');

  const changeDomain = (nextDomain: Domain) => {
    setDomain(nextDomain);
    setQuestion(sampleByDomain[nextDomain].question);
    setStateSummary(sampleByDomain[nextDomain].stateSummary);
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (question.trim().length < 5) {
      setError('「いま一番迷っていること」を5文字以上で入力してください。');
      return;
    }
    if (stateSummary.trim().length < 20) {
      setError('現状の事実と気持ちを20文字以上で入力してください。');
      return;
    }
    setError('');
    onSubmit({ domain, question, stateSummary, timeHorizon, emotionIntensity });
  };

  return (
    <section className="panel form-panel" aria-labelledby="form-title">
      <div className="section-heading">
        <p className="mini-label">Input</p>
        <h2 id="form-title">いまの迷いを入力する</h2>
        <p>入力内容は、このMVPでは保存しません。まずは診断品質の検証に集中する設計です。</p>
      </div>

      <form onSubmit={submit} className="kizashi-form">
        <fieldset>
          <legend>相談したい領域</legend>
          <div className="segmented-control">
            {DOMAINS.map((item) => (
              <button
                key={item}
                type="button"
                className={domain === item ? 'active' : ''}
                onClick={() => changeDomain(item)}
                aria-pressed={domain === item}
              >
                {item}
              </button>
            ))}
          </div>
        </fieldset>

        <label>
          <span>いま一番迷っていること</span>
          <input value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={120} />
        </label>

        <label>
          <span>現状の事実と気持ち</span>
          <textarea value={stateSummary} onChange={(event) => setStateSummary(event.target.value)} rows={6} maxLength={500} />
          <small>{stateSummary.length}/500文字</small>
        </label>

        <div className="form-row">
          <label>
            <span>見たい時間軸</span>
            <select value={timeHorizon} onChange={(event) => setTimeHorizon(event.target.value as TimeHorizon)}>
              <option value="2週間">2週間</option>
              <option value="1か月">1か月</option>
              <option value="3か月">3か月</option>
            </select>
          </label>

          <label>
            <span>今の気持ちの強さ：{emotionIntensity}</span>
            <input
              type="range"
              min="1"
              max="5"
              value={emotionIntensity}
              onChange={(event) => setEmotionIntensity(Number(event.target.value))}
            />
          </label>
        </div>

        {error && <p className="error-message" role="alert">{error}</p>}
        <button className="primary-button" type="submit">KIZASHIを読む</button>
      </form>
    </section>
  );
}

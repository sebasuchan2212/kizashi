import { AlertTriangle, CheckCircle2, Clipboard, HelpCircle, ShieldCheck } from 'lucide-react';
import type { KizashiResult } from '../domain/types';
import { useState } from 'react';

interface ResultViewProps {
  result: KizashiResult | null;
}

export function ResultView({ result }: ResultViewProps) {
  const [copied, setCopied] = useState(false);

  if (!result) {
    return (
      <section className="panel empty-state" aria-labelledby="empty-title">
        <p className="mini-label">Result</p>
        <h2 id="empty-title">診断結果がここに表示されます</h2>
        <p>入力後、確率叙事設計学にもとづいて、3つの読み筋と今日できる行動に整理します。</p>
      </section>
    );
  }

  const copyJson = async () => {
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  if (result.is_safety_stopped) {
    return (
      <section className="panel result-panel safety-panel" aria-labelledby="safety-title">
        <div className="safety-icon"><AlertTriangle size={28} aria-hidden="true" /></div>
        <p className="mini-label">Safety First</p>
        <h2 id="safety-title">{result.headline}</h2>
        <p>{result.summary}</p>
        <ul className="action-list">
          {result.next_actions.map((action) => <li key={action}>{action}</li>)}
        </ul>
        <p className="scope-note">{result.safety_note}</p>
      </section>
    );
  }

  return (
    <section className="result-stack" aria-labelledby="result-title">
      <div className="panel result-panel">
        <div className="result-topline">
          <span className="protocol-badge">{result.domain}</span>
          <span className="tone-badge">{result.emotional_tone}</span>
        </div>
        <p className="mini-label">Reading</p>
        <h2 id="result-title">{result.headline}</h2>
        <p className="summary-text">{result.summary}</p>
        <button type="button" className="ghost-button" onClick={copyJson}>
          <Clipboard size={16} aria-hidden="true" />
          {copied ? 'JSONをコピーしました' : 'JSONをコピー'}
        </button>
      </div>

      <div className="card-grid three">
        {result.scenarios.map((scenario) => (
          <article key={scenario.name} className={`scenario-card scenario-${scenario.name}`}>
            <div className="scenario-head">
              <h3>{scenario.name}</h3>
              <strong>{scenario.probability_band}</strong>
            </div>
            <p>{scenario.reading}</p>
          </article>
        ))}
      </div>

      <section className="panel" aria-labelledby="factor-title">
        <div className="section-heading inline-heading">
          <div>
            <p className="mini-label">Factors</p>
            <h2 id="factor-title">なぜそう読めるか</h2>
          </div>
          <ShieldCheck aria-hidden="true" />
        </div>
        <div className="factor-list">
          {result.factor_cards.map((card, index) => (
            <article className="factor-card" key={card.factor}>
              <span className="factor-index">0{index + 1}</span>
              <h3>{card.factor}</h3>
              <p><strong>観測：</strong>{card.observation}</p>
              <p><strong>意味：</strong>{card.meaning}</p>
              <p className="caveat"><strong>留保：</strong>{card.caveat}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel counter-panel" aria-labelledby="counter-title">
        <div className="inline-heading">
          <div>
            <p className="mini-label">Counter Signal</p>
            <h2 id="counter-title">読みを弱めるサイン</h2>
          </div>
          <HelpCircle aria-hidden="true" />
        </div>
        <p>{result.counter_signal}</p>
      </section>

      <section className="panel action-panel" aria-labelledby="action-title">
        <p className="mini-label">Next Actions</p>
        <h2 id="action-title">今日できる小さな行動</h2>
        <ul className="action-list">
          {result.next_actions.map((action) => (
            <li key={action}><CheckCircle2 size={18} aria-hidden="true" />{action}</li>
          ))}
        </ul>
      </section>

      <section className="panel reflection-panel" aria-labelledby="reflection-title">
        <p className="mini-label">Reflection</p>
        <h2 id="reflection-title">振り返り質問</h2>
        <p>{result.reflection_prompt}</p>
      </section>

      <p className="scope-note">{result.scope_note}</p>
    </section>
  );
}

import { FORBIDDEN_EXPRESSIONS, SAFE_WORDS } from '../domain/constants';

export function Principles() {
  return (
    <section className="panel principles" aria-labelledby="principles-title">
      <div className="section-heading">
        <p className="mini-label">Principles</p>
        <h2 id="principles-title">KIZASHIの安全設計</h2>
        <p>占いの没入感を残しながら、断定・依存・不安煽りを避けるための言語ルールを組み込んでいます。</p>
      </div>
      <div className="word-grid">
        <div>
          <h3>使う言葉</h3>
          <div className="chip-list safe">
            {SAFE_WORDS.map((word) => <span key={word}>{word}</span>)}
          </div>
        </div>
        <div>
          <h3>使わない言葉</h3>
          <div className="chip-list danger">
            {FORBIDDEN_EXPRESSIONS.slice(0, 10).map((word) => <span key={word}>{word}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}

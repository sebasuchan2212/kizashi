import { Sparkles } from 'lucide-react';
import { BrandMark } from './BrandMark';

export function Hero() {
  return (
    <header className="hero">
      <nav className="hero-nav" aria-label="ブランド情報">
        <BrandMark />
        <span className="protocol-badge">KIZASHI-PND</span>
      </nav>

      <section className="hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={16} aria-hidden="true" />
            未来を決めつけない自己省察型リーディング
          </span>
          <h1>迷いの中にある“KIZASHI”を読む。</h1>
          <p>
            恋愛・仕事・ウェルネスの悩みを、楽観・基準・注意の3シナリオ、主要因子、反証シグナル、今日できる小さな行動へ整理します。
          </p>
          <div className="hero-actions" aria-label="KIZASHIの特徴">
            <span>断定しない</span>
            <span>反証を出す</span>
            <span>小さく行動する</span>
          </div>
        </div>

        <div className="hero-card" aria-label="診断結果の概要サンプル">
          <p className="mini-label">Sample Reading</p>
          <h2>流れの輪郭を整理する時です</h2>
          <div className="mini-bars">
            <div><span>楽観</span><strong>20-30%</strong></div>
            <div><span>基準</span><strong>45-55%</strong></div>
            <div><span>注意</span><strong>20-30%</strong></div>
          </div>
          <p className="hero-card-note">確率帯は未来予言ではなく、現時点の入力に基づく相対的な読み筋です。</p>
        </div>
      </section>
    </header>
  );
}

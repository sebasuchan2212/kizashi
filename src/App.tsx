import { useMemo, useState } from 'react';
import { Hero } from './components/Hero';
import { InputForm } from './components/InputForm';
import { Principles } from './components/Principles';
import { ResultView } from './components/ResultView';
import type { KizashiInput, KizashiResult } from './domain/types';
import { mockAnalyzeKizashi } from './services/mockAnalyzeKizashi';

function App() {
  const [result, setResult] = useState<KizashiResult | null>(null);
  const year = useMemo(() => new Date().getFullYear(), []);

  const handleAnalyze = (input: KizashiInput) => {
    const nextResult = mockAnalyzeKizashi(input);
    setResult(nextResult);
    requestAnimationFrame(() => {
      document.getElementById('result-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <div className="app-shell">
      <Hero />
      <main className="main-grid">
        <div className="left-column">
          <InputForm onSubmit={handleAnalyze} />
          <Principles />
        </div>
        <div id="result-area" className="right-column">
          <ResultView result={result} />
        </div>
      </main>
      <footer className="footer">
        <p>© {year} KIZASHI｜確率叙事設計学 / 確率叙事占学</p>
        <p>本MVPは自己理解と行動整理の補助を目的とした検証用プロダクトです。</p>
      </footer>
    </div>
  );
}

export default App;

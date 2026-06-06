import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export function PremiumGuide({ selectedPlan }: { selectedPlan: string }) {
  const features = selectedPlan === 'Free'
    ? ['120字要約', '3つのシナリオ', '今日できる行動2つ']
    : selectedPlan === 'Light'
      ? ['叙事読解の深掘り', '主要因子3つ', '反証シグナル', '7日間の行動プラン', '保存用テキスト']
      : ['診断履歴', '週次KIZASHIレポート', '領域別の傾向分析', '月10回の詳細診断'];

  return (
    <section className="premium-guide luxe-panel">
      <div>
        <p className="mini-label">Next Step</p>
        <h2>{selectedPlan}プランでできること</h2>
        <p>「もっと当たる」ではなく、「もっと整理できる」ための導線です。決済導入前でも、ユーザーが価値を理解できる構成にしています。</p>
      </div>
      <ul>
        {features.map((feature) => <li key={feature}><CheckCircle2 size={18} />{feature}</li>)}
      </ul>
      <a className="gold-button" href="#diagnosis"><Sparkles size={16} />まず無料診断を試す<ArrowRight size={16} /></a>
    </section>
  );
}

import { AlertTriangle, FileText, Lock, Scale } from 'lucide-react';
import { disclaimerContent, privacyContent, termsContent } from '../legal/legalContent';

const blocks = [
  { id: 'terms', title: '利用規約', icon: FileText, items: termsContent },
  { id: 'privacy', title: 'プライバシーポリシー', icon: Lock, items: privacyContent },
  { id: 'disclaimer', title: '免責・安全方針', icon: AlertTriangle, items: disclaimerContent }
];

export function LegalSections() {
  return (
    <section id="legal" className="legal-section luxe-panel">
      <p className="mini-label centered">Legal & Safety</p>
      <h2>信頼して使うための基本方針</h2>
      <p className="section-copy">KIZASHIは、不安を煽る占いではなく、自己理解と行動整理を支援するためのサービスとして設計します。</p>
      <div className="legal-grid">
        {blocks.map((block) => {
          const Icon = block.icon;
          return (
            <article id={block.id} className="legal-card" key={block.id}>
              <Icon size={28} />
              <h3>{block.title}</h3>
              <ul>
                {block.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          );
        })}
      </div>
      <div className="commerce-note">
        <Scale size={22} />
        <p>有料詳細診断を開始する際は、特定商取引法に基づく表示、価格、返金条件、提供時期、問い合わせ先を購入前に明示します。</p>
      </div>
    </section>
  );
}

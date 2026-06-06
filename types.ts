import { useState } from 'react';
import { MessageCircle, Send, Star } from 'lucide-react';
import { saveFeedback } from '../services/feedbackStore';

function ScoreButtons({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <div className="score-row">
      <span>{label}</span>
      <div className="score-buttons" role="group" aria-label={label}>
        {[1, 2, 3, 4, 5].map((score) => (
          <button key={score} type="button" className={value >= score ? 'active' : ''} onClick={() => onChange(score)}>
            <Star size={15} fill="currentColor" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function FeedbackForm() {
  const [rating, setRating] = useState(5);
  const [clarity, setClarity] = useState(5);
  const [anxiety, setAnxiety] = useState(1);
  const [actionability, setActionability] = useState(4);
  const [comment, setComment] = useState('');
  const [contact, setContact] = useState('');
  const [done, setDone] = useState(false);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveFeedback({ rating, clarity, anxiety, actionability, comment: comment.trim(), contact: contact.trim() || undefined });
    setDone(true);
    setComment('');
  };

  const mailBody = encodeURIComponent(`KIZASHIへの問い合わせ・フィードバック\n\n内容:\n${comment}\n\n連絡先:${contact}`);

  return (
    <section id="feedback" className="feedback-section luxe-panel">
      <p className="mini-label centered">Feedback</p>
      <h2>診断品質を一緒に育てる</h2>
      <p className="section-copy">KIZASHIは「当たった感」よりも、整理できたか・不安を煽らなかったか・行動できそうかを重視します。</p>
      <form className="feedback-form" onSubmit={submit}>
        <ScoreButtons label="役に立った" value={rating} onChange={setRating} />
        <ScoreButtons label="わかりやすかった" value={clarity} onChange={setClarity} />
        <ScoreButtons label="不安が強くなった" value={anxiety} onChange={setAnxiety} />
        <ScoreButtons label="行動できそう" value={actionability} onChange={setActionability} />
        <label>
          <span>よかった点・違和感があった点</span>
          <textarea value={comment} onChange={(event) => setComment(event.target.value)} rows={4} placeholder="例：反証シグナルがあることで安心した / もう少し具体的な行動がほしい" />
        </label>
        <label>
          <span>返信が必要な場合の連絡先 任意</span>
          <input value={contact} onChange={(event) => setContact(event.target.value)} placeholder="メールアドレスなど" />
        </label>
        <div className="feedback-actions">
          <button className="gold-button form-submit" type="submit"><Send size={16} />送信する</button>
          <a className="glass-button" href={`mailto:sebasuchan0402@gmail.com?subject=KIZASHI問い合わせ&body=${mailBody}`}><MessageCircle size={16} />メールで問い合わせ</a>
        </div>
        {done && <p className="success-message">送信しました。フィードバックはこの端末に保存され、改善検証に使える形式になっています。</p>}
      </form>
    </section>
  );
}

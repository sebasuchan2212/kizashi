export interface FeedbackEntry {
  id: string;
  createdAt: string;
  rating: number;
  clarity: number;
  anxiety: number;
  actionability: number;
  comment: string;
  contact?: string;
}

const STORAGE_KEY = 'kizashi_feedback_entries';

export function saveFeedback(entry: Omit<FeedbackEntry, 'id' | 'createdAt'>): FeedbackEntry {
  const next: FeedbackEntry = {
    ...entry,
    id: `fb_${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  const existing = getFeedbackEntries();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([next, ...existing].slice(0, 50)));
  return next;
}

export function getFeedbackEntries(): FeedbackEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FeedbackEntry[]) : [];
  } catch {
    return [];
  }
}

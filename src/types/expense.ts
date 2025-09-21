export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  createdAt: string;
}

export type ExpenseCategory = 
  | 'food'
  | 'travel'
  | 'books'
  | 'fun'
  | 'other';

export const EXPENSE_CATEGORIES: { 
  value: ExpenseCategory; 
  label: string; 
  icon: string; 
  color: string; 
}[] = [
  { value: 'food', label: 'Food & Drinks', icon: '🍕', color: 'bg-gradient-primary' },
  { value: 'travel', label: 'Travel', icon: '🚗', color: 'bg-gradient-secondary' },
  { value: 'books', label: 'Books & Study', icon: '📚', color: 'bg-gradient-accent' },
  { value: 'fun', label: 'Entertainment', icon: '🎮', color: 'bg-warning' },
  { value: 'other', label: 'Other', icon: '💰', color: 'bg-muted' },
];

export interface MonthlySpending {
  month: string;
  total: number;
  categoryTotals: Record<ExpenseCategory, number>;
}

export interface SpendingPrediction {
  predictedAmount: number;
  confidence: 'low' | 'medium' | 'high';
  suggestion: string;
}
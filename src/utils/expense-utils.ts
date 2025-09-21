import { Expense, ExpenseCategory, MonthlySpending, SpendingPrediction } from '@/types/expense';

const STORAGE_KEY = 'student-expenses';

export const expenseStorage = {
  getAll(): Expense[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading expenses:', error);
      return [];
    }
  },

  save(expenses: Expense[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving expenses:', error);
    }
  },

  add(expense: Omit<Expense, 'id' | 'createdAt'>): Expense {
    const expenses = this.getAll();
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    
    expenses.push(newExpense);
    this.save(expenses);
    return newExpense;
  },

  delete(id: string): void {
    const expenses = this.getAll();
    const filtered = expenses.filter(expense => expense.id !== id);
    this.save(filtered);
  },
};

export const calculateMonthlySpending = (expenses: Expense[], month?: string): MonthlySpending => {
  const targetMonth = month || new Date().toISOString().slice(0, 7); // YYYY-MM format
  
  const monthlyExpenses = expenses.filter(expense => 
    expense.date.startsWith(targetMonth)
  );

  const categoryTotals: Record<ExpenseCategory, number> = {
    food: 0,
    travel: 0,
    books: 0,
    fun: 0,
    other: 0,
  };

  let total = 0;

  monthlyExpenses.forEach(expense => {
    total += expense.amount;
    categoryTotals[expense.category] += expense.amount;
  });

  return {
    month: targetMonth,
    total,
    categoryTotals,
  };
};

export const predictTomorrowSpending = (expenses: Expense[]): SpendingPrediction => {
  // Get expenses from last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentExpenses = expenses.filter(expense => 
    new Date(expense.date) >= sevenDaysAgo
  );

  if (recentExpenses.length === 0) {
    return {
      predictedAmount: 0,
      confidence: 'low',
      suggestion: 'Start tracking expenses to get predictions!',
    };
  }

  // Calculate daily average
  const totalAmount = recentExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const daysWithExpenses = new Set(recentExpenses.map(expense => expense.date)).size;
  const averagePerDay = totalAmount / Math.max(daysWithExpenses, 1);

  // Determine confidence based on data points
  let confidence: 'low' | 'medium' | 'high';
  let suggestion: string;

  if (recentExpenses.length < 3) {
    confidence = 'low';
    suggestion = 'Track more expenses for better predictions';
  } else if (recentExpenses.length < 7) {
    confidence = 'medium';
    suggestion = 'Good spending pattern emerging';
  } else {
    confidence = 'high';
    suggestion = 'Based on your consistent spending pattern';
  }

  // Add some variation to make it more realistic
  const variation = averagePerDay * 0.2; // ±20% variation
  const predictedAmount = Math.max(0, averagePerDay + (Math.random() - 0.5) * variation);

  return {
    predictedAmount: Math.round(predictedAmount * 100) / 100, // Round to 2 decimal places
    confidence,
    suggestion,
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
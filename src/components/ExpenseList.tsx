import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Receipt, Filter } from 'lucide-react';
import { Expense, ExpenseCategory, EXPENSE_CATEGORIES } from '@/types/expense';
import { formatCurrency, formatDate } from '@/utils/expense-utils';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

const ExpenseList = ({ expenses, onDeleteExpense }: ExpenseListProps) => {
  const [filterCategory, setFilterCategory] = useState<ExpenseCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const filteredExpenses = expenses
    .filter(expense => filterCategory === 'all' || expense.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.amount - a.amount;
    });

  const getCategoryData = (category: ExpenseCategory) => {
    return EXPENSE_CATEGORIES.find(cat => cat.value === category);
  };

  if (expenses.length === 0) {
    return (
      <Card className="border-0 shadow-soft">
        <CardContent className="py-12 text-center">
          <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No expenses yet</h3>
          <p className="text-muted-foreground">Add your first expense to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-soft">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Receipt className="h-5 w-5 text-primary" />
            Recent Expenses ({filteredExpenses.length})
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value as ExpenseCategory | 'all')}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'date' | 'amount')}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">By Date</SelectItem>
                <SelectItem value="amount">By Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {filteredExpenses.map((expense) => {
          const categoryData = getCategoryData(expense.category);
          
          return (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-muted/50 to-transparent border border-border/50 hover:shadow-soft transition-smooth group"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-10 h-10 rounded-lg ${categoryData?.color} flex items-center justify-center text-white shadow-soft`}>
                  <span className="text-lg">{categoryData?.icon}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium truncate">{expense.description}</p>
                    <Badge variant="secondary" className="text-xs">
                      {categoryData?.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(expense.date)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-semibold text-lg bg-gradient-primary bg-clip-text text-transparent">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteExpense(expense.id)}
                  className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-smooth"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
        
        {filteredExpenses.length > 5 && (
          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">
              Showing {Math.min(filteredExpenses.length, 10)} of {expenses.length} expenses
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseList;
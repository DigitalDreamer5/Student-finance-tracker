import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Calendar } from 'lucide-react';
import { MonthlySpending, EXPENSE_CATEGORIES } from '@/types/expense';
import { formatCurrency } from '@/utils/expense-utils';

interface MonthlySummaryProps {
  monthlyData: MonthlySpending;
}

const MonthlySummary = ({ monthlyData }: MonthlySummaryProps) => {
  const { total, categoryTotals, month } = monthlyData;
  
  const monthName = new Date(month + '-01').toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Sort categories by spending amount
  const sortedCategories = EXPENSE_CATEGORIES
    .map(cat => ({
      ...cat,
      amount: categoryTotals[cat.value],
      percentage: total > 0 ? (categoryTotals[cat.value] / total) * 100 : 0,
    }))
    .filter(cat => cat.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const averageDaily = total / new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

  return (
    <Card className="border-0 shadow-soft bg-gradient-to-br from-white via-white to-secondary-light/10">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Calendar className="h-5 w-5 text-secondary" />
          {monthName} Summary
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Total Spending */}
        <div className="text-center p-6 rounded-lg bg-gradient-secondary">
          <p className="text-sm font-medium text-secondary-foreground/80 mb-1">
            Total Spent This Month
          </p>
          <p className="text-3xl font-bold text-secondary-foreground">
            {formatCurrency(total)}
          </p>
          <p className="text-sm text-secondary-foreground/70 mt-2">
            Daily average: {formatCurrency(averageDaily)}
          </p>
        </div>

        {/* Category Breakdown */}
        {sortedCategories.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              Category Breakdown
            </h4>
            
            <div className="space-y-3">
              {sortedCategories.map((category) => (
                <div key={category.value} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium text-sm">{category.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold">{formatCurrency(category.amount)}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {category.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <Progress
                    value={category.percentage}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {sortedCategories.length === 0 && (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No expenses recorded this month</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start adding expenses to see your summary
            </p>
          </div>
        )}

        {/* Quick Stats */}
        {total > 0 && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {sortedCategories.length}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Categories Used
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">
                {sortedCategories[0]?.percentage.toFixed(0)}%
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Top Category
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlySummary;
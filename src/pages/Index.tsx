import { useState, useEffect } from 'react';
import { Wallet, PlusCircle, BarChart3 } from 'lucide-react';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import MonthlySummary from '@/components/MonthlySummary';
import SpendingPrediction from '@/components/SpendingPrediction';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { expenseStorage, calculateMonthlySpending, predictTomorrowSpending } from '@/utils/expense-utils';
import { Expense } from '@/types/expense';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadExpenses = () => {
    try {
      const savedExpenses = expenseStorage.getAll();
      setExpenses(savedExpenses);
    } catch (error) {
      console.error('Error loading expenses:', error);
      toast({
        title: "Error",
        description: "Failed to load expenses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpenseAdded = () => {
    loadExpenses();
  };

  const handleDeleteExpense = (id: string) => {
    try {
      expenseStorage.delete(id);
      loadExpenses();
      toast({
        title: "Expense deleted",
        description: "The expense has been removed successfully",
      });
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const monthlyData = calculateMonthlySpending(expenses);
  const prediction = predictTomorrowSpending(expenses);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary-glow/5 to-secondary-light/10 flex items-center justify-center">
        <div className="text-center">
          <Wallet className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading your expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-glow/5 to-secondary-light/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-primary shadow-medium">
              <Wallet className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Student Finance Tracker
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your daily expenses, manage your budget, and get AI-powered spending predictions 
            designed specifically for college students.
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="add-expense" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Expense
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              All Expenses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlySummary monthlyData={monthlyData} />
              <SpendingPrediction prediction={prediction} />
            </div>
            
            {expenses.length > 0 && (
              <ExpenseList 
                expenses={expenses.slice(0, 5)} 
                onDeleteExpense={handleDeleteExpense} 
              />
            )}
          </TabsContent>

          <TabsContent value="add-expense" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <ExpenseForm onExpenseAdded={handleExpenseAdded} />
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;

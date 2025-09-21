import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { SpendingPrediction as PredictionType } from '@/types/expense';
import { formatCurrency } from '@/utils/expense-utils';

interface SpendingPredictionProps {
  prediction: PredictionType;
}

const SpendingPrediction = ({ prediction }: SpendingPredictionProps) => {
  const { predictedAmount, confidence, suggestion } = prediction;

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'bg-success text-success-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getConfidenceIcon = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return <CheckCircle className="h-4 w-4" />;
      case 'medium':
        return <TrendingUp className="h-4 w-4" />;
      case 'low':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPredictionMessage = () => {
    if (predictedAmount === 0) {
      return "Start tracking expenses to get AI predictions!";
    }
    
    return `Based on your recent spending pattern, you might spend around ${formatCurrency(predictedAmount)} tomorrow.`;
  };

  return (
    <Card className="border-0 shadow-soft bg-gradient-to-br from-white via-white to-accent-light/5">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Brain className="h-5 w-5 text-accent" />
          AI Spending Prediction
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Prediction Amount */}
        <div className="text-center p-6 rounded-lg bg-gradient-accent">
          <p className="text-sm font-medium text-accent-foreground/80 mb-1">
            Tomorrow's Predicted Spending
          </p>
          <p className="text-3xl font-bold text-accent-foreground">
            {predictedAmount > 0 ? formatCurrency(predictedAmount) : '—'}
          </p>
        </div>

        {/* Confidence Level */}
        <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Confidence Level:</span>
            <Badge className={`${getConfidenceColor(confidence)} flex items-center gap-1`}>
              {getConfidenceIcon(confidence)}
              {confidence.charAt(0).toUpperCase() + confidence.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Prediction Message */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-primary-glow/20 to-transparent border border-primary/20">
          <p className="text-sm font-medium text-foreground mb-2">
            🤖 AI Insight:
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {getPredictionMessage()}
          </p>
        </div>

        {/* Suggestion */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-secondary-light/30 to-transparent border border-secondary/20">
          <p className="text-sm font-medium text-foreground mb-2">
            💡 Suggestion:
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {suggestion}
          </p>
        </div>

        {/* How it works */}
        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer hover:text-foreground transition-smooth">
            How does this work?
          </summary>
          <p className="mt-2 leading-relaxed">
            Our AI analyzes your spending patterns from the last 7 days to predict tomorrow's expenses. 
            The more data you provide, the more accurate the predictions become. This is a simple 
            machine learning model based on your personal spending averages.
          </p>
        </details>
      </CardContent>
    </Card>
  );
};

export default SpendingPrediction;
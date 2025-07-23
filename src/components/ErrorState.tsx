
import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title: string;
  message: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ title, message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
      <div className="max-w-md">
        <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
        <p className="text-muted-foreground mb-6">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;

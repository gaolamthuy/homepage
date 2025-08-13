/**
 * Loading Spinner Component
 * Hiển thị trạng thái loading với animation mượt mà
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

/**
 * Component hiển thị loading spinner
 * @param size - Kích thước spinner (sm, md, lg)
 * @param className - CSS classes tùy chỉnh
 * @param text - Text hiển thị bên cạnh spinner
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  text
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-primary',
          sizeClasses[size]
        )}
      />
      {text && (
        <span className="text-sm text-muted-foreground animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;

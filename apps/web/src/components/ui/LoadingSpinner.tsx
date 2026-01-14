'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'gold' | 'green' | 'white';
}

export function LoadingSpinner({ 
  size = 'md', 
  className,
  color = 'gold' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colorClasses = {
    gold: 'border-gold-200 border-t-gold-500',
    green: 'border-emerald-200 border-t-emerald-500',
    white: 'border-white/20 border-t-white',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'rounded-full border-2 animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    />
  );
}
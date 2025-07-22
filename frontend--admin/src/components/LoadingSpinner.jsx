import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'default' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  return (
    <Loader2 
      className={`animate-spin ${sizeClasses[size] || sizeClasses.default} text-red-600`} 
    />
  );
};

export default LoadingSpinner;
/**
 * Button Component - UI Framework Wrapper
 * 
 * Swap framework by changing the import and mapping props
 */

'use client';

import * as React from 'react';

// Choose your UI framework (swap easily)
// Option 1: ShadCN (default)
// import { Button as ShadCNButton } from '@/components/ui/shadcn/button';

// Option 2: Bootstrap
// import { Button as BootstrapButton } from 'react-bootstrap';

// Option 3: Material-UI
// import { Button as MUIButton } from '@mui/material/Button';

// Option 4: Custom Tailwind (no framework)
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

/**
 * Button wrapper - Swap implementation here
 */
export function Button({ 
  className, 
  variant = 'default', 
  size = 'default', 
  ...props 
}: ButtonProps) {
  // Using custom Tailwind classes (no framework dependency)
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-100',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    ghost: 'hover:bg-gray-100',
    link: 'text-blue-600 underline-offset-4 hover:underline',
  };
  
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
  
  // To swap to ShadCN:
  // return <ShadCNButton variant={variant} size={size} className={className} {...props} />;
  
  // To swap to Bootstrap:
  // return <BootstrapButton variant={variant} size={size} className={className} {...props} />;
  
  // To swap to Material-UI:
  // return <MUIButton variant="contained" size={size} className={className} {...props} />;
}

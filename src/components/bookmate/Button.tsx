import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  size = 'md', 
  disabled = false, 
  ...props 
}) => {
  const sizes = {
    xs: "px-2 py-1 text-xs rounded-md",
    sm: "px-3 py-1.5 text-xs rounded-lg",
    md: "px-4 py-3 text-sm rounded-xl",
    lg: "px-6 py-4 text-base rounded-xl",
    icon: "p-2 rounded-full aspect-square flex items-center justify-center"
  };

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-900/20 shadow-lg active:translate-y-0.5",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800",
    ghost: "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
    danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-900/20 shadow-lg",
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      type="button"
      className={`font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

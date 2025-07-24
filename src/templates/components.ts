export default {
  button: `import React from 'react';


interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

  const baseClasses = 'inline-flex items-center justify-center gap-2 border-2 border-transparent rounded-md font-medium text-center transition-all duration-200 cursor-pointer select-none relative outline-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600 disabled:opacity-50',
    secondary: 'bg-gray-500 text-white border-gray-500 hover:bg-gray-600 hover:border-gray-600 disabled:opacity-50',
    outline: 'bg-transparent text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white disabled:opacity-50',
    ghost: 'bg-transparent text-blue-500 border-transparent hover:bg-blue-50 disabled:opacity-50'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };


/**
 * 
 * @param props - The component props
 * @returns The rendered button component
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...rest
}) => {

  const finalClassName = \`\${baseClasses} \${variantClasses[variant]} \${sizeClasses[size]} \${
    disabled || loading ? 'cursor-not-allowed' : ''
  } \${loading ? 'cursor-wait' : ''} \${className}\`.trim().replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      className={finalClassName}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading && (
        <svg 
          className="w-4 h-4 animate-spin" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span className={loading ? 'opacity-70' : ''}>
        {children}
      </span>
    </button>
  );
};

export default Button;`,
};

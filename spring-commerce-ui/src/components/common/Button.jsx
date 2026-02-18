import React from 'react';
import clsx from 'clsx';
import { CgSpinner } from 'react-icons/cg';

const Button = ({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    disabled = false,
    className,
    onClick,
    ...props
}) => {
    const baseClass = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm hover:shadow-md',
        secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-200 shadow-sm',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
        ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            type={type}
            className={clsx(
                baseClass,
                variants[variant],
                sizes[size],
                fullWidth && 'w-full',
                isLoading && 'cursor-wait',
                className
            )}
            disabled={disabled || isLoading}
            onClick={onClick}
            {...props}
        >
            {isLoading && <CgSpinner className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
};

export default Button;

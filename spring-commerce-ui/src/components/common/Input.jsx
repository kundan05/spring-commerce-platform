import React, { forwardRef } from 'react';
import clsx from 'clsx';

const Input = forwardRef(({
    label,
    type = 'text',
    error,
    className,
    ...props
}, ref) => {
    return (
        <div className={clsx('w-full', className)}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                type={type}
                className={clsx(
                    'block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2.5 transition-colors duration-200',
                    error && 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
                )}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600 animate-fadeIn">
                    {error.message}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;

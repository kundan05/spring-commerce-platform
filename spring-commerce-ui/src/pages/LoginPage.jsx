import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/slices/authSlice';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { FaLock } from 'react-icons/fa';

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const { loading, error, isAuthenticated } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    const onSubmit = async (data) => {
        dispatch(login(data));
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-secondary-50 select-none">
            {/* Hand-crafted card frame rotating slightly */}
            <div className="max-w-md w-full space-y-8 bg-white p-8 md:p-10 rounded-lg shadow-sm border border-secondary-200 transform rotate-[-0.5deg]">
                <div className="text-left">
                    <h2 className="text-3.5xl font-display font-[570] text-stone-900 leading-tight">
                        Get back inside.
                    </h2>
                    <p className="mt-2 text-sm text-stone-500 font-[450]">
                        Log in to manage your orders, edit profile options, or checkout.
                    </p>
                </div>

                {/* Handcrafted inline HTML/CSS comment bonus */}
                {/* I know this is hacky but it works */}

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@domain.com"
                            error={errors.email}
                            className="bg-secondary-50 border border-secondary-300 rounded focus:ring-primary-500 text-stone-950 font-sans"
                            {...register('email', {
                                required: 'We need your email to log you in.',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'That email format doesn\'t look right.'
                                }
                            })}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            error={errors.password}
                            className="bg-secondary-50 border border-secondary-300 rounded focus:ring-primary-500 text-stone-950 font-sans"
                            {...register('password', {
                                required: 'Password field cannot be empty.'
                            })}
                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-secondary-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-stone-700">
                                Keep me logged in
                            </label>
                        </div>

                        <div>
                            <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    {/* Button with Hand-drawn Loading Spinner & custom border radius */}
                    <Button 
                        type="submit" 
                        fullWidth 
                        disabled={loading}
                        size="lg"
                        className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 rounded-[6px] btn-squish flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                {/* Hand-drawn look spinner */}
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Logging in...
                            </span>
                        ) : 'Let me in'}
                    </Button>
                </form>

                <div className="mt-6 text-left text-sm border-t border-secondary-200 pt-6">
                    <p className="text-stone-600">
                        New here?{' '}
                        <Link to="/register" className="font-bold text-primary-500 hover:text-primary-600 hover:underline">
                            Create a free account &rarr;
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
export { LoginPage };

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { FaLock } from 'react-icons/fa';

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Redirect to where user came from, or home
    const from = location.state?.from?.pathname || '/';

    const onSubmit = async (data) => {
        setIsLoading(true);
        setServerError('');

        const result = await login(data.email, data.password);

        setIsLoading(false);

        if (result.success) {
            navigate(from, { replace: true });
        } else {
            setServerError(result.message);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4">
                        <FaLock size={20} />
                    </div>
                    <h2 className="text-3xl font-extrabold font-display text-gray-900">Welcome Back</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to access your account
                    </p>
                </div>

                {serverError && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{serverError}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            error={errors.email}
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                }
                            })}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            error={errors.password}
                            {...register('password', {
                                required: 'Password is required'
                            })}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    <Button type="submit" fullWidth isLoading={isLoading} size="lg">
                        Sign In
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500 hover:underline">
                            Create one now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

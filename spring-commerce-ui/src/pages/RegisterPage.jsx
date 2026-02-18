import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { FaUserPlus } from 'react-icons/fa';

const RegisterPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { register: registerUser, login } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        setServerError('');

        // Register
        const regResult = await registerUser(data);

        if (regResult.success) {
            // Auto login after registration
            const loginResult = await login(data.email, data.password);
            if (loginResult.success) {
                navigate('/');
            } else {
                navigate('/login');
            }
        } else {
            setServerError(regResult.message);
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4">
                        <FaUserPlus size={20} />
                    </div>
                    <h2 className="text-3xl font-extrabold font-display text-gray-900">Create Account</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Join SpringCommerce today
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
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            placeholder="John"
                            error={errors.firstName}
                            {...register('firstName', { required: 'First name is required' })}
                        />

                        <Input
                            label="Last Name"
                            placeholder="Doe"
                            error={errors.lastName}
                            {...register('lastName', { required: 'Last name is required' })}
                        />
                    </div>

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
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters'
                            }
                        })}
                    />

                    <Button type="submit" fullWidth isLoading={isLoading} size="lg">
                        Create Account
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { logout } from '../store/slices/authSlice';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { FaUser, FaBox, FaKey, FaSignOutAlt, FaCheck } from 'react-icons/fa';
import { useToast } from '../context/ToastContext';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const { addToast } = useToast() || {};
    const [activeTab, setActiveTab] = useState('profile');
    const [profile, setProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    const { register: registerProfile, handleSubmit: handleProfileSubmit, reset: resetProfile, formState: { errors: profileErrors } } = useForm();
    const { register: registerPwd, handleSubmit: handlePwdSubmit, reset: resetPwd, formState: { errors: pwdErrors } } = useForm();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/users/me');
                setProfile(res.data.data);
                resetProfile({
                    firstName: res.data.data.firstName,
                    lastName: res.data.data.lastName,
                });
            } catch (err) {
                console.error('Failed to fetch profile', err);
            } finally {
                setLoadingProfile(false);
            }
        };
        fetchProfile();
    }, [resetProfile]);

    const onSaveProfile = async (data) => {
        setSavingProfile(true);
        try {
            const res = await api.put('/users/me', data);
            setProfile(res.data.data);
            if (addToast) addToast('Profile updated successfully!', 'success');
        } catch (err) {
            if (addToast) addToast(err.response?.data?.message || 'Failed to update profile', 'error');
        } finally {
            setSavingProfile(false);
        }
    };

    const onChangePassword = async (data) => {
        setChangingPassword(true);
        try {
            await api.put('/users/me/password', {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });
            resetPwd();
            if (addToast) addToast('Password changed successfully!', 'success');
        } catch (err) {
            if (addToast) addToast(err.response?.data?.message || 'Failed to change password', 'error');
        } finally {
            setChangingPassword(false);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    if (loadingProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const tabs = [
        { id: 'profile', label: 'Profile', icon: FaUser },
        { id: 'orders', label: 'My Orders', icon: FaBox },
        { id: 'password', label: 'Security', icon: FaKey },
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold font-display text-gray-900 mb-8">My Account</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <div className="lg:w-64 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 bg-gradient-to-br from-primary-600 to-primary-700 text-white text-center">
                            <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                                {profile?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
                            </div>
                            <p className="font-semibold">{profile?.firstName} {profile?.lastName}</p>
                            <p className="text-primary-100 text-sm mt-1">{profile?.email || user?.email}</p>
                        </div>

                        <nav className="p-2">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                                        activeTab === tab.id
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <tab.icon size={16} />
                                    {tab.label}
                                </button>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-1"
                            >
                                <FaSignOutAlt size={16} />
                                Sign Out
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
                            <form onSubmit={handleProfileSubmit(onSaveProfile)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="First Name"
                                        placeholder="John"
                                        error={profileErrors.firstName}
                                        {...registerProfile('firstName', { required: 'First name is required' })}
                                    />
                                    <Input
                                        label="Last Name"
                                        placeholder="Doe"
                                        error={profileErrors.lastName}
                                        {...registerProfile('lastName', { required: 'Last name is required' })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={profile?.email || ''}
                                        disabled
                                        className="block w-full rounded-lg border-gray-300 shadow-sm sm:text-sm py-2.5 bg-gray-50 text-gray-500 cursor-not-allowed"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" isLoading={savingProfile}>
                                        <FaCheck className="mr-2" size={14} /> Save Changes
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Order History</h2>
                                <Link to="/order-history" className="text-primary-600 text-sm font-medium hover:underline">
                                    View All Orders →
                                </Link>
                            </div>
                            <p className="text-gray-500 text-sm">
                                View and manage all your past orders from the{' '}
                                <Link to="/order-history" className="text-primary-600 hover:underline font-medium">
                                    Order History
                                </Link>{' '}
                                page.
                            </p>
                        </div>
                    )}

                    {/* Password Tab */}
                    {activeTab === 'password' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
                            <form onSubmit={handlePwdSubmit(onChangePassword)} className="space-y-6 max-w-md">
                                <Input
                                    label="Current Password"
                                    type="password"
                                    placeholder="••••••••"
                                    error={pwdErrors.currentPassword}
                                    {...registerPwd('currentPassword', { required: 'Current password is required' })}
                                />
                                <Input
                                    label="New Password"
                                    type="password"
                                    placeholder="••••••••"
                                    error={pwdErrors.newPassword}
                                    {...registerPwd('newPassword', {
                                        required: 'New password is required',
                                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                    })}
                                />
                                <Input
                                    label="Confirm New Password"
                                    type="password"
                                    placeholder="••••••••"
                                    error={pwdErrors.confirmPassword}
                                    {...registerPwd('confirmPassword', {
                                        required: 'Please confirm your password',
                                        validate: (value, formValues) =>
                                            value === formValues.newPassword || 'Passwords do not match'
                                    })}
                                />
                                <Button type="submit" isLoading={changingPassword}>
                                    <FaKey className="mr-2" size={14} /> Update Password
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { registerSchema } from '../../validators/schemas';
import { authService } from '../../services/authService';
import { useToast } from '../../context/ToastContext';
import Input from '../../components/Common/Input';

const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [generalError, setGeneralError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      setGeneralError('');
      await authService.register(data);
      showToast('Account created successfully! Please sign in.', 'success');
      navigate('/login');
    } catch (err) {
      if (err.fieldErrors && Object.keys(err.fieldErrors).length > 0) {
        Object.keys(err.fieldErrors).forEach((field) => {
          setError(field, { message: err.fieldErrors[field] });
        });
        showToast('Please fix the errors in the form.', 'error');
      } 
      else if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        err.response.data.errors.forEach((e) => {
          if (e.field) setError(e.field, { message: e.message });
        });
        showToast('Registration validation failed.', 'error');
      } 
      else {
        const errorMessage = err.response?.data?.message || 'Registration failed';
        setGeneralError(errorMessage);
        showToast(errorMessage, 'error');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Join our video streaming platform today</p>
      </div>

      {generalError && (
        <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-600 text-xs rounded-xl text-center font-medium">
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Username"
          type="text"
          placeholder="john_doe"
          autoComplete="username"
          error={errors.username?.message}
          {...register('username')}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="john.doe@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Password Input with Eye Toggle */}
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-red-600 text-white font-semibold text-xs rounded-xl hover:bg-red-700 transition-colors shadow-md shadow-red-500/20 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p className="text-center text-xs text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="text-red-500 font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default Register;
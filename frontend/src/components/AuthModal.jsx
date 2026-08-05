import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, closeAuthModal } from '../store/authSlice.js';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function AuthModal() {
  const { isModalOpen, modalMode, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [mode, setMode] = useState(modalMode);
  const { register: rhfRegister, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    setMode(modalMode);
    reset();
  }, [modalMode, isModalOpen, reset]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  if (!isModalOpen) return null;

  const onSubmit = async (data) => {
    if (mode === 'login') {
      await dispatch(login(data));
    } else {
      await dispatch(register(data));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-fade-in">
        <button 
          onClick={() => dispatch(closeAuthModal())}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-2xl inline-block px-4 py-2 rounded-lg mb-4">
              Khrido
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="text-gray-600">
              {mode === 'login' ? 'Sign in to continue shopping' : 'Join us for exclusive deals'}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {mode === 'register' && (
              <div>
                <input 
                  {...rhfRegister('name', { required: 'Name is required' })} 
                  placeholder="Full Name" 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
            )}
            
            <div>
              <input 
                {...rhfRegister('email', { required: 'Email is required' })} 
                type="email" 
                placeholder="Email Address" 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <input 
                {...rhfRegister('password', { required: 'Password is required', minLength: 6 })} 
                type="password" 
                placeholder="Password" 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {mode === 'login' ? (
                <>New to Khrido? <button onClick={() => setMode('register')} className="text-blue-600 font-semibold hover:underline">Sign up</button></>
              ) : (
                <>Already have an account? <button onClick={() => setMode('login')} className="text-blue-600 font-semibold hover:underline">Sign in</button></>
              )}
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
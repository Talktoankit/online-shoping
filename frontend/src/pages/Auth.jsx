import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { login, register } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

export default function Auth({ isLogin }) {
  const { register: rhfRegister, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector(state => state.auth);

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);
  useEffect(() => { if (error) toast.error(error); }, [error]);

  const onSubmit = async (data) => {
    if (isLogin) await dispatch(login(data));
    else await dispatch(register(data));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!isLogin && (
          <input {...rhfRegister('name', { required: 'Name is required' })} placeholder="Name" className="w-full p-2 border rounded" />
        )}
        <input {...rhfRegister('email', { required: 'Email is required' })} type="email" placeholder="Email" className="w-full p-2 border rounded" />
        <input {...rhfRegister('password', { required: 'Password is required', minLength: 6 })} type="password" placeholder="Password" className="w-full p-2 border rounded" />
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
        </button>
      </form>
      <p className="mt-4 text-center">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <Link to={isLogin ? '/register' : '/login'} className="text-blue-600 ml-1">{isLogin ? 'Register' : 'Login'}</Link>
      </p>
    </div>
  );
}
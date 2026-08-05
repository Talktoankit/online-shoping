import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../store/authSlice.js';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '../services/api.js';
import { UserIcon, ShoppingBagIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

export default function Account() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { name: user?.name || '', email: user?.email || '', password: '' }
  });

  useEffect(() => {
    if (user) {
      reset({ name: user.name, email: user.email, password: '' });
      if (activeTab === 'orders') fetchOrders();
    }
  }, [user, activeTab, reset]);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/my-orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };

  const onSubmit = async (data) => {
    const updateData = { name: data.name, email: data.email };
    if (data.password) updateData.password = data.password;
    
    await dispatch(updateProfile(updateData));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Account</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-4 space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === 'profile' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <UserIcon className="h-5 w-5" />
                Profile Details
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === 'orders' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ShoppingBagIcon className="h-5 w-5" />
                My Orders
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
                  Personal Information
                </h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      {...register('email', { required: 'Email is required' })}
                      type="email"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                      readOnly // Usually email shouldn't be easily changed without verification
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password <span className="text-gray-400 font-normal">(Leave blank to keep current)</span>
                    </label>
                    <input
                      {...register('password', { minLength: 6 })}
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">Password must be at least 6 characters</p>}
                  </div>

                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
                  Order History
                </h2>
                
                {orders.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <ShoppingBagIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-lg">You haven't placed any orders yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                        <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
                          <div>
                            <p className="text-sm text-gray-500">Order ID: <span className="font-mono text-gray-800">{order._id}</span></p>
                            <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-600">{order.items.length} item(s)</p>
                          <p className="text-lg font-bold text-blue-600">${order.totalAmount.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
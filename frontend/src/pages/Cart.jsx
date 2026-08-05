import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../store/cartSlice.js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api.js';
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

export default function Cart() {
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(String(id)));
    toast.success('Item removed from cart');
  };

  const handleCheckout = async () => {  
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }

    try {
      const orderData = {
        items: items.map(item => ({ productId: item._id, quantity: item.quantity })),
        totalAmount: parseFloat(totalAmount)
      };
      
      await api.post('/orders', orderData);
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl shadow-lg p-12 max-w-md">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added anything yet</p>
          <button 
            onClick={() => navigate('/')} 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart ({items.length} items)</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {items.map((item) => (
              <div key={item._id} className="bg-white rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6">
                <img 
                  src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`} 
                  alt={item.name} 
                  className="w-24 h-24 object-cover rounded-xl"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                />
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                  <p className="text-blue-600 font-bold text-lg">${item.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-lg">
                    <button 
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      className="px-3 py-2 hover:bg-gray-100 transition"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 font-semibold">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      className="px-3 py-2 hover:bg-gray-100 transition"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => handleRemove(item._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-semibold">${totalAmount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-xl font-bold text-gray-800">
                  <span>Total</span>
                  <span className="text-blue-600">${totalAmount}</span>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all mb-3"
              >
                Proceed to Checkout
              </button>
              
              <button 
                onClick={() => dispatch(clearCart())}
                className="w-full text-red-500 font-semibold py-2 hover:bg-red-50 rounded-lg transition"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
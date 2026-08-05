import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../store/productSlice.js';
import { addToCart } from '../store/cartSlice.js';
import { openAuthModal } from '../store/authSlice.js';
import { toast } from 'react-toastify';
import { StarIcon, ShoppingCartIcon, BoltIcon } from '@heroicons/react/24/solid';

export default function Home() {
  const { items, loading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => { 
    dispatch(fetchProducts()); 
  }, [dispatch]);

  const handleAddToCart = (product) => {
    if (!user) {
      dispatch(openAuthModal('login'));
      toast.info('Please sign in to add items to cart');
      return;
    }
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = (product) => {
    if (!user) {
      dispatch(openAuthModal('login'));
      toast.info('Please sign in to checkout');
      return;
    }
    dispatch(addToCart(product));
    toast.success('Redirecting to checkout...');
  };

  // Categories data
  const categories = [
    { name: 'Electronics', icon: '💻', count: '2.4k Products' },
    { name: 'Fashion', icon: '👕', count: '1.8k Products' },
    { name: 'Home & Garden', icon: '🏠', count: '950 Products' },
    { name: 'Sports', icon: '⚽', count: '720 Products' },
    { name: 'Books', icon: '📚', count: '3.1k Products' },
    { name: 'Toys', icon: '🎮', count: '540 Products' },
  ];

  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Smart Wearable. <br/>
              <span className="text-yellow-300">Up to 40% OFF</span>
            </h1>
            <p className="text-lg mb-8 text-blue-100">
              Discover the latest in smart technology. Premium quality products at unbeatable prices.
            </p>
            <div className="flex gap-4">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-lg">
                Shop Now
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-blue-600 transition">
                View Deals
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Shop by Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-1">{cat.name}</h3>
                <p className="text-xs text-gray-500">{cat.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
            <button className="text-blue-600 font-semibold hover:underline">View All →</button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <p className="text-gray-500 text-lg mb-4">No products available yet</p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                Check Back Soon
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((product) => (
                <div 
                  key={product._id} 
                  className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100"
                >
                  {/* Product Image */}
                  <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center h-64 overflow-hidden">
                    <img 
                      src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`} 
                      alt={product.name} 
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'; }}
                    />
                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="bg-white p-2 rounded-full shadow-md hover:bg-blue-600 hover:text-white transition">
                        <StarIcon className="h-5 w-5" />
                      </button>
                    </div>
                    {/* Discount Badge */}
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      -20%
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 h-12 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">(4.5)</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl font-bold text-blue-600">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        ${(product.price * 1.2).toFixed(2)}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2"
                      >
                        <ShoppingCartIcon className="h-5 w-5" />
                        Add to Cart
                      </button>
                      <button 
                        onClick={() => handleBuyNow(product)}
                        className="bg-orange-500 hover:bg-orange-600 text-white p-2.5 rounded-lg transition"
                      >
                        <BoltIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 bg-white mt-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="text-4xl mb-3">🚚</div>
              <h3 className="font-semibold text-gray-800 mb-2">Free Shipping</h3>
              <p className="text-sm text-gray-600">On orders over $50</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-semibold text-gray-800 mb-2">Secure Payment</h3>
              <p className="text-sm text-gray-600">100% secure checkout</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-3">️</div>
              <h3 className="font-semibold text-gray-800 mb-2">Easy Returns</h3>
              <p className="text-sm text-gray-600">30-day return policy</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="font-semibold text-gray-800 mb-2">24/7 Support</h3>
              <p className="text-sm text-gray-600">Dedicated support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
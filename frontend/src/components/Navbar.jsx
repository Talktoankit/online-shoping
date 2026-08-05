import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, openAuthModal } from '../store/authSlice.js';
import { ShoppingCartIcon, UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => { 
    dispatch(logout()); 
    navigate('/'); 
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm py-2">
        <div className="container mx-auto px-4 text-center">
          <span>🎉 Free Shipping on Orders Over $50 | Use Code: SAVE20</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-2xl px-3 py-1 rounded-lg">
              Khrido
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search for products..." 
                className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-blue-500 transition"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden lg:block text-right">
                  <p className="text-sm font-medium text-gray-700">Hi, {user.name.split(' ')[0]}</p>
                  <Link to={user.role === 'admin' ? '/admin' : '/account'} className="text-xs text-blue-600 hover:underline">
                    {user.role === 'admin' ? 'Dashboard' : 'My Account'}
                  </Link>
                </div>
                <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-blue-600 font-medium">
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => dispatch(openAuthModal('login'))}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
              >
                <UserIcon className="h-6 w-6" />
                <span className="hidden sm:inline font-medium">Sign In</span>
              </button>
            )}

            <Link to="/cart" className="relative flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
              <ShoppingCartIcon className="h-6 w-6" />
              <span className="hidden sm:inline font-medium">Cart</span>
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-4 md:hidden">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-4 pr-12 py-2 border-2 border-gray-200 rounded-full focus:outline-none focus:border-blue-500"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-1.5 rounded-full">
              <MagnifyingGlassIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="border-t border-gray-100">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-8 py-3 text-sm overflow-x-auto">
            <li><Link to="/" className="text-blue-600 font-semibold whitespace-nowrap">Home</Link></li>
            <li><Link to="/shop" className="text-gray-600 hover:text-blue-600 whitespace-nowrap">Shop</Link></li>
            <li><Link to="/categories" className="text-gray-600 hover:text-blue-600 whitespace-nowrap">Categories</Link></li>
            <li><Link to="/deals" className="text-gray-600 hover:text-blue-600 whitespace-nowrap">Deals</Link></li>
            <li><Link to="/new-arrivals" className="text-gray-600 hover:text-blue-600 whitespace-nowrap">New Arrivals</Link></li>
            <li><Link to="/contact" className="text-gray-600 hover:text-blue-600 whitespace-nowrap">Contact</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
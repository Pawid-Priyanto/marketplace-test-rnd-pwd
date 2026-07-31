import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ClipboardList, 
  Heart, 
  Wallet, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Marketplace', icon: ShoppingBag, path: '/marketplace' },
    { name: 'Orders', icon: ClipboardList, path: '/orders' },
    { name: 'My Favorites', icon: Heart, path: '/favorites' },
    { name: 'Wallet', icon: Wallet, path: '/wallet' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col justify-between p-6 h-screen sticky top-0">
      <div className="space-y-8">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-lg shadow-md shadow-indigo-100">
            V
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">VocaMarket</span>
        </div>

        {/* Navigations */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  isActive 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Action (Pinned to bottom without needing to scroll) */}
      <div className="pt-4 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
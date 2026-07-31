import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export function Header() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-8">
      {/* Search Bar */}
      <div className="relative w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <Search className="h-4 w-4" />
        </div>
        <input 
          type="text" 
          placeholder="Search products, games, categories..."
          className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-gray-50/50"
        />
      </div>

      {/* Notifications & User Profile Info */}
      <div className="flex items-center space-x-5">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        
        <div className="flex items-center space-x-3 border-l pl-5 border-gray-200">
          <img 
            src={"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces"} 
            alt="Profile" 
            className="h-10 w-10 rounded-full object-cover border border-gray-200"
          />
          <div className="text-left">
            <div className="text-sm font-semibold text-gray-900">{user?.name || 'John Doe'}</div>
            <div className="text-xs text-indigo-600 font-medium">{user?.role || 'Premium'}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
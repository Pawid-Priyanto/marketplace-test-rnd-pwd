import { useEffect, useState } from 'react';
import { DashboardService } from '../lib/dashboard.service';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useAuthStore } from '../store/useAuthStore';
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  DollarSign,
  Gamepad2,
  Smartphone,
  Gift,
  Shield
} from 'lucide-react';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, catRes, ordersRes] = await Promise.all([
          DashboardService.getStats(),
          DashboardService.getCategories(),
          DashboardService.getRecentOrders(),
        ]);

        if (statsRes.success) setStats(statsRes.data);
        if (catRes.success) setCategories(catRes.data);
        if (ordersRes.success) setRecentOrders(ordersRes.data);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 font-medium">Loading Dashboard...</div>
      </div>
    );
  }

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Gamepad2': return <Gamepad2 className="h-6 w-6 text-indigo-600" />;
      case 'Smartphone': return <Smartphone className="h-6 w-6 text-blue-600" />;
      case 'Gift': return <Gift className="h-6 w-6 text-amber-600" />;
      default: return <Shield className="h-6 w-6 text-purple-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Component */}
        <Header />

        {/* Dashboard View Content */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Greeting Section */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center space-x-2">
              <span>Good Morning, {user?.name?.split(' ')[0] || 'John'}</span>
              <span className="text-xl">👋</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Here's what's happening with your store today.</p>
          </div>

          {/* Stats Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between text-gray-500 mb-4">
                <span className="text-sm font-medium">Products</span>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Package className="h-5 w-5" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats?.products.total || '1,245'}</div>
              <div className="mt-2 text-xs font-semibold text-emerald-600 flex items-center">
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                {stats?.products.growth || '+12.5% vs yesterday'}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between text-gray-500 mb-4">
                <span className="text-sm font-medium">Orders Today</span>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <ShoppingCart className="h-5 w-5" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats?.ordersToday.total || '328'}</div>
              <div className="mt-2 text-xs font-semibold text-emerald-600 flex items-center">
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                {stats?.ordersToday.growth || '+8.2% vs yesterday'}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between text-gray-500 mb-4">
                <span className="text-sm font-medium">Revenue Today</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <DollarSign className="h-5 w-5" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats?.revenueToday.total || '$18,245.00'}</div>
              <div className="mt-2 text-xs font-semibold text-emerald-600 flex items-center">
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                {stats?.revenueToday.growth || '+15.3% vs yesterday'}
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Categories</h2>
              <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">View all</a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4 hover:border-indigo-100 transition-all cursor-pointer">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    {getCategoryIcon(cat.icon)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{cat.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{cat.itemCount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders Table Section */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <th className="py-4 px-6">Order ID</th>
                    <th className="py-4 px-6">Product</th>
                    <th className="py-4 px-6">Amount</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {recentOrders.map((order, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-gray-900">{order.orderId}</td>
                      <td className="py-4 px-6 text-gray-700">{order.product}</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">{order.amount}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Completed' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-500 text-xs">{order.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Footer Component */}
        <Footer />
      </div>
    </div>
  );
}
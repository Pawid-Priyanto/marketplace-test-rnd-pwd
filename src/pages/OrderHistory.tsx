import  { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { OrderService } from '../lib/order.service';
import { Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/Button';
import { cn } from '../utils/cn';
import { formatRupiah } from '../utils/helper';

export function OrderHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Ubah jumlah item per halaman sesuai kebutuhan

  const userEmail = localStorage.getItem('auth_user') ? JSON.parse(localStorage.getItem('auth_user') as string) : null;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await OrderService.getOrders(userEmail?.email as string);
        console.log('Fetched Orders:', response);
        if (response.success && Array.isArray(response.data)) {
          setOrders(response.data);
        } else if (Array.isArray(response)) {
          setOrders(response);
        }
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Reset ke halaman 1 jika tab atau search query berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // Filter berdasarkan Tab dan Search Query
  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === 'All' || order.status.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.productSummary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Logika Data untuk Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Header & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">Order History</h1>
              <p className="text-sm text-gray-500 mt-1">View all your transactions and order status.</p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search order ID or product..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 shadow-sm"
              />
            </div>
          </div>

          {/* Tabs Filter (All, Completed, Pending, Failed) */}
          <div className="flex space-x-2 border-b border-gray-200 text-sm font-semibold pb-3">
            {['All', 'Completed', 'Pending', 'Failed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-white",
                  "border-b-2",
                  activeTab === tab 
                    ? "border-indigo-600 text-indigo-600 font-semibold shadow-xs" 
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                        <th className="py-4 px-6">Order ID</th>
                        <th className="py-4 px-6">Product</th>
                        <th className="py-4 px-6">Amount</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6">Date</th>
                        <th className="py-4 px-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {currentOrders.length > 0 ? (
                        currentOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 px-6 font-semibold text-gray-900 font-mono text-xs">{order.id}</td>
                            <td className="py-4 px-6 text-gray-600 max-w-xs truncate">{order.productSummary}</td>
                            <td className="py-4 px-6 font-bold text-gray-900">{formatRupiah(order.amount)}</td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                order.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                                order.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                                'bg-rose-50 text-rose-700'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-gray-500 text-xs">{order.date}</td>
                            <td className="py-4 px-6 text-right">
                              <Button className="px-3.5 py-1.5 bg-white border border-gray-200/80 rounded-lg text-xs font-medium text-gray-700 hover:bg-indigo-50/60 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-150 shadow-xs active:scale-95">
                                View
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-16 text-center text-gray-400 text-sm">
                            No orders found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer */}
                {filteredOrders.length > 0 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                    <span className="text-xs text-gray-500">
                      Showing <span className="font-semibold text-gray-700">{startIndex + 1}</span> to <span className="font-semibold text-gray-700">{Math.min(startIndex + itemsPerPage, filteredOrders.length)}</span> of <span className="font-semibold text-gray-700">{filteredOrders.length}</span> results
                    </span>

                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 bg-white text-gray-700 flex items-center gap-1 transition-all",
                          currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 hover:text-indigo-600"
                        )}
                      >
                        <ChevronLeft className="h-3.5 w-3.5" /> Previous
                      </Button>

                      <span className="text-xs font-medium text-gray-600 px-2">
                        Page {currentPage} of {totalPages || 1}
                      </span>

                      <Button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 bg-white text-gray-700 flex items-center gap-1 transition-all",
                          (currentPage === totalPages || totalPages === 0) ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 hover:text-indigo-600"
                        )}
                      >
                        Next <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
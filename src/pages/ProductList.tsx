import { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Card, CardContent, CardFooter } from '../components/Card';
import { formatRupiah } from '../utils/helper';
import { ProductService } from '../lib/product.service';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  ChevronDown, 
  LayoutGrid, 
  List, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  Loader2 
} from 'lucide-react';

export default function MarketplacePage() {
    const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('Popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const perPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await ProductService.getProducts({
          page: currentPage,
          perPage,
          search: searchTerm,
          category: selectedCategory,
          sortBy,
        });

        if (response.success) {
          setProducts(response.data.products);
          setTotal(response.data.total);
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, searchTerm, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Marketplace</h1>
            <p className="text-sm text-gray-500 mt-1">Find your favorite games and digital products. Total: {total} items</p>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search className="h-4 w-4" />
              </div>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent bg-gray-50/40"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Category Dropdown */}
                <div className="relative">
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
                  >
                    <option value="All Categories">All Categories</option>
                    <option value="Games">Games</option>
                    <option value="Mobile Topup">Mobile Topup</option>
                    <option value="Gift Cards">Gift Cards</option>
                    <option value="Entertainment">Entertainment</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
                  >
                    <option value="Popular">Sort by: Popular</option>
                    <option value="Lowest Price">Sort by: Lowest Price</option>
                    <option value="Highest Price">Sort by: Highest Price</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* View Toggles */}
              <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-xl">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid / Loading Indicator */}
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <Card key={product.id} onClick={() => navigate(`/product/${product.id}`)} className="group cursor-pointer hover:border-indigo-200">
                    <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <CardContent className="p-4 space-y-1">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{product.name}</h3>
                      <p className="text-xs text-gray-500">{product.sub}</p>
                      
                      <div className="flex items-center justify-between pt-2">
                        <span className="font-bold text-gray-900 text-sm">{formatRupiah(product.price)}</span>
                        <div className="flex items-center space-x-1 text-xs font-medium text-amber-500">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span>{product.rating}</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="px-4 pb-4 pt-0">
                      <span className="text-xs text-gray-400 font-medium">Stock: {product.stock}</span>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-16 text-center text-gray-500 text-sm bg-white rounded-2xl border border-gray-100 shadow-sm">
                  No products found matching your search.
                </div>
              )}
            </div>
          )}

          {/* Dynamic Pagination Controls */}
          {totalPages > 1 && !loading && (
            <div className="flex items-center justify-center space-x-2 pt-6 pb-4">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${
                      currentPage === pageNumber 
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-100' 
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
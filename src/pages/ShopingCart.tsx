import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { useCartStore } from '../store/useCartStore';
import { useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowLeft } from 'lucide-react';
import { formatRupiah } from '../utils/helper';
import { Button } from '../components/Button';


export function CartPage() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity } = useCartStore();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.11;
  const serviceFee = items.length > 0 ? 1000 : 0;
  const total = subtotal + tax + serviceFee;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">Shopping Cart</h1>
              <p className="text-sm text-gray-500 mt-1">{items.length} items in your cart</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 grid grid-cols-12 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              <div className="divide-y divide-gray-100">
                {items.length > 0 ? (
                  items.map((item) => (
                    <div key={item.id} className="p-6 grid grid-cols-12 items-center">
                      <div className="col-span-6 flex items-center space-x-4">
                        <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl object-cover border border-gray-100" />
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                          <p className="text-xs text-gray-500">{item.category}</p>
                        </div>
                      </div>

                      <div className="col-span-2 text-center font-semibold text-gray-900 text-sm">
                        {formatRupiah(item.price)}
                      </div>

                      <div className="col-span-2 flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-bold text-gray-900 w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="col-span-2 flex items-center justify-end space-x-4">
                        <span className="font-bold text-gray-900 text-sm">{formatRupiah(item.price * item.quantity)}</span>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-16 text-center text-gray-500 text-sm">
                    Your cart is empty.
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary Checkout Card */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>
                <div className="space-y-3 pt-2 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">{formatRupiah(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Tax (11%)</span>
                    <span className="font-semibold text-gray-900">{formatRupiah(tax)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Service Fee</span>
                    <span className="font-semibold text-gray-900">{formatRupiah(serviceFee)}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex justify-between text-base font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-indigo-600">{formatRupiah(total)}</span>
                  </div>
                </div>

                <Button 
                  onClick={() => navigate('/checkout')}
                  disabled={items.length === 0}
                  className="w-full mt-4 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Checkout
                </Button>
              </div>

              <button 
                onClick={() => navigate('/marketplace')}
                className="w-flex flex items-center justify-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Continue Shopping</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
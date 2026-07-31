import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Button } from '../components/Button';
import { OrderService } from '../lib/order.service';
import { formatRupiah } from '../utils/helper';

export function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const user = useAuthStore((state) => state.user);

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    fullName: user?.name || 'John Doe',
    email: user?.email || 'john.doe@email.com',
    phone: '+1 234 567 8900',
  });

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.11;
  const serviceFee = items.length > 0 ? 1000 : 0;
  const total = subtotal + tax + serviceFee;

 const handleCompletePurchase = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
     
      navigate('/marketplace');
      return;
    }

    setLoading(true);

    try {
      // Kirim data ke API checkout (MSW)
      const response = await OrderService.checkout({
        items,
        total,
        paymentMethod,
        formData,
      });

      if (response.success) {
        clearCart();

        navigate('/success', { state: response.data });
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert('Gagal melakukan checkout. Periksa kembali stok produk atau koneksi Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Checkout</h1>
            <p className="text-sm text-gray-500 mt-1">Complete your billing and payment information.</p>
          </div>

          <form onSubmit={handleCompletePurchase} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Form: Billing & Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Billing Information */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-gray-900">Billing Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-gray-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-gray-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-gray-50/50"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>

                <div className="space-y-3">
                  <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600' : 'border-gray-200'}`}>
                    <div className="flex items-center space-x-3">
                      <input 
                        type="radio" 
                        name="payment" 
                        checked={paymentMethod === 'card'} 
                        onChange={() => setPaymentMethod('card')} 
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm font-semibold text-gray-900">Credit / Debit Card</span>
                    </div>
                    <div className="flex space-x-2 text-xs font-bold text-gray-400">
                      <span>VISA</span>
                      <span>MC</span>
                    </div>
                  </label>

                  <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'ewallet' ? 'border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600' : 'border-gray-200'}`}>
                    <div className="flex items-center space-x-3">
                      <input 
                        type="radio" 
                        name="payment" 
                        checked={paymentMethod === 'ewallet'} 
                        onChange={() => setPaymentMethod('ewallet')} 
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm font-semibold text-gray-900">E-Wallet</span>
                    </div>
                  </label>

                  <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'paypal' ? 'border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600' : 'border-gray-200'}`}>
                    <div className="flex items-center space-x-3">
                      <input 
                        type="radio" 
                        name="payment" 
                        checked={paymentMethod === 'paypal'} 
                        onChange={() => setPaymentMethod('paypal')} 
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm font-semibold text-gray-900">PayPal</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Summary */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>
                <p className="text-xs text-gray-400">{items.length} items</p>

                <div className="divide-y divide-gray-100 space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center pt-3 text-sm">
                      <div className="flex items-center space-x-3">
                        <img src={item.image} alt={item.name} className="h-10 w-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-semibold text-gray-900 text-xs">{item.name}</p>
                          <p className="text-[10px] text-gray-400">x{item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900 text-xs">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100 text-sm">
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
                  type="submit"
                  isLoading={loading}
                  disabled={items.length === 0 || loading}
                  className="w-full mt-4 flex items-center justify-center space-x-2 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lock className="h-4 w-4" />
                  <span>Complete Purchase</span>
                </Button>

                <p className="text-[10px] text-center text-gray-400 mt-2">
                  By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { CartItem } from '../store/useCartStore';

// Import Halaman & Guard ASLI
import LoginPage from '../pages/Login';
import RegisterPage from '../pages/Register';
import DashboardPage from '../pages/Dashboard';
import MarketplacePage from '../pages/ProductList';
import ProductDetailPage from '../pages/ProductDetail';
import { CartPage } from '../pages/ShopingCart';
import { CheckoutPage } from '../pages/Checkout';
import { SuccessPage } from '../pages/SuccessPage';
import { OrderHistoryPage } from '../pages/OrderHistory';
import { ComingSoonPage } from '../pages/ComingSoonPage';

import { ProtectedRoute } from '../components/ProtectedRoute';
import { GuestRoute } from '../components/GuestRoute';

// Import Store & Service ASLI
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { OrderService } from '../lib/order.service'; // 👈 Sesuaikan path file OrderService kamu

// -------------------------------------------------------------------
// 1. MOCK ORDER SERVICE
// -------------------------------------------------------------------
vi.mock('../lib/order.service', () => ({
  OrderService: {
    getOrders: vi.fn(),
    checkout: vi.fn(),
  },
}));

// Mock User & Product Baku
const mockUser = {
  id: 'usr-123',
  name: 'Test Admin',
  email: 'admin@marketplace.com',
  role: 'admin',
};

const mockProduct: CartItem = {
  id: 'm-10',
  name: 'PLN Token Listrik 100.000',
  category: 'Mobile Topup',
  price: 100000,
  quantity: 6,
  image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300',
};

// Response Aktual dari Backend Kamu
const mockCheckoutSuccessPayload = {
  success: true,
  message: 'Checkout successful',
  data: {
    id: 'INV-60168042',
    productSummary: 'PLN Token Listrik 100.000 (x6), Xbox Gift Card $15 (x2)',
    amount: 1203130,
    date: 'Jul 31, 2026 10:12 AM',
    status: 'Completed',
  },
};

const renderAppWithRouter = (initialRoute = '/checkout') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<ComingSoonPage />} />
      </Routes>
    </MemoryRouter>
  );
};

// -------------------------------------------------------------------
// TEST SUITE
// -------------------------------------------------------------------
describe('Full E2E Flow: Product Selection -> Cart -> Checkout -> Success', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // Set User Login
    useAuthStore.setState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });

    // Set Item Keranjang agar Tombol "Complete Purchase" Tidak Disabled
    useCartStore.setState({
      items: [mockProduct],
    });

    // Config Mock OrderService.checkout mengembalikan payload sukses
    vi.mocked(OrderService.checkout).mockResolvedValue(mockCheckoutSuccessPayload);
  });

  it('Executes complete buying journey from Marketplace to SuccessPage', async () => {
    renderAppWithRouter('/checkout');

    // 1. Pastikan Tombol "Complete Purchase" Ada dan Aktif
    const completePurchaseBtn = await screen.findByRole('button', {
      name: /complete purchase/i,
    });
    expect(completePurchaseBtn).not.toBeDisabled();

    // 2. Klik Complete Purchase
    fireEvent.click(completePurchaseBtn);

    // 3. Verifikasi OrderService.checkout Dipanggil
    await waitFor(() => {
      expect(OrderService.checkout).toHaveBeenCalledTimes(1);
    });

    // 4. Verifikasi Berhasil Masuk ke SuccessPage
    const successHeading = await screen.findByRole('heading', {
      name: /payment successful!/i,
    });

    expect(successHeading).toBeInTheDocument();
    expect(screen.getByText('INV-60168042')).toBeInTheDocument();
  });
});
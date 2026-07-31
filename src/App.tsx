import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage  from './pages/Login'; 
import RegisterPage  from './pages/Register';
import DashboardPage  from './pages/Dashboard'; 
import  MarketplacePage  from './pages/ProductList';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import { GuestRoute } from './components/GuestRoute';
import  ProductDetailPage  from './pages/ProductDetail';
import { CartPage } from './pages/ShopingCart';
import { CheckoutPage } from './pages/Checkout';
import { SuccessPage } from './pages/SuccessPage';
import { OrderHistoryPage } from './pages/OrderHistory';
import { ComingSoonPage } from './pages/ComingSoonPage';


export default function App() {
  return (
    
    <BrowserRouter>
    <Toaster 
        position="top-center" 
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            duration: 2000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
        }} 
      />
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
    </BrowserRouter>
  );
}
    
        
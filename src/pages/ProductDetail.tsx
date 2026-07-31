import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { useCartStore } from '../store/useCartStore';
import { ProductService } from '../lib/product.service';
import { formatRupiah } from '../utils/helper';
import { Star, ShieldCheck, Zap, Headphones, Minus, Plus, ShoppingCart, ArrowRight, Loader2 } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

 const cartItems = useCartStore((state) => state.items) || [];
 const addToCart = useCartStore((state) => state.addToCart); 

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await ProductService.getProductById(id);
        if (response.success) {
          setProduct(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch product detail', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

 

  const existingCartItem = cartItems.find((item: any) => item.id === product?.id);
  const quantityInCart = existingCartItem ? existingCartItem.quantity : 0;

  const remainingStock = product ? Math.max(0, product.stock - quantityInCart) : 0;
  const isOutOfStock = remainingStock <= 0;
   console.log(product?.stock, quantityInCart, remainingStock, 'pp')

  useEffect(() => {
    if (remainingStock <= 0) {
      setQuantity(0);
    } else if (quantity > remainingStock) {
      setQuantity(remainingStock);
    } else if (quantity === 0 && remainingStock > 0) {
      setQuantity(1);
    }
  }, [remainingStock]);

  const handleAddToCart = () => {
    if (!product || isOutOfStock || quantity <= 0) return;

    addToCart({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: quantity,
      image: product.image,
    });
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">
        Product not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="text-xs text-gray-400 space-x-2 font-medium">
            <span className="hover:text-gray-600 cursor-pointer" onClick={() => navigate('/marketplace')}>Marketplace</span>
            <span>&gt;</span>
            <span className="hover:text-gray-600 cursor-pointer">{product.category}</span>
            <span>&gt;</span>
            <span className="text-gray-900 font-semibold">{product.name}</span>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="h-96 w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm relative">
                <img src={product.image} alt={product.name} className={`h-full w-full object-cover ${isOutOfStock ? 'grayscale opacity-75' : ''}`} />
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
                      {product.stock === 0 ? 'Out of Stock' : 'Max Limit in Cart'}
                    </span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className={`h-20 rounded-xl overflow-hidden bg-gray-100 border cursor-pointer ${i === 0 ? 'border-indigo-600 ring-2 ring-indigo-50' : 'border-gray-200'}`}>
                    <img src={product.image} alt="thumbnail" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
                  <p className="text-sm text-gray-500 mt-1">{product.sub || product.category}</p>
                </div>

                <div className="flex items-center space-x-4 text-xs font-medium text-gray-500">
                  <div className="flex items-center text-amber-500 space-x-1">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-bold text-gray-900">{product.rating}</span>
                  </div>
                </div>

                <div className="text-3xl font-extrabold text-gray-900">{formatRupiah(product.price)}</div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs font-semibold text-gray-500">
                    Stock: <strong className="text-gray-900">{remainingStock}</strong>
                    {quantityInCart > 0 && (
                      <span className="text-indigo-600 ml-1.5 font-normal">
                        ({quantityInCart} already in cart)
                      </span>
                    )}
                  </span>

                  {!isOutOfStock ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                      In stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700">
                      {product.stock === 0 ? 'Out of stock' : 'Limit reached'}
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 leading-relaxed pt-2 border-t border-gray-100">
                  Top up {product.name}. Digital item will be delivered instantly after purchase completion.
                </p>

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-gray-700">Quantity</label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={isOutOfStock || quantity <= 1}
                        className="p-3 hover:bg-gray-200 text-gray-600 transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-6 text-sm font-bold text-gray-900">{isOutOfStock ? 0 : quantity}</span>
                      <button 
                        onClick={() => setQuantity(Math.min(remainingStock, quantity + 1))}
                        disabled={isOutOfStock || quantity >= remainingStock}
                        className="p-3 hover:bg-gray-200 text-gray-600 transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <button 
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || quantity <= 0}
                  className={`flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl border text-sm font-semibold transition-all shadow-sm ${
                    isOutOfStock || quantity <= 0
                      ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                      : 'border-indigo-600 text-indigo-600 hover:bg-indigo-50 active:scale-98'
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>

                <button 
                  onClick={() => { handleAddToCart(); navigate('/checkout'); }}
                  disabled={isOutOfStock || quantity <= 0}
                  className={`flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl text-sm font-semibold transition-all shadow-md ${
                    isOutOfStock || quantity <= 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 active:scale-98'
                  }`}
                >
                  <span>Buy Now</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Instant Delivery</p>
                    <p className="text-[10px] text-gray-400">1-5 minutes</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Secure Payment</p>
                    <p className="text-[10px] text-gray-400">100% protected</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Headphones className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">24/7 Support</p>
                    <p className="text-[10px] text-gray-400">We're here to help</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
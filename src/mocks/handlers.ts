import { http, HttpResponse, delay } from 'msw';

const API_URL = import.meta.env.VITE_API_URL || '';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// --- DATABASE Mock ---
export const masterProducts = [
  // --- GAMES (10 Products) ---
  { id: 'g-1', name: 'MLBB 86 Diamonds', price: 19500, category: 'Games', rating: 4.0, stock: 45, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500' },
  { id: 'g-2', name: 'PUBG Mobile 60 UC', price: 15000, category: 'Games', rating: 3.5, stock: 30, image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500' },
  { id: 'g-3', name: 'Free Fire 140 Diamonds', price: 20000, category: 'Games', rating: 4.1, stock: 50, image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500' },
  { id: 'g-4', name: 'Valorant 475 Points', price: 55000, category: 'Games', rating: 4.2, stock: 15, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500' },
  { id: 'g-5', name: 'Genshin Impact 300 Crystals', price: 75000, category: 'Games', rating: 2.5, stock: 12, image: 'https://images.unsplash.com/photo-1612287233002-91d0f5326c4a?w=500' },
  { id: 'g-7', name: 'PlayStation Network Card $20', price: 320000, category: 'Games', rating: 4.1, stock: 8, image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500' },
  { id: 'g-8', name: 'Xbox Gift Card $15', price: 240000, category: 'Games', rating: 4.5, stock: 10, image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500' },
  { id: 'g-10', name: 'Honkai Star Rail 300 Shards', price: 75000, category: 'Games', rating: 3.5, stock: 20, image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500' },

  // --- MOBILE TOPUP (10 Products) ---
  { id: 'm-1', name: 'Telkomsel Pulsa 50.000', price: 51000, category: 'Mobile Topup', rating: 3.5, stock: 100, image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500' },
  { id: 'm-2', name: 'Indosat Pulsa 50.000', price: 50500, category: 'Mobile Topup', rating: 4.2, stock: 85, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500' },
  { id: 'm-3', name: 'XL Axiata Pulsa 50.000', price: 51000, category: 'Mobile Topup', rating: 4.4, stock: 60, image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500' },
  { id: 'm-4', name: 'Tri Pulsa 50.000', price: 49000, category: 'Mobile Topup', rating: 4.1, stock: 90, image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500' },
  { id: 'm-5', name: 'Smartfren Pulsa 50.000', price: 50000, category: 'Mobile Topup', rating: 4.4, stock: 40, image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500' },
  { id: 'm-6', name: 'Telkomsel Data 10GB', price: 75000, category: 'Mobile Topup', rating: 4.1, stock: 75, image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500' },
  { id: 'm-7', name: 'Indosat Data 15GB', price: 70000, category: 'Mobile Topup', rating: 1.5, stock: 55, image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500' },
  { id: 'm-9', name: 'By.U Data 20GB Package', price: 95000, category: 'Mobile Topup', rating: 3.5, stock: 25, image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500' },
  { id: 'm-10', name: 'PLN Token Listrik 100.000', price: 100500, category: 'Mobile Topup', rating: 4.5, stock: 200, image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=500' },

  // --- GIFT CARDS (10 Products) ---
  { id: 'gc-1', name: 'Google Play Gift Card IDR 50.000', price: 52000, category: 'Gift Cards', rating: 4.0, stock: 30, image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500' },
  { id: 'gc-3', name: 'Netflix Gift Card 1 Month', price: 186000, category: 'Gift Cards', rating: 3.5, stock: 18, image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500' },
  { id: 'gc-5', name: 'Amazon Gift Card $10', price: 160000, category: 'Gift Cards', rating: 3.4, stock: 40, image: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=500' },
  { id: 'gc-7', name: 'Shopee Voucher 100.000', price: 98000, category: 'Gift Cards', rating: 4.3, stock: 45, image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500' },
  { id: 'gc-8', name: 'Grab Gift Voucher 50.000', price: 49000, category: 'Gift Cards', rating: 3.5, stock: 33, image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500' },
  { id: 'gc-9', name: 'GoFood Voucher 50.000', price: 48000, category: 'Gift Cards', rating: 3.2, stock: 28, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500' },
  { id: 'gc-10', name: 'Starbucks Digital Card 100.000', price: 100000, category: 'Gift Cards', rating: 4.3, stock: 19, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500' },

  // --- ENTERTAINMENT (10 Products) ---
  { id: 'e-1', name: 'Netflix Premium 1 Month', price: 54000, category: 'Entertainment', rating: 4.3, stock: 20, image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500' },
  { id: 'e-2', name: 'Disney+ Hotstar VIP 1 Year', price: 199000, category: 'Entertainment', rating: 3.5, stock: 15, image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500' },
  { id: 'e-4', name: 'YouTube Premium 1 Month', price: 59000, category: 'Entertainment', rating: 3.5, stock: 30, image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500' },
  { id: 'e-5', name: 'Viu Premium 3 Months', price: 75000, category: 'Entertainment', rating: 3.7, stock: 18, image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=500' },
  { id: 'e-6', name: 'WeTV VIP Subscription 1 Month', price: 39000, category: 'Entertainment', rating: 4.5, stock: 22, image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500' },
  { id: 'e-7', name: 'HBO Go 1 Month', price: 99000, category: 'Entertainment', rating: 4.3, stock: 12, image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500' },
  { id: 'e-8', name: 'Apple Music Individual 1 Month', price: 55000, category: 'Entertainment', rating: 2.5, stock: 27, image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500' },
  { id: 'e-9', name: 'Vidio Premier Platinum 1 Month', price: 39000, category: 'Entertainment', rating: 4.4, stock: 40, image: 'https://images.unsplash.com/photo-1586899028174-e7098604235b?w=500' },
  { id: 'e-10', name: 'Crunchyroll Mega Fan 1 Month', price: 69000, category: 'Entertainment', rating: 4.5, stock: 16, image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500' },

  
  {
    id: 'gc-6',
    name: 'Tokopedia Gift Card 50.000',
    price: 50000,
    category: 'Gift Cards',
    rating: 4.6,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500', // Digital payment / shopping
  },
  {
    id: 'gc-4',
    name: 'Spotify Premium 3 Months',
    price: 165000,
    category: 'Gift Cards',
    rating: 4.7,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=500', // Spotify app screen
  },
  {
    id: 'e-3',
    name: 'Spotify Family 1 Month',
    price: 79000,
    category: 'Entertainment',
    rating: 4.2,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500', // Headphones / music
  },
  {
    id: 'g-9',
    name: 'Nintendo eShop Card $10',
    price: 160000,
    category: 'Games',
    rating: 4.1,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=500', // Nintendo Switch
  },
  {
    id: 'g-6',
    name: 'Steam Wallet IDR 50.000',
    price: 52000,
    category: 'Games',
    rating: 4.0,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500', // Gaming PC setup
  },
  {
    id: 'm-8',
    name: 'XL Data Combo 12GB',
    price: 65000,
    category: 'Mobile Topup',
    rating: 2.5,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', // Smartphone / data
  },
  {
    id: 'gc-2',
    name: 'Apple App Store Gift Card IDR 100k',
    price: 105000,
    category: 'Gift Cards',
    rating: 2.5,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=500', // Apple setup
  },
];

    export const userEmail:  User | null = localStorage.getItem('auth_user') ? JSON.parse(localStorage.getItem('auth_user') as string) : null;

    console.log('User Email from localStorage:', userEmail?.email);
 


// --- HELPER STORAGE ---

const getStoredProducts = () => {
  const stored = localStorage.getItem('vocamarket_products');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { return []; }
  }
 
  localStorage.setItem('vocamarket_products', JSON.stringify(masterProducts));
  return masterProducts;
};

const saveStoredProducts = (products: any[]) => {
  localStorage.setItem('vocamarket_products', JSON.stringify(products));
};

export const getStoredOrders = (userEmail: string) => {
  const storageKey = `vocamarket_orders_${userEmail}`;
  const stored = localStorage.getItem(storageKey);

  if (stored) {
    return JSON.parse(stored);
  }

  if (userEmail === 'admin@marketplace.com') {
     const initialOrders = [
    { id: 'INV-202660018', productSummary: 'MLBB 86 Diamonds (x2), Steam Wallet $10 (x1)', amount: 14.38, status: 'Completed', date: 'May 20, 2026 10:30 AM' },
    { id: 'INV-202660017', productSummary: 'PUBG UC 60', amount: 0.99, status: 'Pending', date: 'May 20, 2026 09:15 AM' },
    { id: 'INV-202660016', productSummary: 'Google Play Gift Card $5', amount: 5.00, status: 'Completed', date: 'May 19, 2026 08:45 PM' },
    { id: 'INV-202660015', productSummary: 'iTunes Gift Card $10', amount: 10.00, status: 'Failed', date: 'May 19, 2026 07:20 PM' },
    { id: 'INV-202660014', productSummary: 'Free Fire 100 Diamonds', amount: 0.99, status: 'Completed', date: 'May 19, 2026 06:10 PM' },
  ];
    localStorage.setItem(storageKey, JSON.stringify(initialOrders));
    return initialOrders;
  }

  localStorage.setItem(storageKey, JSON.stringify([]));
  return [];
};



const saveStoredOrders = (orders: any[]) => {

  const storageKey = `vocamarket_orders_${userEmail?.email}`;
  localStorage.setItem(storageKey, JSON.stringify(orders));
};

export const handlers = [
// 1. HANDLER LOGIN
  http.post(`${API_URL}/api/auth/login`, async ({ request }) => {
    await delay(1000); 
    const body = await request.json() as any;
     const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
     const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    
    if (body.email === adminEmail && body.password === adminPassword) {
      return HttpResponse.json({
        success: true,
        data: {
          token: 'mock-jwt-token-12345',
          user: { id: '1', name: 'Admin', email: body.email, role: 'admin' }
        }
      });
    }

    const storedUsers = JSON.parse(localStorage.getItem('voca_mocak_users') || '[]');
    const foundUser = storedUsers.find((u: any) => u.email === body.email && u.password === body.password);

    if (foundUser) {
      return HttpResponse.json({
        success: true,
        data: {
          token: `mock-jwt-token-${foundUser.id}`, 
          user: { id: foundUser.id, name: foundUser.name, email: foundUser.email, role: 'user' }
        }
      });
    }

    return HttpResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  }),

  // 2. HANDLER REGISTER
  http.post(`${API_URL}/api/auth/register`, async ({ request }) => {
    await delay(1500); 
    const body = await request.json() as any;

    const storedUsers = JSON.parse(localStorage.getItem('voca_mocak_users') || '[]');
    
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
   

    if (body.email === adminEmail || storedUsers.some((u: any) => u.email === body.email)) {
    return HttpResponse.json(
        { success: false, message: 'Email is already registered' }, 
        { status: 409 }
    );
    }

    const newUser = {
      id: Date.now().toString(),
      name: body.name,
      email: body.email,
      password: body.password 
    };
    
    storedUsers.push(newUser);
    localStorage.setItem('voca_mocak_users', JSON.stringify(storedUsers));

    return HttpResponse.json({ success: true, message: 'Registration successful' }, { status: 201 });
  }),


  // 2. PRODUCTS (Smart Filter/Search/Sort)
 http.get('/api/products', async ({ request }) => {
    await delay(1500); 
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const perPage = parseInt(url.searchParams.get('perPage') || '10', 10);
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || 'All Categories';
    const sortBy = url.searchParams.get('sortBy') || 'Popular';

    // 1. Filtering
    let result = getStoredProducts().filter((item: any) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                            item.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'All Categories' || item.category === category;
      return matchesSearch && matchesCategory;
    });

    // 2. Sorting
    result.sort((a: any, b: any) => {
      if (sortBy === 'Lowest Price') return a.price - b.price;
      if (sortBy === 'Highest Price') return b.price - a.price;
      return b.rating - a.rating; // Popular
    });

    // 3. Pagination Slicing
    const total = result.length;
    const totalPages = Math.ceil(total / perPage);
    const start = (page - 1) * perPage;
    const paginatedProducts = result.slice(start, start + perPage);

    return HttpResponse.json({
      success: true,
      data: {
        products: paginatedProducts,
        total,
        page,
        perPage,
        totalPages,
      },
    });
  }),
// 3. product detail

  http.get('/api/products/:id', ({ params }) => {
  const { id } = params;
  const product = getStoredProducts().find((item: any) => item.id === id);

  if (!product) {
    return HttpResponse.json(
      { success: false, message: 'Product not found' },
      { status: 404 }
    );
  }

  return HttpResponse.json({
    success: true,
    data: product,
  });
}),


  http.post('/api/checkout', async ({ request }) => {
    await delay(1500);
    const body = (await request.json()) as any;
    const products = getStoredProducts();

    for (const item of body.items) {
      const product = products.find((p: any) => p.id === item.id);
      if (product) {
        if (product.stock < item.quantity) {
          return HttpResponse.json(
            { success: false, message: `Product ${product.name} is out of stock!` },
            { status: 409 }
          );
        }
        product.stock -= item.quantity;
      }
    }
    saveStoredProducts(products);

    const newInvoiceId = `INV-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const productSummary = body.items
      .map((item: any) => `${item.name} (x${item.quantity})`)
      .join(', ');

    const newOrder = {
      id: newInvoiceId,
      productSummary,
      amount: body.total,
      status: 'Completed',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    const orders = getStoredOrders(userEmail?.email || '');
    console.log('Existing Orders:', orders, newOrder);
    orders.unshift(newOrder);
    saveStoredOrders(orders);

    return HttpResponse.json({
      success: true,
      message: 'Checkout successful',
      data: newOrder,
    });
  }),

  // 5. ORDERS
 http.get('/api/orders', ({ request }) => {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    if (!email || email === 'undefined' || email === 'null') {
      return HttpResponse.json(
        { success: false, message: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const userOrders = getStoredOrders(email);

    return HttpResponse.json({
      success: true,
      data: userOrders,
    });
  }),

  // 6. Dashboard Stats
  http.get('/api/dashboard/stats', () => {
    return HttpResponse.json({
      success: true,
      data: {
        products: { total: '1,245', growth: '+12.5% vs yesterday' },
        ordersToday: { total: '328', growth: '+8.2% vs yesterday' },
        revenueToday: { total: '$18,245.00', growth: '+15.3% vs yesterday' },
      },
    });
  }),

  // 7. Categories
  http.get('/api/categories', () => {
    return HttpResponse.json({
      success: true,
      data: [
        { id: '1', name: 'Games', itemCount: '1,245 items', icon: 'Gamepad2' },
        { id: '2', name: 'Mobile Topup', itemCount: '320 items', icon: 'Smartphone' },
        { id: '3', name: 'Gift Cards', itemCount: '532 items', icon: 'Gift' },
        { id: '4', name: 'Entertainment', itemCount: '128 items', icon: 'Shield' },
      ],
    });
  }),

  // 8.Recent Orders
  http.get('/api/orders/recent', () => {
    return HttpResponse.json({
      success: true,
      data: [
        { orderId: 'INV-202600017', product: 'MLBB 86 Diamonds', amount: '$1.25', status: 'Completed', time: '2 mins ago' },
        { orderId: 'INV-202600016', product: 'Steam Wallet $10', amount: '$10.00', status: 'Completed', time: '15 mins ago' },
        { orderId: 'INV-202600015', product: 'PUBG UC 60', amount: '$0.99', status: 'Pending', time: '25 mins ago' },
        { orderId: 'INV-202600014', product: 'Google Play $5', amount: '$5.00', status: 'Completed', time: '1 hour ago' },
      ],
    });
  }),

  
];
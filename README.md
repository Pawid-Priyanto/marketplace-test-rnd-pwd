```markdown
# VocaMarket — Production-Ready Marketplace Web Application

A modern, scalable, and maintainable E-Commerce Marketplace application built with **React**, **TypeScript**, **Tailwind CSS**, and **Mock Service Worker (MSW)**.

This project is architected with production standards in mind—featuring a decoupled API abstraction layer, real-world backend simulation, persistent storage management, and a clean UI/UX system.

---

## 🚀 Features

- **Authentication System**: Secure login flow and simulated JWT token management.
- **Product Catalog & Discovery**:
  - Browse available products with responsive grid layouts.
  - Real-time client & server search filter.
  - Category filtration & multi-attribute sorting (Price, Name, Popularity).
  - Product detail modal/view with dynamic stock availability.
- **Cart & Checkout Engine**:
  - Interactive shopping cart management.
  - Multi-step checkout process with real-time stock verification.
  - Conflict handling (e.g., stock depletion / insufficient stock).
- **Order History Dashboard**:
  - Transaction tracking with order status filtering (`All`, `Completed`, `Pending`, `Failed`).
  - Search order history by Invoice ID or Product Name.
  - Pagination system for high-volume transactions.
- **Resilient UI/UX States**:
  - Granular loading indicators (spinners).
  - Graceful error states and fallback handling for unbuilt pages (404/Coming Soon).

---

## 🛠️ Tech Stack & Key Libraries

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, `clsx` + `tailwind-merge` (`cn` utility pattern)
- **Icons**: Lucide React
- **API Mocking & Backend Simulation**: Mock Service Worker (MSW)
- **Data Persistence Layer**: Browser `localStorage` (Isolated store strategy)
- **Routing**: React Router v6

---

## 🏗️ Architecture & Engineering Decisions

### 1. Seamless API Abstraction Layer
To ensure the application can effortlessly transition from MSW mocks to a real backend in production, all API calls are abstracted behind dedicated service layers (e.g., `OrderService`, `ProductService`).
- UI components **never** directly call `fetch` or `axios`.
- Endpoints and base URLs are defined centrally. Swapping MSW for a real REST API only requires updating the endpoint configuration or environment variables without touching UI logic.

### 2. Real-World Backend Simulation (MSW)
The Mock Service Worker intercepts requests at the network layer, simulating production conditions:
- **Network Latency**: Artificial response delays (e.g., `delay(1500)`) to test loading spinners and skeleton UI.
- **Stock Depletion Logic**: Atomically reduces available stock upon checkout and returns a `409 Conflict` status if requested quantities exceed inventory.
- **HTTP Status Codes**: Simulates `200 OK`, `401 Unauthorized`, `409 Conflict`, and `500 Internal Server Error`.

### 3. Decoupled Persistence Strategy
Data integrity between master products and order records is preserved in `localStorage` via segregated storage keys:
- `vocamarket_products`: Holds master inventory catalog and live stock counts.
- `vocamarket_orders`: Holds immutable historical transaction logs.

### 4. Modular Component Architecture & Utility Patterns
- **Utility Class Management**: Implemented a central `cn()` helper blending `clsx` and `tailwind-merge` to handle conditional dynamic classes without Tailwind specificity conflicts.
- **Design System Consistency**: Reusable UI components (`Button`, `Header`, `Sidebar`, Modal wrappers) adhering to modern accessible design standards.

---

## 📋 Assumptions Made

1. **User Session**: User authentication state is simulated and maintained across sessions using browser storage.
2. **Stock Verification**: Stock verification occurs synchronously during checkout within MSW handlers.
3. **Undeveloped Features Graceful Fallback**: Any navbar menu or route not currently within the phase-1 scope routes to an interactive **"Feature Coming Soon"** fallback page to maintain UI continuity.

---

## 🚦 Getting Started & Local Setup

### Prerequisites
- **Node.js**: `v18.x` or higher
- **Package Manager**: `npm` or `yarn` / `pnpm`

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone [https://github.com/your-username/vocamarket.git](https://github.com/your-username/vocamarket.git)
   cd vocamarket

```

2. **Install Dependencies**
```bash
npm install

```


3. **Start the Development Server**
```bash
npm run dev

```


*Note: MSW worker will automatically register in the browser environment.*
4. **Open in Browser**
Navigate to `http://localhost:5173` (or the port displayed in your terminal).

```

```
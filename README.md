<div align="center">

# 🛒 VocaMarket

**A Production-Ready Digital Marketplace Web Application**

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MSW](https://img.shields.io/badge/MSW-2.x-FF6A00?style=for-the-badge&logo=mockserviceworker&logoColor=white)](https://mswjs.io/)
[![Vitest](https://img.shields.io/badge/Vitest-1.x-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)

---

A modern, scalable, and maintainable E-Commerce Marketplace application built with production standards in mind—featuring a decoupled API abstraction layer, real-world backend simulation, persistent storage management, and full E2E integration testing.

</div>

<br />

> 🎯 **Key Focus**: Decoupled architecture, realistic API simulation, robust edge-case handling (stock conflicts, network latency), and comprehensive testing.

---

## ⚡ Quick Links

- [🚀 Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Architecture & Engineering](#️-architecture--engineering)
- [🚦 Getting Started](#-getting-started--local-setup)
- [🧪 Running Tests](#-testing)

---

## 🚀 Key Features

### 🔐 Authentication System
- Secure login and registration flows.
- Simulated JWT token management with route guards (`ProtectedRoute` & `GuestRoute`).

### 🛍️ Product Catalog & Discovery
- Responsive product grid with real-time client & server search.
- Multi-attribute filtering & sorting (**Price**, **Name**, **Popularity**).
- Product details with dynamic live stock indicators.

### 🛒 Cart & Checkout Engine
- Interactive real-time cart state management using Zustand.
- Multi-step checkout pipeline with instant stock verification.
- **Conflict Resolution**: Handles stock depletion and out-of-stock edge cases gracefully.

### 📜 Order History Dashboard
- Comprehensive transaction logs with invoice generation (e.g., `INV-XXXXXX`).
- Status filtering (`All`, `Completed`, `Pending`, `Failed`).
- Instant search by Invoice ID or Product Name with pagination support.

### 🎨 Resilient UI/UX States
- Granular loading indicators and skeleton fallbacks.
- Interactive **"Feature Coming Soon"** fallbacks for unbuilt routes.

---

## 🛠️ Tech Stack

| Domain | Technologies Used |
| :--- | :--- |
| **Core Framework** | React 18, TypeScript, Vite |
| **State Management** | Zustand (Auth & Cart stores) |
| **Styling & UI** | Tailwind CSS, Lucide Icons, `clsx` + `tailwind-merge` (`cn` utility) |
| **Routing** | React Router v6 |
| **API Abstraction & Mocking** | Custom Service Layer + Mock Service Worker (MSW) |
| **Testing** | Vitest, React Testing Library, `jsdom` |
| **Persistence** | Browser `localStorage` (Isolated store strategy) |

---

## 🏗️ Architecture & Engineering Decisions

### 1. 🔌 Seamless API Abstraction Layer
All HTTP calls are isolated within dedicated service modules (e.g., `OrderService`, `ProductService`).
- Components **never** call `fetch` or `axios` directly.
- Switching from MSW mock handlers to a live production backend requires **zero UI changes**—simply update the endpoint configuration.

### 2. 🎭 Real-World Backend Simulation (MSW)
MSW intercepts network requests at the browser worker level to mimic real API behavior:
- **Artificial Latency**: Simulated network delays (`delay(1500)`) to test loading UI states.
- **Atomic Stock Management**: Decrements inventory upon checkout and fires `409 Conflict` if demand exceeds supply.
- **HTTP Status Codes**: Simulates realistic `200 OK`, `401 Unauthorized`, `409 Conflict`, and `500 Server Error` responses.

### 3. 💾 Decoupled Persistence Strategy
Master products and order logs are isolated in `localStorage` under segregated keys:
- `vocamarket_products`: Live inventory catalog and stock counts.
- `vocamarket_orders`: Immutable transaction history logs.

### 4. 🎨 Utility Patterns & Design System
- **Centralized `cn()` Utility**: Combines `clsx` and `tailwind-merge` to resolve dynamic class conflicts cleanly.
- **Modular Components**: Reusable, accessible UI components (`Button`, `Modal`, `Header`, `Sidebar`).

---

## 📋 Key Assumptions

1. **User Sessions**: Auth state is maintained via browser storage across page refreshes.
2. **Synchronous Inventory Check**: Stock verification occurs during checkout submission in MSW handlers.
3. **Graceful Routing**: Scope-2 routes automatically render an interactive **"Coming Soon"** view to preserve navigation flow.

---

## 🚦 Getting Started & Local Setup

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **Package Manager**: `npm` (v9+) or `yarn` / `pnpm`

### Installation

```bash
# 1. Clone the repository
git clone [https://github.com/Pawid-Priyanto/marketplace-test-rnd-pwd.git](https://github.com/Pawid-Priyanto/marketplace-test-rnd-pwd.git)

# 2. Navigate into the project directory
cd your-project-name

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
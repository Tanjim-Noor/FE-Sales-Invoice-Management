# Sales Invoice Management System - Frontend

A simple, clean demonstration frontend for the Sales Invoice Management System built with **Vite + React + TypeScript + Tailwind CSS**.

![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Vite](https://img.shields.io/badge/Vite-7-purple) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-cyan)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at **http://localhost:5173**

Default login credentials:
- **Username**: `admin`
- **Password**: `admin123`

> **Note**: Make sure the backend API is running at `http://127.0.0.1:8000` before starting the frontend.

For complete setup instructions including backend setup, see [QUICK_START.md](./QUICK_START.md)

## 📋 Features

### ✅ Authentication
- Login with JWT authentication
- Token storage in localStorage
- Protected routes with automatic redirect
- Logout functionality

### ✅ Invoice Management
- **View invoices** - Paginated list with search and filters
- **Create invoices** - Dynamic form with multiple items
- **Invoice details** - Complete view with items and transactions
- **Mark as paid** - Update invoice status
- **Delete invoices** - Remove with confirmation

### ✅ Transaction Management
- View all transactions (Sale/Payment)
- Filter by transaction type
- Navigate to related invoices

### ✅ Dashboard
- Quick stats (Total, Pending, Paid)
- Quick action links

## 🛠️ Technology Stack

- **Vite** - Fast build tool and dev server
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first styling with Vite plugin
- **Axios** - HTTP client for API calls
- **React Router v6** - Client-side routing

## 📁 Project Structure

```
src/
├── api/
│   └── client.ts          # Axios setup + all API functions
├── components/
│   ├── Navbar.tsx         # Navigation bar
│   └── ProtectedRoute.tsx # Route protection wrapper
├── pages/
│   ├── LoginPage.tsx      # Login page
│   ├── HomePage.tsx       # Dashboard with stats
│   ├── InvoicesPage.tsx   # Invoice list with filters
│   ├── CreateInvoicePage.tsx  # Create invoice form
│   ├── InvoiceDetailPage.tsx  # Invoice details view
│   └── TransactionsPage.tsx   # Transaction list
├── types/
│   └── index.ts           # TypeScript interfaces
├── App.tsx                # Main app with routing
├── main.tsx               # Entry point
└── index.css              # Tailwind CSS imports
```

## 🌐 Available Routes

| Route | Description | Protected |
|-------|-------------|-----------|
| `/login` | Login page | No |
| `/` | Dashboard/Home page | Yes |
| `/invoices` | Invoice list | Yes |
| `/invoices/create` | Create new invoice | Yes |
| `/invoices/:id` | Invoice details | Yes |
| `/transactions` | Transaction list | Yes |

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run tsc

# Linting
npm run lint
```

## 🔌 API Integration

The frontend communicates with the Django backend API. All API calls are centralized in `src/api/client.ts`.

**Backend URL**: `http://127.0.0.1:8000/api/v1` (configurable via `.env`)

### API Endpoints Used

- `POST /auth/login/` - User authentication
- `GET /invoices/` - List invoices (with pagination and filters)
- `POST /invoices/` - Create invoice
- `GET /invoices/:id/` - Get invoice details
- `POST /invoices/:id/pay/` - Mark invoice as paid
- `DELETE /invoices/:id/` - Delete invoice
- `GET /transactions/` - List transactions

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

## 🎨 Styling

This project uses **Tailwind CSS v4** with the Vite plugin for fast, utility-first styling:

- Blue theme for primary actions
- Green for success/paid states
- Yellow for pending states
- Red for delete/danger actions
- Fully responsive design

## 🐛 Troubleshooting

**Issue**: Can't log in
- Verify backend is running on port 8000
- Check credentials (admin/admin123)
- Check browser console for errors

**Issue**: API calls failing
- Ensure `VITE_API_BASE_URL` in `.env` matches your backend URL
- Check CORS settings in backend
- Verify backend database is running

**Issue**: Styling not working
- Make sure `@tailwindcss/vite` is installed
- Verify `vite.config.ts` includes the Tailwind plugin
- Restart the dev server

## 📚 Documentation

- **Quick Start Guide**: [QUICK_START.md](./QUICK_START.md)
- **Implementation Summary**: [SUMMARY.md](./SUMMARY.md)
- **Backend API Docs**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Interactive API Docs**: http://127.0.0.1:8000/api/docs/

## 🤝 Backend Setup

This frontend requires the Django backend to be running. See the backend setup instructions in the Quick Start guide.

## 📝 Notes

This is a **demonstration frontend** designed to showcase the backend API functionality with:

- Simple, clean code
- Minimal dependencies
- Basic error handling
- No complex state management
- No edit invoice functionality (demo scope)

For production use, consider adding:
- Form validation libraries (React Hook Form + Zod)
- Toast notifications
- Token refresh logic
- Loading skeletons
- Unit and integration tests

## 📄 License

This is a demonstration project for educational purposes.

---

**Built with ❤️ using Vite + React + TypeScript + Tailwind CSS**

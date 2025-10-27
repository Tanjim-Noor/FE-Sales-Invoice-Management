# Quick Start Guide - Sales Invoice Management System

This guide will help you get the complete system (backend + frontend) up and running quickly.

## Prerequisites

- Python 3.13+
- Node.js 18+
- Docker & Docker Compose (for PostgreSQL)
- Git

## Step 1: Start the Backend

### 1.1 Start PostgreSQL Database

```bash
# Navigate to docker directory
cd docker

# Start PostgreSQL container
docker compose up -d

# Verify it's running
docker compose ps
```

### 1.2 Set up Python Environment

```bash
# Navigate back to project root
cd ..

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 1.3 Configure Environment

```bash
# Copy environment file
cp .env.example .env

# Edit .env if needed (database credentials should match docker setup)
```

### 1.4 Run Migrations

```bash
# Apply database migrations
python manage.py migrate

# Create superuser (for admin access)
python manage.py createsuperuser
# Username: admin
# Password: admin123
```

### 1.5 Start Backend Server

```bash
# Start Django development server
python manage.py runserver
```

Backend should now be running at: **http://127.0.0.1:8000**
- API Documentation: http://127.0.0.1:8000/api/docs/

## Step 2: Start the Frontend

Open a **NEW terminal** window (keep backend running):

### 2.1 Install Dependencies

```bash
# Make sure you're in the project root directory
npm install
```

This will install all required dependencies including:
- React 18 and React DOM
- TypeScript
- Vite 7
- Tailwind CSS v4 with Vite plugin (`@tailwindcss/vite`)
- Axios for API calls
- React Router v6 for routing

### 2.2 Configure Environment

The `.env` file should already exist with:
```
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

If not, create it from `.env.example`:
```bash
cp .env.example .env
```

### 2.3 Start Frontend Server

```bash
# Start Vite development server
npm run dev
```

Frontend should now be running at: **http://localhost:5173**

## Step 3: Access the Application

1. **Open your browser** and navigate to: http://localhost:5173

2. **Login** with default credentials:
   - Username: `admin`
   - Password: `admin123`

3. **Start using the application**:
   - View the dashboard
   - Create invoices
   - Mark invoices as paid
   - View transactions

## Common Commands

### Backend

```bash
# Start backend (with venv activated)
python manage.py runserver

# Run migrations
python manage.py migrate

# Create sample data
python manage.py shell
```

### Frontend

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Database

```bash
# Start database
cd docker && docker compose up -d

# Stop database
docker compose down

# Stop and remove all data (⚠️ destroys database)
docker compose down -v

# View logs
docker compose logs -f postgres
```

## Testing the System

### 1. Create an Invoice

1. Click "Create New Invoice" on the dashboard
2. Fill in the form:
   - Reference Number: `INV-2025-001`
   - Customer Name: `Test Customer`
   - Customer Email: `test@example.com`
3. Add an item:
   - Description: `Web Development`
   - Quantity: `10`
   - Unit Price: `100`
4. Click "Create Invoice"

### 2. View Invoice Details

1. Go to "Invoices" page
2. Click "View" on the invoice you created
3. See all details including the auto-created "Sale" transaction

### 3. Mark as Paid

1. In the invoice details page, click "Mark as Paid"
2. The status changes to "Paid"
3. A new "Payment" transaction is automatically created

### 4. View Transactions

1. Go to "Transactions" page
2. See both Sale and Payment transactions
3. Click on the invoice reference to navigate back to the invoice

## Troubleshooting

### Backend Issues

**Database connection error:**
```bash
# Check if PostgreSQL is running
cd docker && docker compose ps

# Restart PostgreSQL
docker compose restart postgres
```

**Migration errors:**
```bash
# Reset migrations (⚠️ destroys data)
python manage.py migrate --run-syncdb
```

### Frontend Issues

**Can't connect to API:**
- Verify backend is running on port 8000
- Check `.env` file has correct `VITE_API_BASE_URL`
- Check browser console for CORS errors

**Build errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Tailwind CSS not working:**
```bash
# Rebuild the project
npm run dev
```

## Stopping the System

1. **Stop Frontend**: Press `Ctrl+C` in the frontend terminal

2. **Stop Backend**: Press `Ctrl+C` in the backend terminal

3. **Stop Database**: 
   ```bash
   cd docker
   docker compose down
   ```

## Next Steps

- Read the full documentation: `README_frontend.md` and `README_backend.md`
- Explore the API documentation: http://127.0.0.1:8000/api/docs/
- Read the API reference: `API_DOCUMENTATION.md`

## Support

If you encounter any issues:
1. Check the terminal output for error messages
2. Review the troubleshooting section above
3. Check browser console for frontend errors
4. Verify all services are running (database, backend, frontend)

---

**Happy coding! 🚀**

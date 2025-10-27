import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-slate-900 text-white shadow-md border-b border-slate-800">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-12">
            <Link to="/" className="text-xl font-semibold hover:text-slate-200 transition-colors">
              Invoice Manager
            </Link>
            <div className="flex space-x-8">
              <Link to="/" className="text-sm hover:text-slate-200 transition-colors">
                Dashboard
              </Link>
              <Link to="/invoices" className="text-sm hover:text-slate-200 transition-colors">
                Invoices
              </Link>
              <Link to="/transactions" className="text-sm hover:text-slate-200 transition-colors">
                Transactions
              </Link>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-slate-700 hover:bg-slate-600 px-5 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
